import { Form, FormProps } from "antd";
import React from "react";

interface FormComponentProps extends FormProps {
  form: any;
  colSpan?: number;
  children: React.ReactNode;
}

const validateMessages = {
  required: "The ${label} is required!",
  types: {
    email: "This ${label} is not a valid email!",
    number: "This ${label} is not a valid number!",
  },
  string: {
    len: "The ${label} must be exactly ${len} characters!",
  },
  number: {
    range: "The ${label} must be between ${min} and ${max}",
  },
};

const FormComponent = ({
  form,
  colSpan = 24,
  children,
  ...props
}: FormComponentProps) => {
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
