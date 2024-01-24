import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Router } from "expo-router/build/types";
import { showMessage } from "react-native-flash-message";
import { customEvent } from "vexo-analytics";
import { screens } from "../../config/screens";
import { AppDispatch } from "../../store/store";
import { signUpForGoogle } from "../actions/authActions";

export const googleSignIn = async (dispatch: AppDispatch, router: Router) => {
  try {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID, // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
      scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    });

    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    const { name, email, photo, id } = userInfo.user;
    const userId = await dispatch(
      signUpForGoogle({
        name: name || "Google user",
        email,
        photo: photo || undefined,
        password: id,
      })
    );

    console.log("🚀 ~ googleSignIn ~ userId:", userId);

    if (userId) {
      showMessage({
        message: "You did it",
        type: "success",
        titleStyle: { fontFamily: "Exo2-Bold" },
      });

      router.replace({
        pathname: screens.LogIn,
      });
    }
  } catch (error) {
    if (error?.code) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          // sign in was cancelled
          break;
        default:
          console.error("Google signin code error", error);
          break;
      }
    } else {
      const errorText = "Google signin error";
      console.error(errorText, error);
      customEvent(errorText, error);
      showMessage({
        message: errorText,
        type: "danger",
        titleStyle: { fontFamily: "Exo2-Bold" },
      });
    }
  }
};
