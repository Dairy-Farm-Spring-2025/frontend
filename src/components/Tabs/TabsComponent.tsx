import { Tabs, TabsProps } from "antd";

export interface TabsItemProps extends TabsProps {
  key: string;
  label: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

interface TabsComponentProps {
  items: TabsItemProps["items"];
}
const TabsComponent = ({ items = [] }: TabsComponentProps) => {
  return <Tabs defaultActiveKey={items[0].key} items={items} />;
};

export default TabsComponent;
