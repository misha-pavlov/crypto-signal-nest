import { appleAuth as appleAuthLib } from "@invertase/react-native-apple-authentication";
import { Router } from "expo-router/build/types";
import { showMessage } from "react-native-flash-message";
import { customEvent } from "vexo-analytics";
import { screens } from "../../config/screens";
import { AppDispatch } from "../../store/store";
import { signInWithAppleCredential } from "../actions/authActions";

export const appleAuth = async (dispatch: AppDispatch, router: Router) => {
  try {
    const appleAuthRequestResponse = await appleAuthLib.performRequest({
      requestedOperation: appleAuthLib.Operation.LOGIN,
      requestedScopes: [appleAuthLib.Scope.EMAIL, appleAuthLib.Scope.FULL_NAME],
    });

    const credentialState = await appleAuthLib.getCredentialStateForUser(
      appleAuthRequestResponse.user
    );

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuthLib.State.AUTHORIZED) {
      const { identityToken, nonce } = appleAuthRequestResponse;

      if (identityToken && nonce) {
        const uid = await signInWithAppleCredential(
          identityToken,
          nonce,
          dispatch
        );

        if (uid) {
          router.replace(screens.FaceId);
        }
      }
    }
  } catch (error) {
    const errorText = "Apple auth error";
    console.error(errorText, error);
    customEvent(errorText, error);
    showMessage({
      message: errorText,
      type: "danger",
      titleStyle: { fontFamily: "Exo2-Bold" },
    });
  }
};
