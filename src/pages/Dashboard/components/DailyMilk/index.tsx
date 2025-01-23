import { BarChartOutlined, CalendarOutlined } from '@ant-design/icons';
import TabsComponent, {
  TabsItemProps,
} from '../../../../components/Tabs/TabsComponent';
import DailyMilkTotalMonth from './components/DailyMilkTotalMonth';
import AnimationAppear from '../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../components/UI/WhiteBackground';
import DailyMilkTotalDate from './components/DailyMilkTotalDate';

const DailyMilkDashboard = () => {
  const items: TabsItemProps['items'] = [
    {
      key: 'dateRecord',
      label: 'Date Record',
      children: <DailyMilkTotalMonth />,
      icon: <CalendarOutlined />,
    },
    {
      key: 'monthRecord',
      label: 'Monthly Record',
      children: <DailyMilkTotalDate />,
      icon: <BarChartOutlined />,
    },
  ];
  return (
    <AnimationAppear>
      <WhiteBackground>
        <TabsComponent
          defaultActiveKey="date"
          items={items}
          tabPosition="left"
          centered={true}
          className="min-h-[500px]"
        />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default DailyMilkDashboard;
