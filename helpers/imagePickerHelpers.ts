import { Platform } from "react-native";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { getFirebaseApp } from "./firebaseHelpers";

const checkMediaPermissions = async () => {
  if (Platform.OS !== "web") {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      return Promise.reject("We need permission to access your photos.");
    }
  }

  return Promise.resolve();
};

export const uploadImage = async (
  uri: string,
  fileName: string,
  folder: string
) => {
  const app = getFirebaseApp();
  const blob: Blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };

    xhr.onerror = function (e) {
      console.error(e);
      reject(new TypeError("Network request failed!"));
    };

    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send();
  });

  const storageRef = ref(getStorage(app), `${folder}/${fileName}`);

  await uploadBytesResumable(storageRef, blob);

  // @ts-ignore - because blob actually has close function
  blob.close();

  return getDownloadURL(storageRef);
};

export const launchImagePicker = async () => {
  await checkMediaPermissions();

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0];
  }
};
