import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { GluestackUIProvider, Text, View } from "@gluestack-ui/themed";
import { config } from "./config/gluestack-ui.config";

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
    <GluestackUIProvider config={config}>
      <View onLayout={onLayoutRootView}>
        <Text
          fontSize={30}
          marginTop={100}
        >
          SplashScreen Demo! 👋
        </Text>

        <Text
          fontFamily="$bold"
          fontSize={30}
          marginTop={100}
        >
          SplashScreen Demo! 👋
        </Text>

        <Text
          fontFamily="$extraBold"
          fontSize={30}
          marginTop={100}
        >
          SplashScreen Demo! 👋
        </Text>
        <StatusBar style="auto" />
      </View>
    </GluestackUIProvider>
  );
}
