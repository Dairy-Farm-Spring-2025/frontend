import CardComponent from '@components/Card/CardComponent';
import Title from '@components/UI/Title';
import { ConfigProvider, Statistic, StatisticProps } from 'antd';
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
      if (width < 640) setFontSize(12); // mobile
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
              <div className="flex gap-2 items-center !text-primary">
                <Title
                  className="sm:!truncate md:!truncate lg:!truncate 
                sm:!max-w-[160px] md:!max-w-[190px] lg:!max-w-[180px] xl:!max-w-[220px]"
                >
                  {title}
                </Title>
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
