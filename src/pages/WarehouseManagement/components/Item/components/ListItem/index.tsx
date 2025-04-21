import TagComponents from '@components/UI/TagComponents';
import { RootState } from '@core/store/store';
import { ITEMS_PATH } from '@service/api/Storage/itemApi';
import { STATUS_ITEM_FILTER, UNIT_FILTER } from '@service/data/item';
import { formatStatusWithCamel } from '@utils/format';
import { getItemStatusColor } from '@utils/statusRender/itemStatusRender';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ButtonComponent from '../../../../../../components/Button/ButtonComponent';
import PopconfirmComponent from '../../../../../../components/Popconfirm/PopconfirmComponent';
import { Column } from '../../../../../../components/Table/TableComponent';
import AnimationAppear from '../../../../../../components/UI/AnimationAppear';
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

  const navigate = useNavigate();
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
  }, [itemManagementWarehouse]);

  const columnsItemByWarehouse: Column[] = [
    {
      title: t('Name'),
      dataIndex: 'name',
      key: 'name',
      render: (name, data) =>
        data.children ? <strong>{name}</strong> : <p>{name}</p>,
      searchable: true,
      width: 300,
    },
    {
      title: t('Unit'),
      dataIndex: 'unit',
      key: 'unit',
      width: 200,
      filterable: true,
      filterOptions: UNIT_FILTER(),
      render: (data) => t(data),
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
        <TagComponents color={getItemStatusColor(data)}>
          {t(formatStatusWithCamel(data))}
        </TagComponents>
      ),
      filterable: true,
      filterOptions: STATUS_ITEM_FILTER(),
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
          <div className="flex gap-2">
            <ButtonComponent
              type="primary"
              onClick={() => navigate(`../${data.itemId}`)}
            >
              {t('View detail')}
            </ButtonComponent>
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
          </div>
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
