import TabsComponent, { TabsItemProps } from '@components/Tabs/TabsComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import { t } from 'i18next';
import TaskScheduleCalendar from './components/TabsItem/TaskScheduleCalendar';
import { CalendarOutlined, FundProjectionScreenOutlined } from '@ant-design/icons';
import ReportTask from './components/TabsItem/ReportTask';

const TaskSchedule = () => {
  const items: TabsItemProps['items'] = [
    {
      key: 'schedule-calendar',
      label: t('Timetable'),
      children: <TaskScheduleCalendar />,
      icon: <CalendarOutlined />,
    },
    {
      key: 'report-task',
      label: t('Report task'),
      children: <ReportTask />,
      icon: <FundProjectionScreenOutlined />,
    },
  ];
  return (
    <AnimationAppear>
      <WhiteBackground>
        <TabsComponent
          items={items}
          destroyInactiveTabPane
          defaultActiveKey="schedule-calendar"
        />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default TaskSchedule;
