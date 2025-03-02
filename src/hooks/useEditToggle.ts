import { useEffect, useState } from 'react';

interface UseEditToggle {
  edited: boolean;
  toggleEdit: () => void;
}

export const useEditToggle = (): UseEditToggle => {
  const [edited, setEdited] = useState(false);
  useEffect(() => {
    return () => {
      setEdited(false);
    };
  }, []);
  const toggleEdit = () => {
    setEdited((prev) => !prev);
  };

  return { edited, toggleEdit };
};
