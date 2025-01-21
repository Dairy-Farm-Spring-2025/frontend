import { Button, ButtonProps } from 'antd';
import React from 'react';
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
    <Button
      {...props}
      className={`duration-300 ${className} shadow-lg text-base px-5 !w-fit`}
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;
