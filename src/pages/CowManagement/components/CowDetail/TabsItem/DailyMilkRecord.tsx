import TabsComponent, {
  TabsItemProps,
} from '../../../../../components/Tabs/TabsComponent';
import DailyRecordDate from './components/DailyMilkRecordItems/DailyRecordDate';
import DailyRecordMonth from './components/DailyMilkRecordItems/DailyRecordMonth';
import { BarChartOutlined, CalendarOutlined } from '@ant-design/icons';

interface DailyMilkRecordProps {
  id: any;
}

const DailyMilkRecord = ({ id }: DailyMilkRecordProps) => {
  const items: TabsItemProps['items'] = [
    {
      key: 'dateRecord',
      label: 'Date Record',
      children: <DailyRecordDate id={id} />,
      icon: <CalendarOutlined />,
    },
    {
      key: 'monthRecord',
      label: 'Monthly Record',
      children: <DailyRecordMonth id={id} />,
      icon: <BarChartOutlined />,
    },
  ];
  return (
    <TabsComponent
      defaultActiveKey="date"
      items={items}
      tabPosition="left"
      centered={true}
      className="min-h-[500px]"
    />
  );
};

export default DailyMilkRecord;
