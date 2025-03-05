import { Form, FormProps } from 'antd';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface FormComponentProps extends FormProps {
  form: any;
  colSpan?: number;
  children: React.ReactNode;
}

const FormComponent = ({
  form,
  colSpan = 24,
  children,
  ...props
}: FormComponentProps) => {
  const { t } = useTranslation();
  const validateMessages = useMemo(
    () => ({
      required: t('This field is required!'),
      types: {
        email: t('This is not a valid email!'),
        number: t('This is not a valid number!'),
      },
    }),
    [t] // Chỉ re-create khi `t` thay đổi (thay đổi ngôn ngữ)
  );
  return (
    <Form
      form={form}
      labelCol={{ span: colSpan }}
      validateMessages={validateMessages}
      {...props}
    >
      {children}
    </Form>
  );
};

export default FormComponent;
