import {
  AppstoreOutlined,
  EditOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import TabsComponent, {
  TabsItemProps,
} from '../../../components/Tabs/TabsComponent';
import WhiteBackground from '../../../components/UI/WhiteBackground';
import ProfileInformation from './TabsItem/ProfileInformation';
import { UserProfileData } from '../../../model/User';
import ChangePassword from './TabsItem/ChangePassword';

interface TabsProfileProps {
  profile: UserProfileData;
  mutate: any;
}

const TabsProfile = ({ profile, mutate }: TabsProfileProps) => {
  const items: TabsItemProps['items'] = [
    {
      children: <ProfileInformation profile={profile} mutate={mutate} />,
      icon: <ProfileOutlined />,
      key: 'information',
      label: 'Profile',
    },
    {
      children: <ChangePassword />,
      icon: <EditOutlined />,
      key: 'changePassword',
      label: 'Change Password',
    },
    {
      children: <p>Application</p>,
      icon: <AppstoreOutlined />,
      key: 'Application',
      label: 'Application',
    },
  ];
  return (
    <WhiteBackground className="!w-full">
      <TabsComponent items={items} />
    </WhiteBackground>
  );
};

export default TabsProfile;
