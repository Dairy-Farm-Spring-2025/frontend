import { Button, ButtonProps } from "antd";
interface ButtonComponentProps extends ButtonProps {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
}
const ButtonComponent = ({
  className,
  children,
  ...props
}: ButtonComponentProps) => {
  return (
    <Button {...props} className={`duration-100 ${className}`}>
      {children}
    </Button>
  );
};

export default ButtonComponent;
