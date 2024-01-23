import { VStack, MailIcon, Button, Text } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { getAuth, sendPasswordResetEmail } from "@firebase/auth";
import { authSafeArea } from "../config/constants";
import { AuthHeader, CSNInput, AuthBackButton } from "../components";
import { screens } from "../config/screens";
import { colors } from "../config/colors";
import { getFirebaseApp } from "../helpers/firebaseHelpers";

const EmailForNewPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onPress = useCallback(async () => {
    setIsLoading(true);
    const app = getFirebaseApp();
    const auth = getAuth(app);

    await sendPasswordResetEmail(auth, email);

    setIsLoading(false);
    router.replace({
      pathname: screens.LogIn,
    });
  }, [email]);

  return (
    <SafeAreaView style={authSafeArea}>
      <VStack px={16} space="4xl">
        <AuthHeader
          title="Email for new password"
          subTitle="Please enter your email."
        />

        <CSNInput
          label="Email"
          placeholder="Your email here"
          isRequired
          leftIcon={MailIcon}
          onChangeValue={(value) => setEmail(value)}
        />

        <Button
          borderRadius={10}
          h={40}
          onPress={onPress}
          isDisabled={!email.length || !/\S+@\S+\.\S+/.test(email) || isLoading}
        >
          <Text color={colors.primaryBlack}>Submit</Text>
        </Button>

        <AuthBackButton href={screens.LogIn} backText="Back to log in" />
      </VStack>
    </SafeAreaView>
  );
};

export default EmailForNewPassword;
