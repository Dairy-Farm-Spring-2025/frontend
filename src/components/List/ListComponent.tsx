import { List, ListProps } from 'antd';

interface ListItemProps {
  items: any;
}

interface ListComponentProps extends ListProps<any> {
  data?: ListItemProps[];
  position?: 'bottom' | 'top' | 'both';
  align?: 'start' | 'center' | 'end';
}
const ListComponent = ({
  data,
  position = 'bottom',
  align = 'start',
  ...props
}: ListComponentProps) => {
  return (
    <List
      bordered
      split={true}
      dataSource={data}
      pagination={{ position, align }}
      itemLayout="vertical"
      {...props}
    />
  );
};

export default ListComponent;
