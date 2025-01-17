import { Input, InputNumber, InputNumberProps, InputProps } from 'antd';
import './index.scss';
import { TextAreaProps } from 'antd/es/input';
interface InputComponentProps extends InputProps {
  className?: string;
}
interface TextAreaComponentProp extends TextAreaProps {
  className?: string;
}

interface NumberProps extends InputNumberProps {
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

const Number = ({ className, ...props }: NumberProps) => {
  return (
    <InputNumber
      className={`input-component text-area-component !w-full ${
        className || ''
      }`}
      {...props}
    />
  );
};

InputComponent.TextArea = TextArea;
InputComponent.Number = Number;

export default InputComponent;
