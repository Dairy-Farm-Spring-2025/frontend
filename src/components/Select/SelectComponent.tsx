import { Select, SelectProps } from 'antd';
import './index.scss';

interface SelectComponentProps extends SelectProps {
  className?: string;
  options: SelectProps['options'];
}

const SelectComponent = ({
  className,
  options,
  ...props
}: SelectComponentProps) => {
  return (
    <Select
      className={`select-component ${className}`}
      options={options}
      {...props}
    />
  );
};

export default SelectComponent;
