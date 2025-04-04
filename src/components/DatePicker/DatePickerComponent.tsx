import { ConfigProvider, DatePicker, DatePickerProps } from 'antd';
import { t } from 'i18next';
import viLocale from 'antd/locale/vi_VN';
import enLocale from 'antd/locale/en_US';
import 'dayjs/locale/vi';
import 'dayjs/locale/en-gb';
import dayjs from 'dayjs';

dayjs.locale('vi-vn');
dayjs.locale('en-gb');

interface DatePickerComponentProps extends DatePickerProps {
  className?: string;
}
const DatePickerComponent = ({
  className,
  ...props
}: DatePickerComponentProps) => {
  const locale = localStorage.getItem('i18nextLng');
  const pickerLocale = locale === 'en' ? enLocale : viLocale;

  return (
    <ConfigProvider locale={pickerLocale}>
      <DatePicker
        format={'DD / MM / YYYY'}
        className={` w-full ${className}`}
        placeholder={t('Select date')}
        {...props}
      />
    </ConfigProvider>
  );
};

export default DatePickerComponent;
