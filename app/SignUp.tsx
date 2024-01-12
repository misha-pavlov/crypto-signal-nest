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
import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { colors } from "../config/colors";
import { AuthHeader, CSNInput, AuthBottom } from "../components";
import { screens } from "../config/screens";
import { authSafeArea, mmkvStorageKeys } from "../config/constants";
import { useAppDispatch } from "../store/store";
import { mmkvStorage } from "../config/mmkvStorage";
import { signUp } from "../utils/actions/authActions";
import { withStyledProvider } from "../hocs/withStyledProvider";

const SignUp = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(undefined);
      await dispatch(signUp({ name, email, password }));
      mmkvStorage.delete(mmkvStorageKeys.wasStartScreenShown);
    } catch (error) {
      setError((error as { message: string }).message);
    } finally {
      setIsLoading(false);
    }
  }, [name, email, password]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

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

            <Button borderRadius={10} h={40}>
              <Text color={colors.primaryBlack}>Sign up with Google</Text>
            </Button>

            <Button borderRadius={10} h={40}>
              <Text color={colors.primaryBlack}>Sign up with Facebook</Text>
            </Button>
          </VStack>
        </View>

        <AuthBottom
          firstText="Already have an account?"
          secondText="Log in"
          href={screens.LogIn}
        />
      </VStack>
    </SafeAreaView>
  );
};

export default withStyledProvider(SignUp);
