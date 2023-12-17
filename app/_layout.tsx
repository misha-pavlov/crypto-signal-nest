import { Stack } from "expo-router";
import { screens } from "../config/screens";

export default function Layout() {
  const getScreenName = (screenName: string) => screenName.slice(1);

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
        options={{ headerShown: true }}
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
