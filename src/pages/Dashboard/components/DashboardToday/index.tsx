import { StockOutlined } from '@ant-design/icons';
import TabsComponent, { TabsItemProps } from '@components/Tabs/TabsComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import { DashboardTodayType } from '@model/Dashboard/Dashboard';
import { DASHBOARD_PATH } from '@service/api/Dashboard/dashboardApi';
import { t } from 'i18next';
import DashboardDairy from './TabsItem/DashboardDairy';
import DashboardTodayStatistic from './TabsItem/DashboardTodayStatistic';
import { useEffect, useState } from 'react';

const DashboardToday = () => {
  const [responsiveIconSize, setResponsiveIconSize] = useState(40); // default size
  const { data: dataDashboardToday, isLoading: isLoadingDataToday } =
    useFetcher<DashboardTodayType>(DASHBOARD_PATH.DASHBOARD_TODAY, 'GET');
  const chartData = dataDashboardToday?.cowStatsByType?.map((item) => {
    const base: any = { cowTypeName: item.cowTypeName };
    Object.entries(item.statusCount).forEach(([key, value]) => {
      base[key] = value;
    });
    return base;
  });
  const totalQuantity = dataDashboardToday?.usedItemsToday
    ? (Object.values(dataDashboardToday.usedItemsToday) as number[]).reduce(
        (acc: number, value: number) => acc + value,
        0
      )
    : 0;
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) setResponsiveIconSize(24); // mobile
      else if (width < 1024) setResponsiveIconSize(28); // tablet
      else if (width < 1440) setResponsiveIconSize(36); // laptop
      else setResponsiveIconSize(40); // desktop
    };

    handleResize(); // set once on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const items: TabsItemProps[] = [
    {
      children: (
        <DashboardDairy
          dataDashboardToday={dataDashboardToday as DashboardTodayType}
          SIZE_ICON={responsiveIconSize}
          chartData={chartData}
        />
      ),
      label: t('Dashboard dairy'),
      icon: <StockOutlined />,
      key: 'dashboard-dairy',
    },
    {
      children: (
        <DashboardTodayStatistic
          dataDashboardToday={dataDashboardToday as DashboardTodayType}
          SIZE_ICON={responsiveIconSize}
          totalQuantity={totalQuantity}
        />
      ),
      label: t('Dashboard today'),
      icon: <StockOutlined />,
      key: 'dashboard-today',
    },
  ];

  return (
    <AnimationAppear loading={isLoadingDataToday}>
      <WhiteBackground>
        <div className="flex flex-col gap-5">
          <TabsComponent items={items as any} />
        </div>
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default DashboardToday;
