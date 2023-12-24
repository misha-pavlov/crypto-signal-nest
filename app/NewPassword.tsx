import { VStack, LockIcon, Button, Text } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { authSafeArea } from "../config/constants";
import { AuthHeader, CSNInput, AuthBackButton } from "../components";
import { screens } from "../config/screens";
import { colors } from "../config/colors";

// TODO: add isDisable when newPassword lenth <= 0

const NewPassword = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={authSafeArea}>
      <VStack px={16} space="4xl">
        <AuthHeader
          title="Forgot password"
          subTitle="Please enter your new password."
        />

        <CSNInput
          label="Password"
          placeholder="Your new password here"
          isRequired
          isPassword
          leftIcon={LockIcon}
        />

        <Button
          borderRadius={10}
          h={40}
          onPress={() =>
            router.replace({
              pathname: screens.LogIn,
            })
          }
        >
          <Text color={colors.primaryBlack}>Submit</Text>
        </Button>

        <AuthBackButton
          href={screens.CheckEmail}
          backText="Back to check email"
        />
      </VStack>
    </SafeAreaView>
  );
};

export default NewPassword;
