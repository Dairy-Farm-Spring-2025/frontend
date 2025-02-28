import { Popconfirm, PopconfirmProps } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation()
  return (
    <Popconfirm
      description={t("Are you sure to delete?")}
      okText={t("Yes")}
      cancelText={t("No")}
      onConfirm={confirm}
      onCancel={cancel}
      {...props}
    >
      {children}
    </Popconfirm>
  );
};

export default PopconfirmComponent;
