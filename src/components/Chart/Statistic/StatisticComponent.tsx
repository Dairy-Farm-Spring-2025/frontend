import CardComponent from '@components/Card/CardComponent';
import Title from '@components/UI/Title';
import { ConfigProvider, Statistic, StatisticProps, Tooltip } from 'antd';
import { useEffect, useState } from 'react';

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
  const [fontSize, setFontSize] = useState(16);
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setFontSize(13); // mobile
      else if (width < 1024) setFontSize(14); // tablet
      else if (width < 1440) setFontSize(14); // macbook
      else setFontSize(16); // large screen
    };

    handleResize(); // init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <CardComponent className="!px-3 !shadow-card">
      <ConfigProvider
        theme={{
          components: {
            Statistic: {
              contentFontSize: fontSize,
            },
          },
        }}
      >
        <div className="flex items-center gap-4">
          <div>{icon && icon}</div>
          <Statistic
            title={
              <Tooltip title={title}>
                <div className="flex gap-2 items-center !text-primary">
                  <Title>{title}</Title>
                </div>
              </Tooltip>
            }
            value={value}
            valueStyle={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            suffix={
              suffix ? (
                <span className="text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px]">
                  {suffix}
                </span>
              ) : null
            }
            {...props}
          />
        </div>
      </ConfigProvider>
    </CardComponent>
  );
};

export default StatisticComponent;
