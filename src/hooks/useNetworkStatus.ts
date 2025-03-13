import { t } from 'i18next';
import { useEffect, useState } from 'react';
import useToast from './useToast';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const toast = useToast();
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      toast.showError(t('Mất kết nối Internet. Vui lòng kiểm tra lại!')); // Hiển thị toast trong 3 giây
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
