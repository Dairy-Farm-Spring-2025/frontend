import { Button, ButtonProps, ConfigProvider } from 'antd';
import React from 'react';
interface ButtonComponentProps extends ButtonProps {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
  buttonType?:
    | 'primary'
    | 'secondary'
    | 'warning'
    | 'thirdly'
    | 'amber'
    | 'cyan'
    | 'geekblue'
    | 'magenta'
    | 'volcano'
    | 'lime'
    | 'gold'
    | 'purple';
}

const ButtonComponent = ({
  className,
  children,
  buttonType = 'primary',
  ...props
}: ButtonComponentProps) => {
  const buttonTypeColor = {
    primary: 'rgb(21 128 61 / var(--tw-text-opacity, 1))', // Green
    secondary: '#0958d9', // Blue
    warning: '#FFA500', // Orange
    thirdly: '#8B5CF6', // Purple
    amber: '#FFC107', // Amber
    cyan: '#13C2C2', // Cyan
    geekblue: '#2F54EB', // Geek Blue
    magenta: '#EB2F96', // Magenta
    volcano: '#FA541C', // Volcano Red-Orange
    lime: '#A0D911', // Lime Green
    gold: '#FAAD14', // Gold
    purple: '#722ED1', // Deep Purple
  };
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: buttonTypeColor[buttonType ? buttonType : 'primary'],
        },
      }}
    >
      <Button
        {...props}
        className={`duration-300 ${className} shadow-lg text-base px-5 !w-fit`}
      >
        {children}
      </Button>
    </ConfigProvider>
  );
};

export default ButtonComponent;
