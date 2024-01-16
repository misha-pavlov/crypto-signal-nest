import { VStack, Button, Text } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { OtpInput } from "react-native-otp-entry";
import { useCallback, useEffect, useState } from "react";
import { showMessage } from "react-native-flash-message";
import { authSafeArea } from "../config/constants";
import { AuthHeader, AuthBackButton, AuthBottom } from "../components";
import { screens } from "../config/screens";
import { colors } from "../config/colors";

const getFourDigitRandomNumber = () => Math.floor(1000 + Math.random() * 9000);

const CheckEmail = () => {
  const [otp, setOtp] = useState("");
  const [fourDigitRandomNumber, setFourDigitRandomNumber] = useState(
    getFourDigitRandomNumber()
  );
  const router = useRouter();
  const params = useLocalSearchParams<{
    email: string;
    isFromSignUp: string;
  }>();
  const isFromSignUp = Boolean(params?.isFromSignUp);

  const sendEmail = useCallback(
    ({ signal, code }: { signal?: AbortSignal; code: number }) =>
      fetch("https://api.mailjet.com/v3.1/send", {
        method: "POST",
        body: JSON.stringify({
          Messages: [
            {
              // TODO: on production create a corporative email
              From: { Email: "mishapavlov1704@gmail.com", Name: "MiLov" },
              To: [{ Email: params?.email, Name: params?.email }],
              Subject: "CryptoSignalNest SignUp",
              TextPart: `Verefication code: ${code.toString()}`,
            },
          ],
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.EXPO_PUBLIC_MAILJET_API_KEY}:${process.env.EXPO_PUBLIC_MAILJET_SECRET_KEY}`
          ).toString("base64")}`,
        },
        signal,
      }),
    [fourDigitRandomNumber]
  );

  const onVerify = useCallback(() => {
    if (Number(otp) === fourDigitRandomNumber) {
      showMessage({
        message: "You did it",
        type: "success",
        titleStyle: { fontFamily: "Exo2-Bold" },
      });

      router.replace({
        pathname: isFromSignUp ? screens.LogIn : screens.NewPassword,
      });
    } else {
      showMessage({
        message: "Entered code do not equal which we sent",
        type: "danger",
        titleStyle: { fontFamily: "Exo2-Bold" },
      });
    }
  }, [otp, fourDigitRandomNumber]);

  const onResendEmail = useCallback(async () => {
    const newFourDigitRandomNumber = getFourDigitRandomNumber();
    setFourDigitRandomNumber(newFourDigitRandomNumber);
    await sendEmail({ code: newFourDigitRandomNumber });
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      try {
        await sendEmail({
          signal: abortController.signal,
          code: fourDigitRandomNumber,
        });
      } catch (error) {
        console.error(error);
      }
    })();
    return () => abortController.abort();
  }, []);

  return (
    <SafeAreaView style={authSafeArea}>
      <VStack px={16} space="4xl">
        <AuthHeader
          title="Check your email"
          subTitle={`We sent a verification code to ${params?.email}.`}
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
          onPress={onVerify}
        >
          <Text color={colors.primaryBlack}>Verify email</Text>
        </Button>

        <AuthBottom
          firstText="Didn't receive the email?"
          secondText="Click to resend"
          href=""
          onPress={onResendEmail}
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
