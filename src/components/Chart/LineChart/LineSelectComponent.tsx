import { formatDateHour } from '@utils/format';
import { t } from 'i18next';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface MilkChartProps {
  data: any[];
  dataKeyY?: string;
  dataKeyLine?: string;
}

const LineSelectComponent: React.FC<MilkChartProps> = ({
  data,
  dataKeyY,
  dataKeyLine,
}) => {
  return (
    <ResponsiveContainer height={550}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={dataKeyY}
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={70}
          tickFormatter={(value) => formatDateHour(value)}
        />
        <YAxis />
        <Tooltip
          formatter={(value, name: any) => {
            const translatedLabel = t(name); // Translate the label dynamically
            return [`${value}(l)`, translatedLabel];
          }}
          labelFormatter={(label) => formatDateHour(label)}
        />
        <Line
          type="monotone"
          dataKey={dataKeyLine}
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineSelectComponent;
