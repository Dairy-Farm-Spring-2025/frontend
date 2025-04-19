import { DatePicker, DatePickerProps, Spin } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import DescriptionComponent, {
  DescriptionPropsItem,
} from '@components/Description/DescriptionComponent';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { RecordDate } from '@model/DailyMilk/DailyMilkRecord';
import { useTranslation } from 'react-i18next';
import { DASHBOARD_PATH } from '@service/api/Dashboard/dashboardApi';

const DailyMilkTotalDate = () => {
  const { t } = useTranslation();
  const [dateSelected, setDateSelected] = useState(dayjs());
  const { data, isLoading, error } = useFetcher<RecordDate>(
    DASHBOARD_PATH.DAILY_MILK_TOTAL_DATE(
      dayjs(dateSelected).format('YYYY-MM-DD')
    ),
    'GET'
  );
  const toast = useToast();

  const onChange: DatePickerProps['onChange'] = (date) => {
    setDateSelected(date);
  };

  const items: DescriptionPropsItem['items'] = [
    {
      key: 'total',
      label: (
        <p>
          {t('Total')} <span className="text-orange-500">(lit)</span>
        </p>
      ),
      children: (
        <p>
          {data?.totalMilk !== null ? (
            <span>{data?.totalMilk} lit</span>
          ) : (
            'No milk'
          )}
        </p>
      ),
      className: '!text-lg',
    },
  ];

  if (error) toast.showError(error);

  return isLoading ? (
    <Spin />
  ) : (
    <div>
      <div className="flex flex-col gap-2 w-full">
        <p className="font-bold text-base">{t('Select Date')}:</p>
        <DatePicker
          onChange={onChange}
          className="w-1/5"
          value={dateSelected}
        />
      </div>
      <DescriptionComponent items={items} className="w-1/4 mt-5" />
    </div>
  );
};

export default DailyMilkTotalDate;
