import { t } from 'i18next';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const colors = ['#82ca9d', '#8884d8', '#ffc658', '#ff6666', '#a28ff2'];

interface UsedItemsBarChartProps {
  data: Record<string, number>;
}

const UsedItemsBarChart = ({ data }: UsedItemsBarChartProps) => {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip
          formatter={(value: number) => [`${value}`, t('Quantity')]}
          labelFormatter={(label: string) => `${label}`}
        />{' '}
        <Bar dataKey="value">
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UsedItemsBarChart;
