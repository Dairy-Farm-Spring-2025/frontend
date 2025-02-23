import { Result } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ButtonComponent from '../../components/Button/ButtonComponent';

const ErrorPageNotification = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Result
      status="404"
      title="404"
      subTitle={t('Sorry, the page you visited does not exist.')}
      extra={
        <ButtonComponent onClick={() => navigate('/dairy')} type="primary">
          {t('Back')}
        </ButtonComponent>
      }
    />
  );
};

export default ErrorPageNotification;
