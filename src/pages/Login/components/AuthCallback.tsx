import { login } from '@core/store/slice/userSlice';
import useToast from '@hooks/useToast';
import { Spin } from 'antd';
import { t } from 'i18next';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
        if (roleName !== 'Manager' && roleName !== 'Admin' && roleName !== 'Veterinarians') {
          // TEST
          const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
          const isAndroid = /android/i.test(userAgent);
          const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
          if (isAndroid || isIOS) {
            navigate(
              `exp://b_cbp6g-yusers-8081.exp.direct?access_token=${accessToken}&refresh_token=${refreshToken}&userId=${userId}&userName=${userName}&roleName=${roleName}`
            );
            console.log('navigate');
          } else {
            toast.showError(t('You do not permission to access'));
            navigate('/login');
          }
          // Test End
        } else {
          dispatch(login(data));
          toast.showSuccess(t('Login success'));
          navigate('/dairy');
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
