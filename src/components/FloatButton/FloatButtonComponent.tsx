import { ConfigProvider, FloatButton } from 'antd';
import { t } from 'i18next';
import React from 'react';

interface FloatButtonProps extends FloatButtonGroupProps {
  icon?: any;
  onClick?: any;
  description?: string;
  type?: 'primary' | 'default';
  shape?: 'circle' | 'square';
  tooltip?: React.ReactNode | string;
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

interface FloatButtonGroupProps {
  children: React.ReactNode[] | React.ReactNode;
}

const FloatButtonComponent = ({
  icon,
  description,
  onClick,
  type = 'primary',
  shape = 'circle',
  buttonType = 'primary',
  tooltip = t('Default'),
  ...props
}: FloatButtonProps) => {
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
      <FloatButton
        icon={icon}
        description={description}
        onClick={onClick}
        type={type}
        shape={shape}
        tooltip={tooltip}
        style={{ insetInlineEnd: 164 }}
        {...props}
      />
    </ConfigProvider>
  );
};

const Group = ({ children }: FloatButtonGroupProps) => {
  return <FloatButton.Group>{children}</FloatButton.Group>;
};

const BackTop = () => {
  return <FloatButton.BackTop />;
};

FloatButtonComponent.Group = Group;
FloatButtonComponent.BackTop = BackTop;

export default FloatButtonComponent;
