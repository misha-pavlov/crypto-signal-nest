import { Stack, useNavigation } from "expo-router";
import { vexo } from "vexo-analytics";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { useEffect } from "react";
import { Platform, TouchableOpacity } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import FlashMessage, {
  hideMessage,
  showMessage,
} from "react-native-flash-message";
import { Provider } from "react-redux";
import { screens } from "../config/screens";
import { colors } from "../config/colors";
import { store } from "../store/store";

const vexpoApiKey = process.env.EXPO_PUBLIC_VEXO_API_KEY;

if (vexpoApiKey) {
  vexo(vexpoApiKey);
}

export default function Layout() {
  const navigation = useNavigation();
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

  NetInfo.addEventListener((state) => {
    if (!state.isConnected) {
      showMessage({
        message: "No internet connection",
        backgroundColor: colors.red,
        color: colors.white,
        hideOnPress: false,
        autoHide: false,
        icon: () => <AntDesign name="warning" size={20} color={colors.white} />,
        style: {
          alignItems: "center",
          gap: 14,
          paddingTop: Platform.OS === "android" ? 50 : 0,
        },
        titleStyle: { fontFamily: "Exo2-Bold" },
      });
    } else {
      hideMessage();
    }
  });

  return (
    <Provider store={store}>
      <FlashMessage position="top" />
      <Stack screenOptions={{ headerShown: false, headerShadowVisible: false }}>
        <Stack.Screen name={getScreenName(screens.index)} />
        <Stack.Screen name={getScreenName(screens.StartScreen)} />
        <Stack.Screen name={getScreenName(screens.LogIn)} />
        <Stack.Screen name={getScreenName(screens.SignUp)} />
        <Stack.Screen name={getScreenName(screens.CheckEmail)} />
        <Stack.Screen name={getScreenName(screens.EmailForNewPassword)} />
        <Stack.Screen name={getScreenName(screens.NewPassword)} />
        <Stack.Screen
          name={getScreenName(screens.Main)}
          options={{
            headerShown: true,
            headerTitle: "",
            headerStyle: {
              backgroundColor: colors.primaryBlack,
            },
          }}
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
        <Stack.Screen
          name={getScreenName(screens.Profile)}
          options={{
            headerShown: true,
            headerTitle: "",
            headerStyle: {
              backgroundColor: colors.primaryBlack,
            },
            headerLeft: () => (
              <TouchableOpacity onPress={navigation.goBack}>
                <Ionicons name="chevron-back" size={24} color={colors.white} />
              </TouchableOpacity>
            ),
          }}
        />
      </Stack>
    </Provider>
  );
}
