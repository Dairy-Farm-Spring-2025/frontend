import { useCallback, useState } from 'react';

export interface ModalActionProps {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
  setOpen: (open: boolean) => void; // Added setter for open state
}

const useModal = <T extends ModalActionProps>() => {
  const [open, setOpenState] = useState(false);

  const openModal = useCallback((beforeOpenFunction?: any) => {
    if (beforeOpenFunction && typeof beforeOpenFunction === 'function')
      beforeOpenFunction();
    setOpenState(true);
  }, []);

  const closeModal = useCallback((beforeCloseFunction?: any) => {
    if (beforeCloseFunction && typeof beforeCloseFunction === 'function')
      beforeCloseFunction();
    setOpenState(false);
  }, []);

  const toggleModal = useCallback(() => setOpenState((prev) => !prev), []);

  return {
    open,
    openModal,
    closeModal,
    toggleModal,
    setOpen: setOpenState, // Expose the setter function
  } as T;
};

export default useModal;
