import { useNetworkStatus } from '@hooks/useNetworkStatus';
import useToast from '@hooks/useToast';
import { onMessage } from 'firebase/messaging';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import AppRouting from './config/routes/AppRouting';
import { messaging, requestFCMToken } from '@utils/firebase';

function App() {
  const toast = useToast();
  useNetworkStatus();
  useEffect(() => {
    requestFCMToken();
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      toast.showNotification(
        `${payload.notification?.title}\n${payload.notification?.body}`
      );
    });
  }, [toast]);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);

        // Gửi config vào Service Worker
        if (registration.active) {
          registration.active.postMessage({
            type: 'SET_FIREBASE_CONFIG',
            config: {
              apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
              authDomain: import.meta.env.VITE_AUTH_DOMAIN,
              projectId: import.meta.env.VITE_PROJECT_ID,
              storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
              messagingSenderId: import.meta.env.VITE_MESSAGE_SENDER,
              appId: import.meta.env.VITE_APP_ID,
            },
          });
        }
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }

  return (
    <AnimatePresence mode="wait">
      <AppRouting />
    </AnimatePresence>
  );
}

export default App;
