import { child, getDatabase, ref, get } from "firebase/database";
import { getFirebaseApp } from "../../helpers/firebaseHelpers";

export const getUserData = async (userId: string) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `users/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.val();
  } catch (error) {
    console.error(error);
  }
};
