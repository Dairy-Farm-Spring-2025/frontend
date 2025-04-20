import CardComponent from '@components/Card/CardComponent';
import StatisticComponent from '@components/Chart/Statistic/StatisticComponent';
import Title from '@components/UI/Title';
import { DashboardTodayType } from '@model/Dashboard/Dashboard';
import { t } from 'i18next';
import { FaUser, FaUserDoctor } from 'react-icons/fa6';
import { PiCowBold } from 'react-icons/pi';
import CowStatusPieChart from '../components/CowStatusPieChart';
import CowTypeStatChart from '../components/CowTypeStatChart';

interface DashboardDairy {
  dataDashboardToday: DashboardTodayType;
  SIZE_ICON?: number;
  chartData: any;
}

const DashboardDairy = ({
  chartData,
  dataDashboardToday,
  SIZE_ICON = 0,
}: DashboardDairy) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
        <StatisticComponent
          icon={<PiCowBold size={SIZE_ICON} />}
          title={t('Total Cow')}
          value={dataDashboardToday?.totalCow}
          suffix={t('cows')}
        />
        <StatisticComponent
          icon={<FaUser size={SIZE_ICON} />}
          title={t('Total Worker')}
          value={dataDashboardToday?.totalWorkers}
          suffix={t('workers')}
        />
        <StatisticComponent
          icon={<FaUserDoctor size={SIZE_ICON} />}
          title={t('Total Veterinarian')}
          value={dataDashboardToday?.totalWorkers}
          suffix={t('veterinarians')}
        />
      </div>
      <div className="flex flex-col gap-5">
        <Title>{t('Cow statistics')}</Title>
        <div className="flex sm:flex-col md:flex-col lg:flex-col xl:flex-row 2xl:flex-row gap-5">
          <div className="md:w-full sm:w-full lg:w-full 2xl:w-1/3 xl:w-1/3">
            <CardComponent className="!shadow-card">
              <CowStatusPieChart
                chartData={dataDashboardToday?.cowStatsByType as any}
              />
            </CardComponent>
          </div>
          <div className="md:w-full sm:w-full lg:w-full 2xl:w-2/3 xl:w-2/3">
            <CardComponent className="!shadow-card">
              <CowTypeStatChart chartData={chartData} />
            </CardComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDairy;
