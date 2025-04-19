import CardComponent from '@components/Card/CardComponent';
import StatisticComponent from '@components/Chart/Statistic/StatisticComponent';
import Title from '@components/UI/Title';
import { DashboardTodayType } from '@model/Dashboard/Dashboard';
import { formatDate } from '@utils/format';
import { Avatar, List } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { BiHealth, BiTask } from 'react-icons/bi';
import { BsBox2 } from 'react-icons/bs';
import { GiHealthDecrease } from 'react-icons/gi';
import { LiaWpforms } from 'react-icons/lia';
import { LuMilk } from 'react-icons/lu';
import { MdTask, MdVaccines } from 'react-icons/md';
import UsedItemsBarChart from '../components/UsedItemsBarChart';
interface DashboardTodayStatistic {
  dataDashboardToday: DashboardTodayType;
  SIZE_ICON?: number;
  totalQuantity: number;
}
const DashboardTodayStatistic = ({
  dataDashboardToday,
  SIZE_ICON = 0,
  totalQuantity,
}: DashboardTodayStatistic) => {
  return (
    <div className="flex flex-col gap-5">
      <Title>
        {t('Dashboard date {{date}}', {
          date: dayjs(new Date()).format('DD / MM / YYYY'),
        })}
      </Title>
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
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
        <UsedItemsBarChart data={dataDashboardToday?.usedItemsToday || {}} />
      </CardComponent>
      <CardComponent
        title={
          <div className="flex items-center gap-4">
            <MdTask size={SIZE_ICON - 2} />
            <div className="flex flex-col">
              <Title className="!text-base">{t('Total report tasks')}</Title>
              <p>
                {dataDashboardToday?.todayReports
                  ? (dataDashboardToday?.todayReports.length as number)
                  : 0}{' '}
                {t('reports')}
              </p>
            </div>
          </div>
        }
      >
        <List
          dataSource={dataDashboardToday?.todayReports}
          pagination={{ align: 'center', position: 'bottom' }}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                  />
                }
                title={`${formatDate({
                  data: item.startTime,
                  type: 'render',
                })} - ${formatDate({ data: item.endTime, type: 'render' })}`}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </CardComponent>
    </div>
  );
};

export default DashboardTodayStatistic;
