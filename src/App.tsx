import { useNetworkStatus } from '@hooks/useNetworkStatus';
import useToast from '@hooks/useToast';
import { onMessage } from 'firebase/messaging';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import AppRouting from './config/routes/AppRouting';
import { messaging, requestFCMToken } from '@utils/firebase';
// import { Modal } from 'antd';
// import { useTranslation } from 'react-i18next';

function App() {
  const toast = useToast();
  useNetworkStatus();
  // const { t } = useTranslation();

  // useEffect(() => {
  //   const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  //   const isAndroid = /android/i.test(userAgent);
  //   const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;

  //   if (isAndroid || isIOS) {
  //     // Gợi ý mở app
  //     Modal.confirm({
  //       title: t('Open dairy farm mobile app'),
  //       content: t(
  //         'You are using web of this app as mobile, do you want to redirect to mobile app?'
  //       ),
  //       centered: true,
  //       okText: t('Yes'),
  //       cancelText: t('No'),
  //       onOk: () => {
  //         toast.showSuccess('Mobile tới đây');
  //         window.location.href = `exp://b_cbp6g-yusers-8081.exp.direct`;
  //       },
  //       onCancel: () => {
  //         toast.showSuccess('Bạn đã chọn ở lại trình duyệt.');
  //       },
  //     });
  //   }
  // }, [t]);

  useEffect(() => {
    requestFCMToken();
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      toast.showNotification(`${payload.notification?.title}\n${payload.notification?.body}`);
    });
  }, [toast]);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);

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
    <AnimatePresence mode='wait'>
      <AppRouting />
    </AnimatePresence>
  );
}

export default App;
