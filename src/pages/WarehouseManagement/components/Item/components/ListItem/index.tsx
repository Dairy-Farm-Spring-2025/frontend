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
import useToast from '../../../../../../hooks/useToast';
import PopconfirmComponent from '../../../../../../components/Popconfirm/PopconfirmComponent';
import ButtonComponent from '../../../../../../components/Button/ButtonComponent';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const [activeTab, setActiveTab] = useState<string>('all'); // Track active tab key
  const toast = useToast();
  const {
    data: itemData,
    isLoading: isLoadingItem,
    mutate: mutateItem,
  } = useFetcher<Item[] | any>('items', 'GET');
  const {
    isLoading: isLoadingWarehouse,
    trigger: triggerWarehouse,
    mutate: mutateWarehouseItem,
  } = useFetcher('items/warehouse');
  const {
    isLoading: isLoadingCategory,
    trigger: triggerCategory,
    mutate: mutateCategoryItem,
  } = useFetcher('items/category');
  const { isLoading: isLoadingDeleteItem, trigger: triggerDeleteItem } =
    useFetcher(`items/delete`, 'DELETE');
  const { t } = useTranslation();
  const column: Column[] = [
    {
      key: 'itemId',
      dataIndex: 'itemId',
      title: '#',
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: t('Name'),
      render: (name, data) => <TextLink to={`${data.itemId}`}>{name}</TextLink>,
    },
    {
      key: 'quantity',
      dataIndex: 'quantity',
      title: t('Quantity'),
    },
    {
      key: 'unit',
      dataIndex: 'unit',
      title: t('Unit'),
    },
    {
      key: 'categoryEntity',
      dataIndex: 'categoryEntity',
      title: t('Category'),
      render: (data) => data?.name,
    },
    {
      key: 'warehouseLocationEntity',
      dataIndex: 'warehouseLocationEntity',
      title: t('Warehouse Location'),
      render: (data) => data?.name,
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: t('Status'),
    },
    // {
    //   key: 'action',
    //   dataIndex: 'itemId',
    //   title: 'Action',
    //   render: (data) => (
    //     <PopconfirmComponent
    //       title={'Delete this item?'}
    //       onConfirm={() => handleDelete(data)}
    //     >
    //       <ButtonComponent danger type="primary">
    //         Delete
    //       </ButtonComponent>
    //     </PopconfirmComponent>
    //   ),
    // },
  ];

  const columnsItemByWarehouse: Column[] = [
    {
      title: 'ID',
      dataIndex: 'itemId',
      key: 'itemId',
      width: 100,
    },
    {
      title: t('Name'),
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
      title: t('Quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
    },
    {
      title: t('Unit'),
      dataIndex: 'unit',
      key: 'unit',
      width: 120,
    },
    {
      title: t('Category'),
      dataIndex: 'categoryEntity',
      key: 'categoryEntity',
      render: (category) => category?.name || '-',
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
    },
    {
      key: 'action',
      dataIndex: 'itemId',
      title: t('Action'),
      render: (data) =>
        data && (
          <PopconfirmComponent
            title={t('Delete this item?')}
            onConfirm={() => handleDelete(data)}
          >
            <ButtonComponent
              danger
              type="primary"
              loading={isLoadingDeleteItem}
            >
              Delete
            </ButtonComponent>
          </PopconfirmComponent>
        ),
    },
  ];

  const items: TabsItemProps['items'] = [
    {
      key: 'all',
      label: t('View All'),
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
      label: t('View By Warehouse'),
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
      label: t('View By Category'),
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

  const handleDelete = async (id: string) => {
    try {
      const response = await triggerDeleteItem({ url: `items/${id}` });
      toast.showSuccess(response?.message);
      if (activeTab === 'all') {
        mutateItem();
      }
      if (activeTab === 'view-by-category') {
        mutateCategoryItem();
      }
      if (activeTab === 'view-by-warehouse') {
        mutateWarehouseItem();
      }
    } catch (error: any) {
      toast.showError(error?.message);
    }
  };

  useEffect(() => {
    console.log(activeTab);
  }, [activeTab]);

  return (
    <AnimationAppear>
      <WhiteBackground>
        <TabsComponent
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          destroyInactiveTabPane
        />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ListItemManagement;
