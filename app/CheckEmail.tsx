import { VStack, Button, Text } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { OtpInput } from "react-native-otp-entry";
import { useState } from "react";
import { authSafeArea } from "../config/constants";
import { AuthHeader, AuthBackButton, AuthBottom } from "../components";
import { screens } from "../config/screens";
import { colors } from "../config/colors";

const CheckEmail = () => {
  const [otp, setOtp] = useState("");
  const params = useLocalSearchParams<{
    email: string;
    isFromSignUp: string;
  }>();
  const isFromSignUp = Boolean(params?.isFromSignUp);

  return (
    <SafeAreaView style={authSafeArea}>
      <VStack px={16} space="4xl">
        <AuthHeader
          title="Check your email"
          subTitle={`We sent a verification link to ${params?.email}.`}
        />

        <VStack>
          <OtpInput
            numberOfDigits={4}
            focusColor={colors.primaryGreen}
            focusStickBlinkingDuration={800}
            theme={{
              pinCodeContainerStyle: {
                borderWidth: 2,
                backgroundColor: colors.grey,
                width: 50,
                height: 50,
                borderRadius: 5,
              },
              pinCodeTextStyle: {
                color: colors.white,
                fontFamily: "Exo2-Regular",
              },
            }}
            onTextChange={(text) => setOtp(text)}
          />
        </VStack>

        <Button
          borderRadius={10}
          h={40}
          isDisabled={otp.length <= 0}
          onPress={() => console.log("123")}
        >
          <Text color={colors.primaryBlack}>Verify email</Text>
        </Button>

        <AuthBottom
          firstText="Didn't receive the email?"
          secondText="Click to resend"
          href=""
          onPress={() => console.log("RESENT EMAIL")}
        />
        <AuthBackButton
          href={isFromSignUp ? screens.SignUp : screens.EmailForNewPassword}
          backText={
            isFromSignUp ? "Back to sign up" : "Back to email for new password"
          }
        />
      </VStack>
    </SafeAreaView>
  );
};

export default CheckEmail;
