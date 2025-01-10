import { Typography } from "antd";
import React from "react";

const { Text } = Typography;

interface LabelDashboardProps {
  children: React.ReactNode;
}

const LabelDashboard = ({ children }: LabelDashboardProps) => {
  return (
    <Text className="font-semibold !text-primary !text-base underline !underline-offset-2">
      {children}
    </Text>
  );
};

export default LabelDashboard;
