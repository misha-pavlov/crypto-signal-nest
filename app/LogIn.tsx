import {
  View,
  Text,
  Button,
  VStack,
  MailIcon,
  LockIcon,
  ButtonSpinner,
} from "@gluestack-ui/themed";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { mmkvStorage } from "../config/mmkvStorage";
import { authSafeArea, mmkvStorageKeys } from "../config/constants";
import { withStyledProvider } from "../hocs/withStyledProvider";
import { screens } from "../config/screens";
import { colors } from "../config/colors";
import { AuthHeader, CSNInput, AuthBottom } from "../components";
import { useAppDispatch } from "../store/store";
import { faceIdSignIn, signIn } from "../utils/actions/authActions";

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

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
          await dispatch(faceIdSignIn(savedUserId));
          router.replace({ pathname: screens.Main });
        }
      } else {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        setIsBiometricSupported(compatible);
      }
    })();
    return () => abortController.abort();
  });

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(undefined);
      const userId = await dispatch(signIn({ email, password }));

      if (isBiometricSupported) {
        router.replace({
          pathname: screens.FaceId,
          params: {
            userId,
          },
        });
      }
    } catch (error) {
      setError((error as { message: string }).message);
    } finally {
      setIsLoading(false);
    }
  }, [email, password]);

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
              onChangeValue={(value) => setEmail(value)}
            />

            <CSNInput
              label="Password"
              placeholder="Enter valid password"
              isRequired
              isPassword
              leftIcon={LockIcon}
              onChangeValue={(value) => setPassword(value)}
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
              isDisabled={
                !email.length ||
                !password.length ||
                !/\S+@\S+\.\S+/.test(email) ||
                password.length < 6 ||
                isLoading
              }
              onPress={authHandler}
            >
              {isLoading ? (
                <ButtonSpinner mr="$1" />
              ) : (
                <Text color={colors.primaryBlack}>Log in</Text>
              )}
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
