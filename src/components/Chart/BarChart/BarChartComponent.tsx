import { Card, Spin } from 'antd';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface BarChartComponentProps {
  data: { month: number; value: number }[];
  loading: boolean;
}

const BarChartComponent = ({ data, loading }: BarChartComponentProps) => {
  const fullData = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const existingData = data.find((item) => item.month === month);
    return {
      month,
      value: existingData ? existingData.value : 0,
    };
  });

  return (
    <Card className="w-full shadow-lg min-h-[500px]">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Spin />
        </div>
      ) : (
        <ResponsiveContainer height={500}>
            <BarChart data={fullData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                ticks={Array.from({ length: 12 }, (_, index) => index + 1)}
                tickFormatter={(value: number) =>
                  MONTH_NAMES[value - 1]?.slice(0, 3)
                }
              />
              <YAxis />
              <Tooltip
                formatter={(value) => `${value}`}
                labelFormatter={(label) => `Month: ${MONTH_NAMES[label - 1]}`}
              />
              <Bar dataKey="value" fill="green" radius={4} />
            </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default BarChartComponent;
