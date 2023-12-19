import { VStack, MailIcon, Button, Text } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { authSafeArea } from "../config/constants";
import { AuthHeader, CSNInput, AuthBackButton } from "../components";
import { screens } from "../config/screens";
import { colors } from "../config/colors";

// TODO: add isDisable when email lenth <= 0

const EmailForNewPassword = () => {
  const router = useRouter();

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

        <Button
          borderRadius={10}
          h={40}
          onPress={() =>
            router.replace({
              pathname: screens.CheckEmail,
              params: {
                email: "mishapavlov1704@gmail.com",
              },
            })
          }
        >
          <Text color={colors.primaryBlack}>Submit</Text>
        </Button>

        <AuthBackButton href={screens.LogIn} backText="Back to log in" />
      </VStack>
    </SafeAreaView>
  );
};

export default EmailForNewPassword;
