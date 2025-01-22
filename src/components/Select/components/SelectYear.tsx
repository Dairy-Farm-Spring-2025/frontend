import { Select } from 'antd';

const { Option } = Select;

interface SelectYearProps {
  defaultYear: any;
  onChange: any;
}

const SelectYear = ({ defaultYear, onChange }: SelectYearProps) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 20 }, (_, i) => currentYear - i); // Generate the last 20 years

  return (
    <Select
      style={{ width: 200, marginBottom: 20 }}
      defaultValue={defaultYear}
      onChange={onChange}
    >
      {yearOptions.map((year) => (
        <Option key={year} value={year}>
          {year}
        </Option>
      ))}
    </Select>
  );
};

export default SelectYear;
