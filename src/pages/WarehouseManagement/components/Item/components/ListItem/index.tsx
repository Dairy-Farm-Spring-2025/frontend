import TagComponents from '@components/UI/TagComponents';
import { RootState } from '@core/store/store';
import { ITEMS_PATH } from '@service/api/Storage/itemApi';
import { UNIT_FILTER } from '@service/data/item';
import { formatStatusWithCamel } from '@utils/format';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ButtonComponent from '../../../../../../components/Button/ButtonComponent';
import PopconfirmComponent from '../../../../../../components/Popconfirm/PopconfirmComponent';
import { Column } from '../../../../../../components/Table/TableComponent';
import AnimationAppear from '../../../../../../components/UI/AnimationAppear';
import TextLink from '../../../../../../components/UI/TextLink';
import WhiteBackground from '../../../../../../components/UI/WhiteBackground';
import useFetcher from '../../../../../../hooks/useFetcher';
import useToast from '../../../../../../hooks/useToast';
import { Item } from '../../../../../../model/Warehouse/items';
import ListAllItem from './components/ListAllItem';

const ListItemManagement = () => {
  const [optionsWarehouse, setOptionWarehouse] = useState<any[]>([]);
  const [optionCategory, setOptionCategory] = useState<any[]>([]);
  const itemManagementWarehouse = useSelector(
    (state: RootState) => state.itemManagement
  );
  const toast = useToast();
  const {
    data: itemData,
    isLoading: isLoadingItem,
    mutate: mutateItem,
  } = useFetcher<Item[] | any>(ITEMS_PATH.ITEMS, 'GET');
  const { isLoading: isLoadingDeleteItem, trigger: triggerDeleteItem } =
    useFetcher(`items/delete`, 'DELETE');
  const { t } = useTranslation();

  useEffect(() => {
    if (itemManagementWarehouse) {
      setOptionWarehouse(
        itemManagementWarehouse.warehouses.map((element: any) => ({
          text: element.label,
          value: element.label,
        }))
      );
      setOptionCategory(
        itemManagementWarehouse.categories.map((element: any) => ({
          text: element.label,
          value: element.label,
        }))
      );
    }
    console.log(itemManagementWarehouse.warehouses);
  }, [itemManagementWarehouse]);

  const columnsItemByWarehouse: Column[] = [
    {
      title: '#',
      dataIndex: 'itemId',
      key: 'itemId',
      width: 100,
      render: (_, __, index) => index + 1,
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
      searchable: true,
      width: 300,
    },
    {
      title: t('Quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      sorter: (a: any, b: any) => a.quantity - b.quantity,
    },
    {
      title: t('Unit'),
      dataIndex: 'unit',
      key: 'unit',
      width: 200,
      filterable: true,
      filterOptions: UNIT_FILTER,
    },
    {
      title: t('Category'),
      dataIndex: 'categoryEntity',
      key: 'categoryEntity',
      render: (category) => category?.name || '-',
      width: 200,
      filterable: true,
      filterOptions: optionCategory,
      objectKeyFilter: 'name',
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (data) => (
        <TagComponents color="cyan">
          {formatStatusWithCamel(data)}
        </TagComponents>
      ),
    },
    {
      key: 'warehouseLocationEntity',
      width: 200,
      dataIndex: 'warehouseLocationEntity',
      title: t('Storage Location'),
      render: (data) => data?.name,
      filterable: true,
      filterOptions: optionsWarehouse,
      objectKeyFilter: 'name',
    },
    {
      key: 'action',
      width: 250,
      dataIndex: 'itemId',
      title: t('Action'),
      render: (data) =>
        data && (
          <PopconfirmComponent
            title={undefined}
            onConfirm={() => handleDelete(data)}
          >
            <ButtonComponent
              danger
              type="primary"
              loading={isLoadingDeleteItem}
            >
              {t('Delete')}
            </ButtonComponent>
          </PopconfirmComponent>
        ),
    },
  ];

  const handleDelete = async (id: string) => {
    try {
      const response = await triggerDeleteItem({
        url: ITEMS_PATH.ITEMS_DELETE(id),
      });
      toast.showSuccess(response?.message);
      mutateItem();
    } catch (error: any) {
      toast.showError(error?.message);
    }
  };

  return (
    <AnimationAppear>
      <WhiteBackground>
        <ListAllItem
          column={columnsItemByWarehouse}
          isLoading={isLoadingItem}
          itemData={itemData}
          mutate={mutateItem}
        />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ListItemManagement;
