import { AppstoreOutlined, ProfileOutlined } from "@ant-design/icons";
import TabsComponent, {
  TabsItemProps,
} from "../../../components/Tabs/TabsComponent";
import WhiteBackground from "../../../components/UI/WhiteBackground";
import ProfileInformation from "./TabsItem/ProfileInformation";

const TabsProfile = () => {
  const items: TabsItemProps["items"] = [
    {
      children: <ProfileInformation />,
      icon: <ProfileOutlined />,
      key: "information",
      label: "Profile",
    },
    {
      children: <p>Application</p>,
      icon: <AppstoreOutlined />,
      key: "Application",
      label: "Application",
    },
  ];
  return (
    <WhiteBackground className="!w-full">
      <TabsComponent items={items} />
    </WhiteBackground>
  );
};

export default TabsProfile;
