import { appleAuth as appleAuthLib } from "@invertase/react-native-apple-authentication";
import { Router } from "expo-router/build/types";
import { showMessage } from "react-native-flash-message";
import { customEvent } from "vexo-analytics";
import { screens } from "../../config/screens";
import { AppDispatch } from "../../store/store";
import { signIn, signUpForGoogle } from "../actions/authActions";

export const appleAuth = async (
  dispatch: AppDispatch,
  router: Router,
  isSignIn = false
) => {
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
      const { user, fullName } = appleAuthRequestResponse;
      let userId;
      const email = `${user.replaceAll('.', '')}@fake.com`;

      if (isSignIn) {
        userId = await dispatch(signIn({ email, password: user }));
      } else {
        userId = await dispatch(
          signUpForGoogle({
            name: fullName?.familyName
              ? `${fullName?.familyName} ${fullName?.givenName}`
              : "Apple user",
            email,
            password: user,
          })
        );
      }

      if (userId) {
        if (!isSignIn) {
          showMessage({
            message: "You did it",
            type: "success",
            titleStyle: { fontFamily: "Exo2-Bold" },
          });
        }

        router.replace({
          pathname: isSignIn ? screens.FaceId : screens.LogIn,
        });
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
