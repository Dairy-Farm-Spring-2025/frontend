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
  const userName = searchParams.get('userName');
  const roleName = searchParams.get('roleName');
  useEffect(() => {
    const fetchData = async () => {
      console.log(accessToken, refreshToken, userId, userName, roleName);
      if (accessToken && refreshToken && userId && userName && roleName) {
        const data = {
          accessToken: accessToken,
          fullName: userName,
          refreshToken: refreshToken,
          roleName: roleName,
          userId: userId,
        };
        dispatch(login(data));
        toast.showSuccess(t('Login success'));
        navigate('/dairy');
      } else {
        toast.showError(t('Login failed'));
        navigate('/login');
      }
    };
    fetchData();
  }, [dispatch]);

  return (
    <div className="w-full flex justify-center">
      <Spin />
    </div>
  );
};

export default AuthCallback;
