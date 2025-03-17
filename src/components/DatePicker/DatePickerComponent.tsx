import { DatePicker, DatePickerProps } from 'antd';
import { t } from 'i18next';

interface DatePickerComponentProps extends DatePickerProps {
  className?: string;
}
const DatePickerComponent = ({
  className,
  ...props
}: DatePickerComponentProps) => {
  return (
    <DatePicker
      format={'DD / MM / YYYY'}
      className={` w-full ${className}`}
      placeholder={t('Select date')}
      {...props}
    />
  );
};

export default DatePickerComponent;
