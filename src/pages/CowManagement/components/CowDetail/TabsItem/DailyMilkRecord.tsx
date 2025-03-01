import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const items: TabsItemProps['items'] = [
    {
      key: 'dateRecord',
      label: t('Daily record'),
      children: <DailyRecordDate id={id} />,
      icon: <CalendarOutlined />,
    },
    {
      key: 'monthRecord',
      label: t('Monthly record'),
      children: <DailyRecordMonth id={id} />,
      icon: <BarChartOutlined />,
    },
  ];
  return (
    <div>
      <div className="text-center mb-5">
        <p className="text-lg font-bold text-primary">{t('Milk record')}</p>
      </div>
      <TabsComponent
        defaultActiveKey="date"
        items={items}
        tabPosition="left"
        centered={true}
        className="min-h-full"
      />
    </div>
  );
};

export default DailyMilkRecord;
