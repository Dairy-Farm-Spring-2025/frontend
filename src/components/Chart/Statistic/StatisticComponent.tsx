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
    <CardComponent className="!px-3 !shadow-card">
      <ConfigProvider
        theme={{
          components: {
            Statistic: {
              contentFontSize: 16,
            },
          },
        }}
      >
        <div className="flex items-center gap-4">
          <div>{icon && icon}</div>
          <Statistic
            title={
              <div className="flex gap-2 items-center !text-primary">
                <Title className="!text-base">{title}</Title>
              </div>
            }
            value={value}
            suffix={suffix}
            {...props}
          />{' '}
        </div>
      </ConfigProvider>
    </CardComponent>
  );
};

export default StatisticComponent;
