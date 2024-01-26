import { child, getDatabase, ref, get, update } from "firebase/database";
import { getFirebaseApp } from "../../helpers/firebaseHelpers";
import { UserType, UpdateUserData } from "./../../types/User.type";

export const getUserData = async (userId: string) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `users/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.val() as UserType;
  } catch (error) {
    console.error(error);
  }
};

export const updateUserData = async (
  userId: string,
  userData: UpdateUserData
) => {
  const app = getFirebaseApp();
  const dbRef = ref(getDatabase(app));
  const userRef = child(dbRef, `users/${userId}`);

  await update(userRef, {
    ...userData,
  });
};
