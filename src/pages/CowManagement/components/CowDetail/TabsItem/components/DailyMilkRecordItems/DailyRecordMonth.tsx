import { useEffect, useState } from 'react';
import useToast from '../../../../../../../hooks/useToast';
import { dailyMilkApi } from '../../../../../../../service/api/DailyMilk/dailyMilkApi';
import SelectYear from '../../../../../../../components/Select/components/SelectYear';
import LineChartComponent from '@components/Chart/LineChart/LineChartComponent';
import { t } from 'i18next';

interface DailyRecordMonthProps {
  id: any;
}

const DailyRecordMonth = ({ id }: DailyRecordMonthProps) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState<boolean>(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchMilkData = async (year: number) => {
      setLoading(true);
      try {
        const response = await dailyMilkApi.recordDailyMilkOfCowByMonth(
          id,
          year
        );
        if (response.data) {
          const transformedData = response.data.map((item: any) => ({
            month: item.month,
            value: item.totalMilk,
          }));
          setChartData(transformedData);
        } else {
          setChartData([]); // No data for the selected year
        }
      } catch (error: any) {
        toast.showError(error.message);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMilkData(selectedYear);
  }, [id, selectedYear]);

  const handleYearChange = (year: any) => {
    setSelectedYear(year);
  };

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <p className="font-bold text-base">{t('Select year')}:</p>
        <SelectYear defaultYear={selectedYear} onChange={handleYearChange} />
      </div>
      <LineChartComponent
        data={chartData}
        textRender={t('Milk')}
        loading={loading}
      />
    </>
  );
};

export default DailyRecordMonth;
