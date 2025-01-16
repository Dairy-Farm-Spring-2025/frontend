import { PlusCircleOutlined, ProfileOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useParams } from "react-router-dom";
import TabsComponent, {
  TabsItemProps,
} from "../../../../components/Tabs/TabsComponent";
import AnimationAppear from "../../../../components/UI/AnimationAppear";
import WhiteBackground from "../../../../components/UI/WhiteBackground";
import useFetcher from "../../../../hooks/useFetcher";
import CowGeneralInformation from "./TabsItem/GeneralInformation";

const CowDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useFetcher<any>(`cows/${id}`, "GET");
  const items: TabsItemProps["items"] = [
    {
      key: "information",
      label: "General Information",
      children: <CowGeneralInformation detail={data} />,
      icon: <ProfileOutlined />,
    },
    {
      key: "health",
      label: "Health Record",
      children: <p>Health</p>,
      icon: <PlusCircleOutlined />,
    },
  ];
  return isLoading ? (
    <Spin />
  ) : (
    <AnimationAppear>
      <WhiteBackground>
        <TabsComponent items={items} />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default CowDetail;
