import { Form, FormItemProps } from "antd";
import React from "react";
import "./index.scss";
interface FormItemComponentProps extends FormItemProps {
  label?: string | React.ReactNode;
  name: string;
  children: React.ReactNode;
  className?: string;
}

const FormItemComponent = ({
  children,
  label,
  className,
  name,
  ...props
}: FormItemComponentProps) => {
  return (
    <Form.Item
      label={label}
      name={name}
      {...props}
      className={`form-item ${className}`}
    >
      {children}
    </Form.Item>
  );
};

export default FormItemComponent;
