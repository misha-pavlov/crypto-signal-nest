import {
  View,
  Text,
  VStack,
  Button,
  MailIcon,
  LockIcon,
  AtSignIcon,
  ButtonSpinner,
} from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { colors } from "../config/colors";
import { AuthHeader, CSNInput, AuthBottom } from "../components";
import { screens } from "../config/screens";
import { authSafeArea } from "../config/constants";
import { useAppDispatch } from "../store/store";
import { signUp } from "../utils/actions/authActions";
import { withStyledProvider } from "../hocs/withStyledProvider";
import { googleAuth as googleSignUp } from "../utils/google";

const SignUp = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = await dispatch(signUp({ name, email, password }));
      router.replace({
        pathname: screens.CheckEmail,
        params: { email, isFromSignUp: true, userId },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [name, email, password]);

  return (
    <SafeAreaView style={authSafeArea}>
      <VStack justifyContent="space-between" flex={1} px={16}>
        <View>
          <AuthHeader
            title="Create an account"
            subTitle="Welcome! Please enter your details."
          />

          <VStack mt={24} space="2xl" mb={8}>
            <CSNInput
              label="Name"
              placeholder="Create a name"
              isRequired
              leftIcon={AtSignIcon}
              onChangeValue={(value) => setName(value)}
            />

            <CSNInput
              label="Email"
              placeholder="Enter unique email"
              isRequired
              leftIcon={MailIcon}
              onChangeValue={(value) => setEmail(value)}
            />

            <CSNInput
              label="Password (min length 6)"
              placeholder="Enter valid password"
              isRequired
              isPassword
              leftIcon={LockIcon}
              onChangeValue={(value) => setPassword(value)}
            />
          </VStack>

          <VStack space="lg" mt={24}>
            <Button
              borderRadius={10}
              h={40}
              isDisabled={
                !name.length ||
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
                <Text color={colors.primaryBlack}>Sign up</Text>
              )}
            </Button>
          </VStack>
        </View>

        <AuthBottom
          firstText="Already have an account?"
          secondText="Sign in"
          href={screens.LogIn}
        />
      </VStack>
    </SafeAreaView>
  );
};

export default withStyledProvider(SignUp);
