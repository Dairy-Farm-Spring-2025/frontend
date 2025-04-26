import { login } from '@core/store/slice/userSlice';
import useToast from '@hooks/useToast';
import { Spin } from 'antd';
import { t } from 'i18next';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Environment variable for redirect URL (configure in .env or similar)
const MOBILE_REDIRECT_URL =
  process.env.REACT_APP_MOBILE_REDIRECT_URL || 'exp://b_cbp6g-yusers-8081.exp.direct';

// Function to detect mobile devices
const isMobileDevice = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  return (
    /android/i.test(userAgent) || (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream)
  );
};

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const userId = searchParams.get('userId');
  const roleName = decodeURIComponent(searchParams.get('roleName') || '');
  const userName = decodeURIComponent(searchParams.get('userName') || '');
  const error = searchParams.get('error');
  useEffect(() => {
    const fetchData = async () => {
      if (accessToken && refreshToken && userId && userName && roleName) {
        const data = {
          accessToken: accessToken,
          fullName: userName,
          refreshToken: refreshToken,
          roleName: roleName,
          userId: userId,
        };
        if (['Veterinarians', 'Worker'].includes(roleName) && isMobileDevice()) {
          const redirectUrl = `${MOBILE_REDIRECT_URL}?access_token=${encodeURIComponent(
            accessToken
          )}&refresh_token=${encodeURIComponent(refreshToken)}&userId=${encodeURIComponent(
            userId
          )}&userName=${encodeURIComponent(userName)}&roleName=${encodeURIComponent(roleName)}`;
          window.location.href = redirectUrl;
        } else if (['Manager', 'Admin', 'Veterinarians'].includes(roleName)) {
          dispatch(login(data));
          toast.showSuccess(t('Login success'));
          navigate('/dairy');
        } else {
          toast.showError(t('You do not have permission to access'));
          navigate('/login');
        }
      } else {
        toast.showError(t('Login failed'));
      }
    };
    if (error === 'user_not_found') {
      toast.showError(t('Your account is not exist in dairy farm'));
      navigate('/login');
    } else if (error === 'user_disabled') {
      toast.showError(t('Your account is disabled in dairy farm'));
      navigate('/login');
    } else {
      fetchData();
    }
  }, [dispatch]);

  return (
    <div className='w-full flex justify-center'>
      <Spin />
    </div>
  );
};

export default AuthCallback;
