import CardComponent from '@components/Card/CardComponent';
import Title from '@components/UI/Title';
import { ConfigProvider, Statistic, StatisticProps } from 'antd';

interface StatisticComponentProps extends StatisticProps {
  title?: string;
  value?: number;
  suffix?: string;
  icon?: React.ReactNode;
}

const StatisticComponent = ({
  title,
  value,
  icon,
  suffix,
  ...props
}: StatisticComponentProps) => {
  return (
    <CardComponent className="!px-3">
      <ConfigProvider
        theme={{
          components: {
            Statistic: {
              contentFontSize: 18,
            },
          },
        }}
      >
        <Statistic
          title={
            <div className="flex gap-2 items-center !text-primary">
              {icon && icon}
              <Title>{title}</Title>
            </div>
          }
          value={value}
          suffix={suffix}
          {...props}
        />
      </ConfigProvider>
    </CardComponent>
  );
};

export default StatisticComponent;
