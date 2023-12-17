import { StatusBar } from "expo-status-bar";
import { useCallback, useMemo } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { GluestackUIProvider, View } from "@gluestack-ui/themed";
import { Redirect } from "expo-router";
import { config } from "../config/gluestack-ui.config";
import { mmkvStorageKeys } from "../config/constants";
import { screens } from "../config/screens";
import { colors } from "../config/colors";
import { mmkvStorage } from "../config/mmkvStorage";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function index() {
  const wasStartScreenShown = !!mmkvStorage.getBoolean(
    mmkvStorageKeys.wasStartScreenShown
  );
  const [fontsLoaded] = useFonts({
    "Exo2-Regular": require("../assets/fonts/Exo2-Regular.ttf"),
    "Exo2-Bold": require("../assets/fonts/Exo2-Bold.ttf"),
    "Exo2-ExtraBold": require("../assets/fonts/Exo2-ExtraBold.ttf"),
  });

  const getRedirectHref = useMemo(() => {
    if (!wasStartScreenShown) {
      return screens.StartScreen;
    }

    return screens.LogIn;
  }, [wasStartScreenShown]);

  const showRedirect = useMemo(
    () => fontsLoaded && wasStartScreenShown !== undefined,
    [fontsLoaded, wasStartScreenShown]
  );

  const onLayoutRootView = useCallback(async () => {
    if (showRedirect) {
      await SplashScreen.hideAsync();
    }
  }, [showRedirect]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GluestackUIProvider config={config} globalStyles={config}>
      <View onLayout={onLayoutRootView} backgroundColor={colors.primaryBlack} flex={1}>
        {showRedirect && <Redirect href={getRedirectHref} />}
        <StatusBar style="auto" />
      </View>
    </GluestackUIProvider>
  );
}
