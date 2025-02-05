import {
  AppstoreOutlined,
  HomeOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { Column } from '../../../../../../components/Table/TableComponent';
import TabsComponent, {
  TabsItemProps,
} from '../../../../../../components/Tabs/TabsComponent';
import AnimationAppear from '../../../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../../../components/UI/WhiteBackground';
import useFetcher from '../../../../../../hooks/useFetcher';
import { Item } from '../../../../../../model/Warehouse/items';
import ListAllItem from './components/ListAllItem';
import ListItemCategory from './components/ListItemCategory';
import ListItemWarehouse from './components/ListItemWarehouse';
import TextLink from '../../../../../../components/UI/TextLink';

const convertToTreeDataByWarehouse = (items: Item[]) => {
  const warehouseMap = new Map();

  items.forEach((item) => {
    const warehouseId = item.warehouseLocationEntity?.warehouseLocationId;
    const warehouseName = item.warehouseLocationEntity?.name;

    if (!warehouseMap.has(warehouseId)) {
      warehouseMap.set(warehouseId, {
        key: `warehouse-${warehouseId}`,
        name: warehouseName,
        quantity: '',
        unit: '',
        categoryEntity: '',
        status: '',
        children: [],
      });
    }
    warehouseMap.get(warehouseId).children.push({
      ...item,
      key: `item-${item.itemId}`,
    });
  });

  return Array.from(warehouseMap.values());
};

const ListItemManagement = () => {
  const {
    data: itemData,
    isLoading: isLoadingItem,
    mutate: mutateItem,
  } = useFetcher<Item[] | any>('items', 'GET');
  const { isLoading: isLoadingWarehouse, trigger: triggerWarehouse } =
    useFetcher('items/warehouse');
  const { isLoading: isLoadingCategory, trigger: triggerCategory } =
    useFetcher('items/category');

  const column: Column[] = [
    {
      key: 'itemId',
      dataIndex: 'itemId',
      title: '#',
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Name',
      render: (name, data) => <TextLink to={`${data.itemId}`}>{name}</TextLink>,
    },
    {
      key: 'quantity',
      dataIndex: 'quantity',
      title: 'Quantity',
    },
    {
      key: 'unit',
      dataIndex: 'unit',
      title: 'Unit',
    },
    {
      key: 'categoryEntity',
      dataIndex: 'categoryEntity',
      title: 'Category',
      render: (data) => data?.name,
    },
    {
      key: 'warehouseLocationEntity',
      dataIndex: 'warehouseLocationEntity',
      title: 'Warehouse Location',
      render: (data) => data?.name,
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: 'Status',
    },
  ];

  const columnsItemByWarehouse: Column[] = [
    {
      title: 'ID',
      dataIndex: 'itemId',
      key: 'itemId',
      width: 100,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, data) =>
        data.children ? (
          <strong>{name}</strong>
        ) : (
          <TextLink to={`${data.itemId}`}>{name}</TextLink>
        ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      width: 120,
    },
    {
      title: 'Category',
      dataIndex: 'categoryEntity',
      key: 'categoryEntity',
      render: (category) => category?.name || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
    },
  ];

  const items: TabsItemProps['items'] = [
    {
      key: 'all',
      label: 'View All',
      children: (
        <ListAllItem
          column={columnsItemByWarehouse}
          isLoading={isLoadingItem}
          itemData={
            itemData ? convertToTreeDataByWarehouse(itemData) : itemData
          }
          mutate={mutateItem}
        />
      ),
      icon: <UnorderedListOutlined />,
    },
    {
      key: 'view-by-warehouse',
      label: 'View By Warehouse',
      children: (
        <ListItemWarehouse
          column={column}
          isLoading={isLoadingWarehouse}
          trigger={triggerWarehouse}
        />
      ),
      icon: <HomeOutlined />,
    },
    {
      key: 'view-by-category',
      label: 'View By Category',
      children: (
        <ListItemCategory
          column={column}
          isLoading={isLoadingCategory}
          trigger={triggerCategory}
        />
      ),
      icon: <AppstoreOutlined />,
    },
  ];

  return (
    <AnimationAppear>
      <WhiteBackground>
        <TabsComponent items={items} destroyInactiveTabPane />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ListItemManagement;
