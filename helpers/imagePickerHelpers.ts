import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { getFirebaseApp } from "./firebaseHelpers";

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
