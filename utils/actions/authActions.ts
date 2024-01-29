import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { child, getDatabase, ref, set } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
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
  withGoogle?: boolean;
};

const createUser = async (params: CreateUserParamsType) => {
  const { name, email, userId } = params;
  const userData: UserType = {
    name,
    email,
    _id: userId,
    cryptoList: [],
    plan: "basic",
    verified: !!params?.withGoogle,
    signUpDate: new Date().toISOString(),
    avatar: params?.avatar,
    withGoogle: params?.withGoogle,
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
  return async (dispatch: AppDispatch) => {
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
    const app = getFirebaseApp();
    const auth = getAuth(app);
    const user = await getUserData(userId);

    try {
      if (user && user?.password) {
        const result = await signInWithEmailAndPassword(
          auth,
          user?.email,
          user?.password
        );
        // @ts-ignore according type stsTokenManager doesn't exist, but acually it does
        const { uid, stsTokenManager } = result.user;
        const { accessToken, expirationTime } = stsTokenManager;

        const expiryDate = new Date(expirationTime);
        const userData = await getUserData(uid);
        const timeNow = new Date();
        const millisecondsUntilExpiry = Number(expiryDate) - Number(timeNow);

        dispatch(authenticate({ token: accessToken, userData }));
        saveDataToStorage(accessToken, uid, expiryDate);

        timer = setTimeout(() => {
          dispatch(userLogout());
        }, millisecondsUntilExpiry);
      }
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

export const signInWithGoogleCredential = async (
  idToken: string,
  dispatch: AppDispatch
) => {
  const app = getFirebaseApp();
  const auth = getAuth(app);

  const credential = GoogleAuthProvider.credential(idToken);

  try {
    const result = await signInWithCredential(auth, credential);
    // @ts-ignore according type stsTokenManager doesn't exist, but acually it does
    const { uid, stsTokenManager } = result.user;
    const { accessToken, expirationTime } = stsTokenManager;

    const expiryDate = new Date(expirationTime);
    const userData = await getUserData(uid);

    const timeNow = new Date();
    const millisecondsUntilExpiry = Number(expiryDate) - Number(timeNow);

    dispatch(authenticate({ token: accessToken, userData }));
    saveDataToStorage(accessToken, uid, expiryDate);

    timer = setTimeout(() => {
      dispatch(userLogout());
    }, millisecondsUntilExpiry);

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
