import { t } from 'i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CowTypeStatChart {
  chartData: any;
}
const colors = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff6666',
  '#a28ff2',
  '#f17c67',
  '#f0c987',
];
const formatLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1') // chèn dấu cách trước chữ in hoa
    .replace(/^./, (str) => str.toUpperCase()); // viết hoa chữ cái đầu
};
const CowTypeStatChart = ({ chartData }: CowTypeStatChart) => {
  const statusKeys: string[] = Array.from(
    new Set(
      chartData.flatMap((item: any) =>
        Object.keys(item).filter((key) => key !== 'cowTypeName')
      )
    )
  );
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="cowTypeName" />
        <YAxis />
        <Tooltip />
        <Legend />
        {statusKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="a"
            fill={colors[index % colors.length]}
            name={t(formatLabel(key))}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CowTypeStatChart;
