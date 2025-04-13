import CardComponent from '@components/Card/CardComponent';
import StatisticComponent from '@components/Chart/Statistic/StatisticComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import Title from '@components/UI/Title';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import { DashboardTodayType } from '@model/Dashboard/Dashboard';
import { DASHBOARD_PATH } from '@service/api/Dashboard/dashboardApi';
import { Divider } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { BiHealth, BiTask } from 'react-icons/bi';
import { GiHealthDecrease } from 'react-icons/gi';
import { LiaWpforms } from 'react-icons/lia';
import { LuMilk } from 'react-icons/lu';
import { MdTask, MdVaccines } from 'react-icons/md';
import { PiCowBold } from 'react-icons/pi';
import CowStatusPieChart from './components/CowStatusPieChart';
import CowTypeStatChart from './components/CowTypeStatChart';
import UsedItemsBarChart from './components/UsedItemsBarChart';
import { BsBox2, BsBoxSeam } from 'react-icons/bs';

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
    ? Object.values(dataDashboardToday.usedItemsToday).reduce(
        (acc: number, value: number) => acc + value,
        0
      )
    : 0;
  return (
    <AnimationAppear loading={isLoadingDataToday}>
      <WhiteBackground>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5">
            <Title>
              {t('Dashboard date {{date}}', {
                date: dayjs(new Date()).format('DD / MM / YYYY'),
              })}
            </Title>
            <div className="grid grid-cols-4 gap-2">
              <StatisticComponent
                icon={<BiTask size={SIZE_ICON} />}
                title={t('Daily tasks')}
                value={dataDashboardToday?.dailyTasks}
                suffix={t('tasks')}
              />
              <StatisticComponent
                icon={<MdVaccines size={SIZE_ICON} />}
                title={t('Vaccine injection tasks')}
                value={dataDashboardToday?.tasksByVaccineInjection}
                suffix={t('tasks')}
              />
              <StatisticComponent
                icon={<BiHealth size={SIZE_ICON} />}
                title={t('Illness tasks')}
                value={dataDashboardToday?.tasksByIllness}
                suffix={t('tasks')}
              />
              <StatisticComponent
                icon={<GiHealthDecrease size={SIZE_ICON} />}
                title={t('Illness detail tasks')}
                value={dataDashboardToday?.tasksByIllnessDetail}
                suffix={t('tasks')}
              />
              <StatisticComponent
                icon={<LuMilk size={SIZE_ICON} />}
                title={t('Total milk')}
                value={dataDashboardToday?.totalMilkToday}
                suffix={t('Liter (L)')}
              />
              <StatisticComponent
                icon={<MdTask size={SIZE_ICON} />}
                title={t('Total report tasks')}
                value={
                  dataDashboardToday?.todayReports
                    ? dataDashboardToday?.todayReports?.length
                    : 0
                }
                suffix={t('reports')}
              />
              <StatisticComponent
                icon={<LiaWpforms size={SIZE_ICON} />}
                title={t('Total processing application')}
                value={dataDashboardToday?.processingApplicationsCount}
                suffix={t('applications')}
              />
            </div>
          </div>
          <CardComponent
            className="!shadow-card"
            title={
              <div className="flex items-center gap-4">
                <BsBox2 size={SIZE_ICON - 2} />
                <div className="flex flex-col">
                  <Title className="!text-base">{t('Total Item')}</Title>
                  <p>
                    {totalQuantity ? (totalQuantity as number) : 0} {t('items')}
                  </p>
                </div>
              </div>
            }
          >
            <UsedItemsBarChart
              data={dataDashboardToday?.usedItemsToday || {}}
            />
          </CardComponent>
          <Divider className="!my-2" />
          <div className="flex flex-col gap-5">
            <Title>{t('Cow statistics')}</Title>
            <div className="flex gap-5">
              <div className="w-1/3">
                <CardComponent
                  className="!shadow-card"
                  title={
                    <div className="flex items-center gap-4">
                      <PiCowBold size={SIZE_ICON} />
                      <div className="flex flex-col">
                        <Title className="!text-base">{t('Total Cow')}</Title>
                        <p>
                          {dataDashboardToday?.totalCow} {t('cows')}
                        </p>
                      </div>
                    </div>
                  }
                >
                  <CowStatusPieChart
                    chartData={dataDashboardToday?.cowStatsByType as any}
                  />
                </CardComponent>
              </div>
              <div className="w-2/3">
                <CardComponent
                  className="!shadow-card"
                  title={<Title>{t('Cow type statistics')}</Title>}
                >
                  <CowTypeStatChart chartData={chartData} />
                </CardComponent>
              </div>
            </div>
          </div>
        </div>
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default DashboardToday;
