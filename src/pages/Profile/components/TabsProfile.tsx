import {
  AppstoreOutlined,
  EditOutlined,
  ProfileOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import TabsComponent, {
  TabsItemProps,
} from '../../../components/Tabs/TabsComponent';
import WhiteBackground from '../../../components/UI/WhiteBackground';
import ProfileInformation from './TabsItem/ProfileInformation';
import { UserProfileData } from '../../../model/User';
import ChangePassword from './TabsItem/ChangePassword';
import SettingOptions from './TabsItem/SettingOptions';
import { useTranslation } from 'react-i18next';
import GeneralInformation from './GeneralInformation';
import { Divider } from 'antd';

interface TabsProfileProps {
  profile: UserProfileData;
  mutate: any;
}

const TabsProfile = ({ profile, mutate }: TabsProfileProps) => {
  const { t } = useTranslation();

  const items: TabsItemProps['items'] = [
    {
      children: <ProfileInformation profile={profile} mutate={mutate} />,
      icon: <ProfileOutlined />,
      key: 'information',
      label: t('profile'),
    },
    {
      children: <ChangePassword />,
      icon: <EditOutlined />,
      key: 'changePassword',
      label: t('change_password'), // Translation for 'Change Password'
    },
    {
      children: <p>Application</p>,
      icon: <AppstoreOutlined />,
      key: 'Application',
      label: t('application'), // Translation for 'Application'
    },
    {
      children: <SettingOptions />,
      key: 'Setting',
      label: t('setting'), // Translation for 'Setting'
      icon: <SettingOutlined />,
    },
  ];
  return (
    <WhiteBackground className="!w-full flex flex-col gap-5">
      <GeneralInformation profile={profile} mutate={mutate} />
      <Divider className="!my-2" />
      <TabsComponent items={items} destroyInactiveTabPane />
    </WhiteBackground>
  );
};

export default TabsProfile;
