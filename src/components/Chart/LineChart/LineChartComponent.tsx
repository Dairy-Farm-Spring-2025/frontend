import { Skeleton } from 'antd';
import {
  CartesianAxis,
  Legend,
  Line,
  LineChart,
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
interface LineChartComponentProps {
  data: { month: number; value: number }[];
  textRender?: string;
  loading?: boolean;
}
const LineChartComponent = ({
  data,
  textRender,
  loading,
}: LineChartComponentProps) => {
  const fullData = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const existingData = data.find((item) => item.month === month);
    return {
      month,
      value: existingData ? existingData.value : 0,
    };
  });
  return !loading ? (
    <ResponsiveContainer height={500}>
      <LineChart data={fullData}>
        <CartesianAxis strokeDasharray="3 3" />
        {/* <XAxis
          name="month"
          tickLine={false}
          tickMargin={10}
          ticks={Array.from({ length: 12 }, (_, index) => index + 1)}
          tickFormatter={(value: number) => MONTH_NAMES[value - 1]?.slice(0, 3)}
        /> */}
        <XAxis
          dataKey="month"
          type="number"
          tickLine={false}
          tickMargin={10}
          domain={[1, 12]}
          ticks={Array.from({ length: 12 }, (_, index) => index + 1)}
          tickFormatter={(value: number) => MONTH_NAMES[value - 1]?.slice(0, 3)}
        />
        <YAxis />
        <Tooltip
          formatter={(value) => `${value}`}
          labelFormatter={(label) => `Month: ${MONTH_NAMES[label - 1]}`}
        />
        <Legend formatter={() => textRender || 'Custom Legend Text'} />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  ) : (
    <Skeleton />
  );
};

export default LineChartComponent;
