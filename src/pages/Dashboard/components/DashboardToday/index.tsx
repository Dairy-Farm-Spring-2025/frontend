import { FundProjectionScreenOutlined } from '@ant-design/icons';
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
import { BiTask } from 'react-icons/bi';
import { LuMilk } from 'react-icons/lu';

const DashboardToday = () => {
  const { data: dataDashboardToday, isLoading: isLoadingDataToday } =
    useFetcher<DashboardTodayType>(DASHBOARD_PATH.DASHBOARD_TODAY, 'GET');
  console.log(dataDashboardToday);
  return (
    <AnimationAppear loading={isLoadingDataToday}>
      <WhiteBackground>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Title>
              {t('Daily tasks date {{date}} statistics', {
                date: dayjs(new Date()).format('DD / MM / YYYY'),
              })}
            </Title>
            <div className="flex gap-5">
              <StatisticComponent
                icon={<BiTask size={20} />}
                title={t('Daily tasks')}
                value={dataDashboardToday?.dailyTasks}
                suffix={t('tasks')}
              />
              <StatisticComponent
                icon={<FundProjectionScreenOutlined size={20} />}
                title={t('Vaccine injection tasks')}
                value={dataDashboardToday?.tasksByVaccineInjection}
                suffix={t('tasks')}
              />
              <StatisticComponent
                icon={<FundProjectionScreenOutlined size={20} />}
                title={t('Illness tasks')}
                value={dataDashboardToday?.tasksByIllness}
                suffix={t('tasks')}
              />
              <StatisticComponent
                icon={<FundProjectionScreenOutlined size={20} />}
                title={t('Illness detail tasks')}
                value={dataDashboardToday?.tasksByIllnessDetail}
                suffix={t('tasks')}
              />
            </div>
          </div>
          <Divider className="!my-2" />
          <div className="flex flex-col gap-2">
            <Title>{t('Daily statistics')}</Title>
            <div className="flex gap-5">
              <StatisticComponent
                icon={<LuMilk size={20} />}
                title={t('Total milk')}
                value={dataDashboardToday?.totalMilkToday}
                suffix={t('Liter (L)')}
              />
              <StatisticComponent
                icon={<FundProjectionScreenOutlined size={20} />}
                title={t('Total report tasks')}
                value={
                  dataDashboardToday?.todayReports
                    ? dataDashboardToday?.todayReports?.length
                    : 0
                }
                suffix={t('reports')}
              />
              <StatisticComponent
                icon={<FundProjectionScreenOutlined size={20} />}
                title={t('Total processing application')}
                value={dataDashboardToday?.processingApplicationsCount}
                suffix={t('applications')}
              />
            </div>
          </div>
        </div>
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default DashboardToday;
