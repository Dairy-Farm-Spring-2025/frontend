import { Popconfirm, PopconfirmProps } from 'antd';
import { t } from 'i18next';
import React from 'react';

interface PopconfirmComponentPorps extends PopconfirmProps {
  confirm?: PopconfirmProps['onConfirm'];
  cancel?: PopconfirmProps['onCancel'];
  children?: React.ReactNode;
}

const PopconfirmComponent = ({
  confirm,
  cancel,
  children,
  ...props
}: PopconfirmComponentPorps) => {
  return (
    <Popconfirm
      description={t('Are you sure to delete?')}
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
