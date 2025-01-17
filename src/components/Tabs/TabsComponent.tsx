import { Tabs, TabsProps } from 'antd';

export interface TabsItemProps extends TabsProps {
  key: string;
  label: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

interface TabsComponentProps extends TabsProps {
  items: TabsItemProps['items'];
}
const TabsComponent = ({ items = [], ...props }: TabsComponentProps) => {
  return <Tabs defaultActiveKey={items[0].key} items={items} {...props} />;
};

export default TabsComponent;
