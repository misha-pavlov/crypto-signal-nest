import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="StartScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddNewCrypto"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
