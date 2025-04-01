import { LockOutlined, UserOutlined } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import { login } from '@core/store/slice/userSlice';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import UserRequest from '@model/Authentication/UserRequest';
import UserResponse from '@model/Authentication/UserResponse';
import { USER_PATH } from '@service/api/User/userApi';
import { Divider, Form, Image, Input } from 'antd';
import { t } from 'i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const GOOGLE_AUTH_URL = `https://api.dairyfarmfpt.website/oauth2/authorize/google`;
const LoginForm = () => {
  const navigate = useNavigate();
  const { trigger, isLoading } = useFetcher<UserResponse>(
    USER_PATH.SIGN_IN,
    'POST'
  );
  const dispatch = useDispatch();
  const toast = useToast();
  const [form] = Form.useForm();
  const handleForgetPassword = () => {
    navigate('forget-password');
  };
  const handleFinish = async (values: UserRequest) => {
    const data: UserRequest = {
      email: values.email,
      password: values.password,
    };
    try {
      const response: UserResponse = await trigger({ body: data });
      if (response.message && response.data) {
        const role = response.data.roleName;
        if (
          role !== 'Manager' &&
          role !== 'Admin' &&
          role !== 'Veterinarians'
        ) {
          toast.showError(t('You do not permission to access'));
        } else {
          dispatch(login(response.data));
          navigate('/dairy');
          toast.showSuccess(response.message);
        }
      } else {
        toast.showError(response.message);
      }
    } catch (error: any) {
      toast.showError(error.message);
    }
  };
  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };
  return (
    <div>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-darkGreen">{t('Welcome')}</h2>
      </div>
      <Divider className="my-5" />
      <div className="w-full">
        <FormComponent
          onFinish={handleFinish}
          form={form}
          labelCol={{ span: 24 }}
          className="flex flex-col gap-2"
        >
          <FormItemComponent
            label={<span className="text-base font-semibold">Email</span>}
            name="email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-500" />}
              placeholder="Email..."
              className="py-3 px-5 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </FormItemComponent>

          <FormItemComponent
            label={
              <span className="text-base font-semibold">{t('Password')}</span>
            }
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-500" />}
              placeholder={`${t('Password')}...`}
              className="py-3 px-5 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </FormItemComponent>
          <p
            onClick={handleForgetPassword}
            className="text-blue-500 hover:text-blue-700 cursor-pointer forgot-password-btn"
          >
            {t('Forgot Password?')}
          </p>
          <ButtonComponent
            loading={isLoading}
            htmlType="submit"
            type="primary"
            className="!w-full "
          >
            {t('Login')}
          </ButtonComponent>
          <Divider className="!border-gray-400">{t('or sign in with')}</Divider>
          <ButtonComponent
            type="primary"
            onClick={handleGoogleLogin}
            className="!w-full !h-full flex items-center justify-center gap-2"
            buttonType="geekblue"
          >
            <Image
              width={25}
              height={25}
              preview={false}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
            />
            <p> {t('Login with Google')}</p>
          </ButtonComponent>
        </FormComponent>
      </div>
    </div>
  );
};

export default LoginForm;
