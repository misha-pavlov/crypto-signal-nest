import {
  View,
  Text,
  Button,
  VStack,
  MailIcon,
  LockIcon,
} from "@gluestack-ui/themed";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { mmkvStorage } from "../config/mmkvStorage";
import { mmkvStorageKeys } from "../config/constants";
import { withStyledProvider } from "../hocs/withStyledProvider";
import { screens } from "../config/screens";
import { colors } from "../config/colors";
import { AuthHeader, CSNInput } from "../components";

// TODO: add mmkvStorage.delete(mmkvStorageKeys.wasStartScreenShown) on login

const Login = () => {
  return (
    <SafeAreaView style={{ backgroundColor: colors.primaryBlack, flex: 1 }}>
      <View px={16}>
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
            backgroundColor={colors.primaryGreen}
            borderRadius={10}
            h={40}
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
    </SafeAreaView>
  );
};

export default withStyledProvider(Login);
