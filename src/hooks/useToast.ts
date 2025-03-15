import { toast } from 'react-hot-toast';

const useToast = () => {
  const showSuccess = (message: string) => {
    toast.success(message, {
      duration: 4000, // Display time in ms
      className:
        'text-sm !bg-green-200 !border !border-1 !border-green-600 !px-5',
    });
  };

  // Error toast handler
  const showError = (message: string) => {
    toast.error(message, {
      duration: 4000,
      className: 'text-sm !bg-red-200 !border !border-1 !border-red-600 !px-5',
    });
  };

  const showWarning = (message: string) => {
    toast(message, {
      icon: '⚠️',
      style: {
        backgroundColor: '#FFD580',
      },
    });
  };

  return { showSuccess, showError, showWarning };
};

export default useToast;
