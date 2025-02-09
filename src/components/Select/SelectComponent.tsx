import { Select, SelectProps } from 'antd';
import './index.scss';

interface SelectComponentProps extends SelectProps {
  className?: string;
  options: (SelectProps['options'] & { searchLabel?: string })[];
  search?: boolean;
}

const SelectComponent = ({
  className = '',
  options,
  search = false,
  ...props
}: SelectComponentProps) => {
  return (
    <Select
      className={`select-component ${className}`}
      placeholder="Select..."
      options={options}
      showSearch={search}
      filterOption={
        search
          ? (input, option) => {
              const labelText = option?.searchLabel || '';
              return labelText.toLowerCase().includes(input.toLowerCase());
            }
          : undefined
      }
      {...props}
    />
  );
};

export default SelectComponent;
