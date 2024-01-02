import { Stack } from "expo-router";
import { vexo } from "vexo-analytics";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { useEffect } from "react";
import { screens } from "../config/screens";

const vexpoApiKey = process.env.EXPO_PUBLIC_VEXO_API_KEY;

if (vexpoApiKey) {
  vexo(vexpoApiKey);
}

export default function Layout() {
  const getScreenName = (screenName: string) => screenName.slice(1);

  useEffect(() => {
    const abortController = new AbortController();

    const tfChecker = async () => {
      await tf.ready();
      console.log("TF is ready");
    };

    tfChecker();

    () => abortController.abort();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name={getScreenName(screens.index)} />
      <Stack.Screen name={getScreenName(screens.StartScreen)} />
      <Stack.Screen name={getScreenName(screens.LogIn)} />
      <Stack.Screen name={getScreenName(screens.SignUp)} />
      <Stack.Screen name={getScreenName(screens.CheckEmail)} />
      <Stack.Screen name={getScreenName(screens.EmailForNewPassword)} />
      <Stack.Screen name={getScreenName(screens.NewPassword)} />
      <Stack.Screen
        name={getScreenName(screens.Main)}
        options={{ headerShown: true, headerShadowVisible: false }}
      />
      <Stack.Screen
        name={getScreenName(screens.Crypto)}
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name={getScreenName(screens.AddNewCrypto)}
        options={{
          presentation: "modal",
        }}
      />
      <Stack.Screen name={getScreenName(screens.Profile)} />
    </Stack>
  );
}
