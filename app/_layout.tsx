import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="StartScreen"
        options={{
          // Hide the header for all other routes.
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddNewCrypto"
        options={{
          // Set the presentation mode to modal for our modal route.
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
