import { VStack, MailIcon, Button, Text } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { authSafeArea } from "../config/constants";
import { AuthHeader, CSNInput, AuthBackButton } from "../components";
import { screens } from "../config/screens";
import { colors } from "../config/colors";

const EmailForNewPassword = () => {
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
        />

        <Button backgroundColor={colors.primaryGreen} borderRadius={10} h={40}>
          <Text color={colors.primaryBlack}>Submit</Text>
        </Button>

        <AuthBackButton href={screens.LogIn} backText="Back to log in" />
      </VStack>
    </SafeAreaView>
  );
};

export default EmailForNewPassword;
