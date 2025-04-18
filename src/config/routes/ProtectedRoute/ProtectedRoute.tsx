import useToast from '@hooks/useToast';
import { t } from 'i18next';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
  userRole: string;
}

const ProtectedRoute = ({
  children,
  allowedRoles,
  userRole,
}: ProtectedRouteProps) => {
  const toast = useToast();
  if (!allowedRoles || allowedRoles.includes(userRole)) {
    return children;
  }
  if (!allowedRoles || !allowedRoles.includes(userRole)) {
    toast.showWarning(t('You do not have permission'));
  }
  return <Navigate to="/dairy/profile" replace />;
};

export default ProtectedRoute;
