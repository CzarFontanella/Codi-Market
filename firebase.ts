// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// No need to import dotenv in Expo/React Native

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Warn if any config value is missing
if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId ||
  !firebaseConfig.storageBucket ||
  !firebaseConfig.messagingSenderId ||
  !firebaseConfig.appId
) {
  console.warn(
    "[Firebase] One or more Firebase config values are missing or undefined:",
    firebaseConfig
  );
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

if (__DEV__) {
  console.log("Firebase Config:", firebaseConfig);
}
