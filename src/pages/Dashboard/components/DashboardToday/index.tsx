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
const SIZE_ICON = 40;

const DashboardToday = () => {
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
  const items: TabsItemProps[] = [
    {
      children: (
        <DashboardDairy
          dataDashboardToday={dataDashboardToday as DashboardTodayType}
          SIZE_ICON={SIZE_ICON}
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
          SIZE_ICON={SIZE_ICON}
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
