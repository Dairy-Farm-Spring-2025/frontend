import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const colors = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff6666',
  '#a28ff2',
  '#f17c67',
  '#f0c987',
];

interface CowTypePieChartProps {
  chartData: {
    cowTypeName: string;
    total: number;
  }[];
}

const CowTypePieChart = ({ chartData }: CowTypePieChartProps) => {
  const pieData = chartData.map((item) => ({
    name: item.cowTypeName,
    value: item.total,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {pieData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CowTypePieChart;
