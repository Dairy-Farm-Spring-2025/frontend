import { Popconfirm, PopconfirmProps } from 'antd';
import { t } from 'i18next';
import React from 'react';

interface PopconfirmComponentProps extends PopconfirmProps {
  confirm?: PopconfirmProps['onConfirm'];
  cancel?: PopconfirmProps['onCancel'];
  children?: React.ReactNode;
}

const PopconfirmComponent = ({
  confirm,
  cancel,
  title,
  children,
  ...props
}: PopconfirmComponentProps) => {
  return (
    <Popconfirm
      title={title ?? t('Are you sure?')}
      okText={t('Yes')}
      cancelText={t('No')}
      onConfirm={confirm}
      onCancel={cancel}
      {...props}
    >
      {children}
    </Popconfirm>
  );
};

export default PopconfirmComponent;
