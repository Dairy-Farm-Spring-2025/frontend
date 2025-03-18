import { Result, ResultProps } from 'antd';

interface ErrorComponentProps extends ResultProps {
  title?: string;
  subTitle?: string;
  status?: '404' | '403' | '500';
}

const ErrorComponent = ({
  title,
  subTitle,
  status,
  ...props
}: ErrorComponentProps) => {
  return (
    <Result status={status} title={title} subTitle={subTitle} {...props} />
  );
};

export default ErrorComponent;
