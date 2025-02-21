import {
  GetProps,
  Input,
  InputNumber,
  InputNumberProps,
  InputProps,
} from 'antd';
import { TextAreaProps } from 'antd/es/input';
import './index.scss';
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

const InputComponent = ({ className, ...props }: InputComponentProps) => {
  return <Input className={`input-component ${className}`} {...props} />;
};

const TextArea = ({ className, ...props }: TextAreaComponentProp) => (
  <Input.TextArea
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
      placeholder="Enter..."
      {...props}
    />
  ) : (
    <InputNumber
      className={`input-component text-area-component !w-full ${
        className || ''
      }`}
      min={0}
      placeholder="Enter..."
      step={0.1} // Allows increments of 0.1
      precision={2} // Restricts to 2 decimal places
      {...props}
    />
  );
};

const Password = ({ className, ...props }: PasswordProps) => {
  return (
    <Input.Password
      placeholder="Enter Password..."
      className={`input-component ${className}`}
      {...props}
    />
  );
};

const Search = ({ className, ...props }: SearchComponentProps) => {
  return (
    <Input.Search
      placeholder="Search..."
      className={`input-component ${className}`}
      {...props}
    />
  );
};

InputComponent.TextArea = TextArea;
InputComponent.Number = Number;
InputComponent.Search = Search;
InputComponent.Password = Password;

export default InputComponent;
