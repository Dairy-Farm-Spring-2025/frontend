// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const API_DOMAIN = import.meta.env.VITE_AUTH_DOMAIN;
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;
const STORAGE_BUCKET = import.meta.env.VITE_STORAGE_BUCKET;
const MESSAGE_SENDER = import.meta.env.VITE_MESSAGE_SENDER;
const APP_ID = import.meta.env.VITE_APP_ID;
const MEASURE_ID = import.meta.env.VITE_MEASURE_ID;
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: API_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGE_SENDER,
  appId: APP_ID,
  measurementId: MEASURE_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const requestFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_VAPID_KEY, // Lấy từ Firebase Console
      });
      return token;
    } else {
      console.warn('User denied notifications.');
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

export { messaging, getToken, onMessage, requestFCMToken };
