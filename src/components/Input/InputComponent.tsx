import { Input, InputProps } from "antd";
import "./index.scss";
import { TextAreaProps } from "antd/es/input";
interface InputComponentProps extends InputProps {
  className?: string;
}
interface TextAreaComponentProp extends TextAreaProps {
  className?: string;
}
const InputComponent = ({ className, ...props }: InputComponentProps) => {
  return <Input className={`input-component ${className}`} {...props} />;
};

const TextArea = ({ className, ...props }: TextAreaComponentProp) => (
  <Input.TextArea
    className={`input-component text-area-component ${className || ""}`}
    {...props}
  />
);

InputComponent.TextArea = TextArea;

export default InputComponent;
