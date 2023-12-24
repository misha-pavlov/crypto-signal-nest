import {
  View,
  Text,
  Button,
  VStack,
  MailIcon,
  LockIcon,
} from "@gluestack-ui/themed";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { mmkvStorage } from "../config/mmkvStorage";
import { authSafeArea, mmkvStorageKeys } from "../config/constants";
import { withStyledProvider } from "../hocs/withStyledProvider";
import { screens } from "../config/screens";
import { colors } from "../config/colors";
import { AuthHeader, CSNInput, AuthBottom } from "../components";

// TODO: add mmkvStorage.delete(mmkvStorageKeys.wasStartScreenShown) on login

const Login = () => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      const savedUserId = await mmkvStorage.getString(
        mmkvStorageKeys.savedUserId
      );

      if (savedUserId) {
        const biometricAuth = await LocalAuthentication.authenticateAsync({
          promptMessage: "Login with Biometrics",
          disableDeviceFallback: true,
        });

        if (biometricAuth.success) {
          console.log("123");
        }
      } else {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setIsBiometricSupported(compatible);
      }
    })();
    return () => abortController.abort();
  });

  return (
    <SafeAreaView style={authSafeArea}>
      <VStack justifyContent="space-between" flex={1} px={16}>
        <View>
          <AuthHeader
            title="Log in to your account"
            subTitle="Welcome back! Please enter your details."
          />

          <VStack mt={24} space="2xl" mb={8}>
            <CSNInput
              label="Email"
              placeholder="Enter unique email"
              isRequired
              leftIcon={MailIcon}
            />

            <CSNInput
              label="Password"
              placeholder="Enter valid password"
              isRequired
              isPassword
              leftIcon={LockIcon}
            />
          </VStack>

          <View mt={8} mb={24} alignItems="flex-end">
            <Link href={screens.EmailForNewPassword}>
              <Text
                fontFamily="$bold"
                fontSize={14}
                lineHeight={14}
                color={colors.white}
              >
                Forgot password?
              </Text>
            </Link>
          </View>

          <VStack space="lg">
            <Button
              borderRadius={10}
              h={40}
              onPress={() =>
                isBiometricSupported
                  ? router.replace({
                      pathname: screens.FaceId,
                      params: {
                        userId: "qwe",
                      },
                    })
                  : console.log("asd")
              }
            >
              <Text color={colors.primaryBlack}>Log in</Text>
            </Button>

            <Button borderRadius={10} h={40}>
              <Text color={colors.primaryBlack}>Log in with Google</Text>
            </Button>

            <Button borderRadius={10} h={40}>
              <Text color={colors.primaryBlack}>Log in with Facebook</Text>
            </Button>
          </VStack>
        </View>

        <AuthBottom
          firstText="Don't have an account?"
          secondText="Sign up"
          href={screens.SignUp}
        />
      </VStack>
    </SafeAreaView>
  );
};

export default withStyledProvider(Login);
