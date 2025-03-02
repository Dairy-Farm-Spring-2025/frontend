import { DatePicker, DatePickerProps } from 'antd';

interface DatePickerComponentProps extends DatePickerProps {
  className?: string;
}
const DatePickerComponent = ({
  className,
  ...props
}: DatePickerComponentProps) => {
  return (
    <DatePicker format={'DD / MM / YYYY'} className={className} {...props} />
  );
};

export default DatePickerComponent;
