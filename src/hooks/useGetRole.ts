import { RootState } from '@core/store/store';
import { useSelector } from 'react-redux';
export type UserRole = 'Admin' | 'Manager' | 'Veterinarians';

const useGetRole = (): UserRole | undefined => {
  const role = useSelector(
    (state: RootState) => state.user?.roleName as UserRole
  );
  return role;
};

export default useGetRole;
