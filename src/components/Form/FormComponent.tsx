import { Form, FormProps } from "antd";
import React from "react";

interface FormComponentProps extends FormProps {
  form: any;
  children: React.ReactNode;
}

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const FormComponent = ({ form, children, ...props }: FormComponentProps) => {
  return (
    <Form
      form={form}
      labelCol={{ span: 24 }}
      validateMessages={validateMessages}
      {...props}
    >
      {children}
    </Form>
  );
};

export default FormComponent;
