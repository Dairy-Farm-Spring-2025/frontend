import { BarChartOutlined, CalendarOutlined } from '@ant-design/icons';
import TabsComponent, {
  TabsItemProps,
} from '../../../../components/Tabs/TabsComponent';
import DailyMilkTotalMonth from './components/DailyMilkTotalMonth';
import AnimationAppear from '../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../components/UI/WhiteBackground';
import DailyMilkTotalDate from './components/DailyMilkTotalDate';
import { useTranslation } from 'react-i18next';

const DailyMilkDashboard = () => {
  const { t } = useTranslation();
  const items: TabsItemProps['items'] = [
    {
      key: 'dateRecord',
      label: t('Date Record'),
      children: <DailyMilkTotalMonth />,
      icon: <CalendarOutlined />,
    },
    {
      key: 'monthRecord',
      label: t('Monthly Record'),
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
