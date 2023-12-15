import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { GluestackUIProvider, Text, View } from "@gluestack-ui/themed";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Exo2-Regular": require("./assets/fonts/Exo2-Regular.ttf"),
    "Exo2-Bold": require("./assets/fonts/Exo2-Bold.ttf"),
    "Exo2-ExtraBold": require("./assets/fonts/Exo2-ExtraBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GluestackUIProvider>
      <View onLayout={onLayoutRootView}>
        <Text fontFamily="Exo2-Regular" style={{ fontSize: 30 }}>
          SplashScreen Demo! 👋
        </Text>
        <StatusBar style="auto" />
      </View>
    </GluestackUIProvider>
  );
}
