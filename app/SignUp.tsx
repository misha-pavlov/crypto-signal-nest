import {
  View,
  Text,
  VStack,
  Button,
  MailIcon,
  LockIcon,
  AtSignIcon,
} from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../config/colors";
import { AuthHeader, CSNInput, AuthBottom } from "../components";
import { screens } from "../config/screens";

// TODO: add mmkvStorage.delete(mmkvStorageKeys.wasStartScreenShown) on login

const SignUp = () => {
  return (
    <SafeAreaView style={{ backgroundColor: colors.primaryBlack, flex: 1 }}>
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
            />

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

          <VStack space="lg" mt={24}>
            <Button
              backgroundColor={colors.primaryGreen}
              borderRadius={10}
              h={40}
            >
              <Text color={colors.primaryBlack}>Sign up</Text>
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

export default SignUp;
