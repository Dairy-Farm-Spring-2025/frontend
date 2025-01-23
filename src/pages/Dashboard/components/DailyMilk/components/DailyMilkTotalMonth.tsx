import { useEffect, useState } from 'react';
import BarChartComponent from '../../../../../components/Chart/BarChart/BarChartComponent';
import SelectYear from '../../../../../components/Select/components/SelectYear';
import useFetcher from '../../../../../hooks/useFetcher';
import useToast from '../../../../../hooks/useToast';
import { DailyMilkRecordMonth } from '../../../../../model/DailyMilk/DailyMilkRecord';

const DailyMilkTotalMonth = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { data, isLoading, error } = useFetcher<DailyMilkRecordMonth[]>(
    `dailymilks/total/month?year=${selectedYear}`,
    'GET'
  );
  const [chartData, setChartData] = useState<any[]>([]);
  const toast = useToast();

  useEffect(() => {
    if (data) {
      const filteredData = data.map((element: DailyMilkRecordMonth) => ({
        month: element.month,
        value: element.totalMilk,
      }));
      setChartData(filteredData);
    }
  }, [data]);

  const handleYearChange = (year: any) => {
    setSelectedYear(year);
  };

  if (error) toast.showError(error);

  return (
    <>
      <div className="flex flex-col gap-2 w-full">
        <p className="font-bold text-base">Select Year:</p>
        <SelectYear defaultYear={selectedYear} onChange={handleYearChange} />
      </div>
      <BarChartComponent loading={isLoading} data={chartData} />
    </>
  );
};

export default DailyMilkTotalMonth;
