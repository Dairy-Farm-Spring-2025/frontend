import { Button, ButtonProps } from 'antd';
import React from 'react';
interface ButtonComponentProps extends ButtonProps {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  colorButton?: string;
}
const ButtonComponent = ({
  className,
  children,
  colorButton,
  ...props
}: ButtonComponentProps) => {
  return (
    <Button
      {...props}
      className={`duration-300 ${className} shadow-lg text-base px-5 !w-fit ${
        colorButton !== '' &&
        `!bg-${colorButton}-500 hover:!bg-${colorButton}-500 hover:!border-${colorButton}-500`
      }`}
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;
