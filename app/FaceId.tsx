import { View, Text, VStack, Center } from "@gluestack-ui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import { useCallback } from "react";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { AuthHeader } from "../components";
import { colors } from "../config/colors";
import { screens } from "../config/screens";
import { mmkvStorage } from "../config/mmkvStorage";
import { authSafeArea, mmkvStorageKeys } from "../config/constants";

const FaceId = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    userId: string;
  }>();

  const handleBiometricAuth = useCallback(async () => {
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with Biometrics",
      disableDeviceFallback: true,
    });
    const userId = params?.userId;

    if (biometricAuth.success && userId) {
      mmkvStorage.set(mmkvStorageKeys.savedUserId, userId);
      router.replace({ pathname: screens.Main })
    } else {
      showMessage({
        message: "Biometric error",
        type: "danger",
      });
    }
  }, []);

  return (
    <SafeAreaView style={authSafeArea}>
      <VStack flex={1} justifyContent="space-between" px={16}>
        <VStack>
          <AuthHeader
            title="Connect face id"
            subTitle="Fast and Secure login."
          />
          <Center
            alignSelf="center"
            mt={80}
            borderRadius={10}
            backgroundColor={colors.grey}
            w={100}
            h={100}
          >
            <TouchableOpacity onPress={handleBiometricAuth}>
              <MaterialCommunityIcons
                name="face-recognition"
                color={colors.primaryGreen}
                size={74}
              />
            </TouchableOpacity>
          </Center>
        </VStack>

        <View alignItems="flex-end">
          <Text
            fontFamily="$bold"
            fontSize={16}
            lineHeight={24}
            color={colors.white}
            onPress={() => router.replace({ pathname: screens.Main })}
          >
            Skip
          </Text>
        </View>
      </VStack>

      <FlashMessage position="top" />
    </SafeAreaView>
  );
};

export default FaceId;
