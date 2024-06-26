import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  OAuthCredential,
  OAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { child, getDatabase, ref, set } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import appleAuth from "@invertase/react-native-apple-authentication";
import { getFirebaseApp } from "../../helpers/firebaseHelpers";
import { AppDispatch } from "../../store/store";
import { authenticate, logout } from "../../store/authSlice";
import { mmkvStorage } from "../../config/mmkvStorage";
import { mmkvStorageKeys } from "../../config/constants";
import { UserType } from "../../types/User.type";
import { getUserData } from "./userActions";

let timer: NodeJS.Timeout;

export const signUp = (params: {
  name: string;
  email: string;
  password: string;
}) => {
  return async (dispatch: AppDispatch) => {
    const { email, password, name } = params;
    const app = getFirebaseApp();
    const auth = getAuth(app);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // @ts-ignore according type stsTokenManager doesn't exist, but acually it does
      const { uid, stsTokenManager } = result.user;
      const { accessToken, expirationTime } = stsTokenManager;

      const expiryDate = new Date(expirationTime);
      const userData = await createUser({
        name,
        email,
        userId: uid,
      });
      const timeNow = new Date();
      const millisecondsUntilExpiry = Number(expiryDate) - Number(timeNow);

      dispatch(authenticate({ token: accessToken, userData }));
      saveDataToStorage(accessToken, uid, expiryDate);

      timer = setTimeout(() => {
        dispatch(userLogout());
      }, millisecondsUntilExpiry);

      return uid;
    } catch (error) {
      const errorCode = (error as { code: string }).code;
      let message = "Something went wrong";

      if (errorCode === "auth/email-already-in-use") {
        message = "This email is already in use";
      }

      showMessage({
        message,
        type: "danger",
        titleStyle: { fontFamily: "Exo2-Bold" },
      });

      throw new Error(message);
    }
  };
};

type CreateUserParamsType = {
  name: string;
  email: string;
  userId: string;
  avatar?: string | null;
};

const createUser = async (params: CreateUserParamsType) => {
  const { name, email, userId } = params;
  const userData: UserType = {
    name,
    email,
    _id: userId,
    cryptoList: JSON.stringify([]),
    plan: "basic",
    verified: true,
    signUpDate: new Date().toISOString(),
    avatar: params?.avatar || null,
  };

  const dbRef = ref(getDatabase());
  const childRef = child(dbRef, `users/${userId}`);
  await set(childRef, userData);

  return userData;
};

const saveDataToStorage = (token: string, userId: string, expiryDate: Date) => {
  mmkvStorage.set(
    mmkvStorageKeys.userData,
    JSON.stringify({
      token,
      userId,
      expiryDate,
    })
  );
  AsyncStorage.setItem(
    mmkvStorageKeys.userData,
    JSON.stringify({
      token,
      userId,
      expiryDate,
    })
  );

  return;
};

export const userLogout = () => {
  console.log('1')
  return async (dispatch: AppDispatch) => {
    console.log('2')
    mmkvStorage.clearAll();
    clearTimeout(timer);
    dispatch(logout());
  };
};

export const signIn = (params: { email: string; password: string }) => {
  return async (dispatch: AppDispatch) => {
    const { email, password } = params;
    const app = getFirebaseApp();
    const auth = getAuth(app);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // @ts-ignore according type stsTokenManager doesn't exist, but acually it does
      const { uid, stsTokenManager } = result.user;
      const { accessToken, expirationTime } = stsTokenManager;

      const expiryDate = new Date(expirationTime);
      const userData = await getUserData(uid);

      if (!userData?.verified) {
        showMessage({
          message: "User is not verified",
          type: "danger",
          titleStyle: { fontFamily: "Exo2-Bold" },
        });

        return { userId: uid, verified: false };
      }

      const timeNow = new Date();
      const millisecondsUntilExpiry = Number(expiryDate) - Number(timeNow);

      dispatch(authenticate({ token: accessToken, userData }));
      saveDataToStorage(accessToken, uid, expiryDate);
      mmkvStorage.set(mmkvStorageKeys.password, password);

      timer = setTimeout(() => {
        dispatch(userLogout());
      }, millisecondsUntilExpiry);

      return { userId: uid, verified: true };
    } catch (error) {
      const errorCode = (error as { code: string }).code;
      let message = "Something went wrong";

      if (errorCode === "auth/invalid-login-credentials") {
        message = "The username or password was incorrect";
      }

      showMessage({
        message,
        type: "danger",
        titleStyle: { fontFamily: "Exo2-Bold" },
      });

      throw new Error(message);
    }
  };
};

