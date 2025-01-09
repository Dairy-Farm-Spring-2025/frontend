import { Form, FormItemProps } from "antd";

interface FormItemComponentProps extends FormItemProps {
  label: string;
  name: string;
  children: React.ReactNode;
}

const FormItemComponent = ({
  children,
  label,
  name,
  ...props
}: FormItemComponentProps) => {
  return (
    <Form.Item label={label} name={name} {...props}>
      {children}
    </Form.Item>
  );
};

export default FormItemComponent;
