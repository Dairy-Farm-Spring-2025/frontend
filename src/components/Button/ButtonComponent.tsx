import { Button, ButtonProps } from "antd";
interface ButtonComponentProps extends ButtonProps {
  children: React.ReactNode;
}
const ButtonComponent = ({ children, ...props }: ButtonComponentProps) => {
  return (
    <Button {...props} className="duration-100">
      {children}
    </Button>
  );
};

export default ButtonComponent;
