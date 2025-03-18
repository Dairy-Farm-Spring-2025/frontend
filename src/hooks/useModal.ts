import { useCallback, useState } from 'react';

export interface ModalActionProps {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

const useModal = <T extends ModalActionProps>() => {
  const [open, setOpen] = useState(false);

  const openModal = useCallback((beforeOpenFunction?: any) => {
    if (beforeOpenFunction && typeof beforeOpenFunction === 'function')
      beforeOpenFunction();
    setOpen(true);
  }, []);

  const closeModal = useCallback((beforeCloseFunction?: any) => {
    if (beforeCloseFunction && typeof beforeCloseFunction === 'function')
      beforeCloseFunction();
    setOpen(false);
  }, []);

  const toggleModal = useCallback(() => setOpen((prev) => !prev), []);

  return {
    open,
    openModal,
    closeModal,
    toggleModal,
  } as T;
};

export default useModal;
