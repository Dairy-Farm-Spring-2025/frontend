import { EditOutlined } from '@ant-design/icons';
import TabsComponent, {
  TabsItemProps,
} from '../../../../components/Tabs/TabsComponent';
import ChangeLanguage from './components/ChangeLanguage';
import { useTranslation } from 'react-i18next';

const SettingOptions = () => {
  const { t } = useTranslation();
  const items: TabsItemProps['items'] = [
    {
      children: <ChangeLanguage />,
      key: 'change-language',
      label: t('change_language'),
      icon: <EditOutlined />,
    },
  ];
  return (
    <div>
      <TabsComponent items={items} tabPosition="left" />
    </div>
  );
};

export default SettingOptions;
