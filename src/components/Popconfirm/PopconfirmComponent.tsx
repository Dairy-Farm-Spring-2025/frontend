import { Popconfirm, PopconfirmProps } from 'antd';
import React from 'react';

interface PopconfirmComponentPorps extends PopconfirmProps {
  confirm?: PopconfirmProps['onConfirm'];
  cancel?: PopconfirmProps['onCancel'];
  children: React.ReactNode;
}

const PopconfirmComponent = ({
  confirm,
  cancel,
  children,
  ...props
}: PopconfirmComponentPorps) => {
  return (
    <Popconfirm
      description="Are you sure to delete?"
      okText="Yes"
      cancelText="No"
      onConfirm={confirm}
      onCancel={cancel}
      {...props}
    >
      {children}
    </Popconfirm>
  );
};

export default PopconfirmComponent;
