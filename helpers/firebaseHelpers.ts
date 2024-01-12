// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

export const getFirebaseApp = () => {
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBHiQSiwXOxKnnETuIqDKGNFdNmmCB1MW0",
    authDomain: "cryptosignalnest.firebaseapp.com",
    databaseURL: "https://cryptosignalnest-default-rtdb.firebaseio.com",
    projectId: "cryptosignalnest",
    storageBucket: "cryptosignalnest.appspot.com",
    messagingSenderId: "933780612305",
    appId: "1:933780612305:web:ceb33837e7cbda14e151f0",
    measurementId: "G-G9DV3WNG6M",
  };
  
  return initializeApp(firebaseConfig);
};
