import {
  GetProps,
  Input,
  InputNumber,
  InputNumberProps,
  InputProps,
} from 'antd';
import { TextAreaProps } from 'antd/es/input';
import './index.scss';
import { t } from 'i18next';
type SearchProps = GetProps<typeof Input.Search>;
interface InputComponentProps extends InputProps {
  className?: string;
}
interface TextAreaComponentProp extends TextAreaProps {
  className?: string;
}

interface NumberProps extends InputNumberProps {
  className?: string;
  decimal?: boolean;
}

interface SearchComponentProps extends SearchProps {
  className?: string;
}

interface PasswordProps extends InputProps {
  className?: string;
}

interface LinkProp extends InputProps {
  className?: string;
}

const InputComponent = ({ className, ...props }: InputComponentProps) => {
  return (
    <Input
      className={`input-component ${className}`}
      placeholder={`${t('Enter')}...`}
      {...props}
    />
  );
};

const TextArea = ({ className, ...props }: TextAreaComponentProp) => (
  <Input.TextArea
    placeholder={`${t('Enter')}...`}
    className={`input-component text-area-component ${className || ''}`}
    {...props}
  />
);

const Number = ({ className, decimal = false, ...props }: NumberProps) => {
  return !decimal ? (
    <InputNumber
      className={`input-component text-area-component !w-full ${
        className || ''
      }`}
      min={0}
      placeholder={`${t('Enter')}...`}
      {...props}
    />
  ) : (
    <InputNumber
      className={`input-component text-area-component !w-full ${
        className || ''
      }`}
      min={0}
      placeholder={`${t('Enter')}...`}
      step={0.1} // Allows increments of 0.1
      precision={2} // Restricts to 2 decimal places
      {...props}
    />
  );
};

const Password = ({ className, ...props }: PasswordProps) => {
  return (
    <Input.Password
      placeholder={`${t('Enter password')}...`}
      className={`input-component ${className}`}
      {...props}
    />
  );
};

const Search = ({ className, ...props }: SearchComponentProps) => {
  return (
    <Input.Search
      placeholder={`${t('Search')}...`}
      className={`input-component ${className}`}
      enterButton
      {...props}
    />
  );
};

const Link = ({ className, ...props }: LinkProp) => {
  return (
    <Input
      addonBefore="http://"
      className={`input-component ${className}`}
      {...props}
    />
  );
};

InputComponent.TextArea = TextArea;
InputComponent.Number = Number;
InputComponent.Search = Search;
InputComponent.Password = Password;
InputComponent.Link = Link;

export default InputComponent;
