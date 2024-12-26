import { useCallback, useState } from "react";

const useModal = () => {
  const [open, setOpen] = useState(false);

  const openModal = useCallback((beforeOpenFunction?: any) => {
    if (beforeOpenFunction && typeof beforeOpenFunction === "function")
      beforeOpenFunction();
    setOpen(true);
  }, []);

  const closeModal = useCallback((beforeCloseFunction?: any) => {
    if (beforeCloseFunction && typeof beforeCloseFunction === "function")
      beforeCloseFunction();
    setOpen(false);
  }, []);

  const toggleModal = useCallback(() => setOpen((prev) => !prev), []);

  return {
    open,
    openModal,
    closeModal,
    toggleModal,
  };
};

export default useModal;
