import { Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

interface LabelDashboardProps {
  children: React.ReactNode;
}

const LabelDashboard = ({ children }: LabelDashboardProps) => {
  return (
    <Text className="font-bold !text-base hover:opacity-60 !w-full">
      {children}
    </Text>
  );
};

export default LabelDashboard;
