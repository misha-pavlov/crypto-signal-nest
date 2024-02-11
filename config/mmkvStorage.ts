import { MMKV } from "react-native-mmkv";

export const mmkvStorage = new MMKV({
  id: "crypto-signal-nest-app-storage",
  encryptionKey: process.env.EXPO_PUBLIC_ENCRIPTION_KEY,
});