export const faceIdSignIn = (userId: string) => {
  return async (dispatch: AppDispatch) => {
    const user = await getUserData(userId);

    try {
      if (user) {
        const isGoogleUser = mmkvStorage.getBoolean(
          mmkvStorageKeys.isGoogleUser
        );
        const isAppleUser = mmkvStorage.getBoolean(mmkvStorageKeys.isAppleUser);

        if (isGoogleUser) {
          const idToken = mmkvStorage.getString(mmkvStorageKeys.idToken);

          if (idToken) {
            return signInWithGoogleCredential(idToken, dispatch);
          }

          throw new Error();
        } else if (isAppleUser) {
          const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.REFRESH,
          });

          const { identityToken: idToken, nonce: rawNonce } =
            appleAuthRequestResponse;

          if (idToken && rawNonce) {
            return signInWithAppleCredential(idToken, rawNonce, dispatch);
          }

          throw new Error();
        } else {
          const password = mmkvStorage.getString(mmkvStorageKeys.password);
          const email = user.email;

          if (email && password) {
            const { userId } = await dispatch(signIn({ email, password }));
            return userId;
          }

          throw new Error();
        }
      }
    } catch (error) {
      const message = "Something went wrong";

      showMessage({
        message,
        type: "danger",
        titleStyle: { fontFamily: "Exo2-Bold" },
      });

      throw new Error(message);
    }
  };
};

const csnSignInWithCredential = async (
  auth: Auth,
  credential: OAuthCredential,
  dispatch: AppDispatch
) => {
  const result = await signInWithCredential(auth, credential);
  // @ts-ignore according type stsTokenManager doesn't exist, but acually it does
  const { uid, stsTokenManager } = result.user;
  const { accessToken, expirationTime } = stsTokenManager;

  const expiryDate = new Date(expirationTime);
  const userData = await getUserData(uid);
  const timeNow = new Date();
  const millisecondsUntilExpiry = Number(expiryDate) - Number(timeNow);

  if (!userData) {
    const newUser = result.user;
    const createdUser = await createUser({
      name:
        newUser?.displayName ||
        newUser?.email ||
        `user ${Math.floor(10000 + Math.random() * 90000)}`,
      email: newUser?.email || "no email :(",
      userId: uid,
      avatar: newUser?.photoURL,
    });

    dispatch(authenticate({ token: accessToken, userData: createdUser }));
  } else {
    dispatch(authenticate({ token: accessToken, userData }));
  }

  saveDataToStorage(accessToken, uid, expiryDate);

  timer = setTimeout(() => {
    dispatch(userLogout());
  }, millisecondsUntilExpiry);

  return uid;
};

export const signInWithGoogleCredential = async (
  idToken: string,
  dispatch: AppDispatch
) => {
  const app = getFirebaseApp();
  const auth = getAuth(app);
  const credential = GoogleAuthProvider.credential(idToken);

  try {
    const uid = await csnSignInWithCredential(auth, credential, dispatch);
    mmkvStorage.set(mmkvStorageKeys.isGoogleUser, true);
    mmkvStorage.set(mmkvStorageKeys.idToken, idToken);
    mmkvStorage.set(mmkvStorageKeys.isAppleUser, false);
    return uid;
  } catch (error) {
    const message = "Something went wrong with google credential sign in";

    showMessage({
      message,
      type: "danger",
      titleStyle: { fontFamily: "Exo2-Bold" },
    });

    throw new Error(message);
  }
};

export const signInWithAppleCredential = async (
  idToken: string,
  rawNonce: string,
  dispatch: AppDispatch
) => {
  const app = getFirebaseApp();
  const auth = getAuth(app);
  const provider = new OAuthProvider("apple.com");
  const credential = provider.credential({ idToken, rawNonce });

  try {
    const uid = await csnSignInWithCredential(auth, credential, dispatch);
    mmkvStorage.set(mmkvStorageKeys.isAppleUser, true);
    mmkvStorage.set(mmkvStorageKeys.isGoogleUser, false);
    return uid;
  } catch (error) {
    const message = "Something went wrong with apple credential sign in";

    showMessage({
      message,
      type: "danger",
      titleStyle: { fontFamily: "Exo2-Bold" },
    });

    throw new Error(message);
  }
};
