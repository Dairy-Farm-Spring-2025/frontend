import { DatePicker, DatePickerProps } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import useToast from '../../../../../../../hooks/useToast';
import { dailyMilkApi } from '../../../../../../../service/api/DailyMilk/dailyMilkApi';
import DescriptionComponent, {
  DescriptionPropsItem,
} from '../../../../../../../components/Description/DescriptionComponent';
import { RecordDate } from '../../../../../../../model/DailyMilk/DailyMilkRecord';
import { t } from 'i18next';

interface DailyRecordDateProps {
  id: string;
}

const DailyRecordDate = ({ id }: DailyRecordDateProps) => {
  const [dateSelected, setDateSelected] = useState(dayjs());
  const [data, setData] = useState<RecordDate>();
  const toast = useToast();

  const onChange: DatePickerProps['onChange'] = (date) => {
    setDateSelected(date);
  };

  useEffect(() => {
    const fetchData = async (date: string) => {
      try {
        const response = await dailyMilkApi.recordDailyMilkCowByDate(id, date);
        setData(response.data);
      } catch (error: any) {
        toast.showError(error.message);
      }
    };
    fetchData(dayjs(dateSelected).format('YYYY-MM-DD'));
  }, [dateSelected, id]);

  const items: DescriptionPropsItem['items'] = [
    {
      key: 'total',
      label: (
        <p>
          {t("Total")} <span className="text-orange-500">(lit)</span>
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
      className: '!text-base',
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-2 w-full">
        <p className="font-bold text-base">{t('Select Date')}:</p>
        <DatePicker
          onChange={onChange}
          className="w-3/5"
          value={dateSelected}
        />
      </div>
      <DescriptionComponent items={items} className="w-3/5 mt-5" />
    </div>
  );
};

export default DailyRecordDate;
