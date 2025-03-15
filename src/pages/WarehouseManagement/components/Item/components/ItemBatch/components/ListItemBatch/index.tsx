import { formatDate } from '@fullcalendar/core/index.js';
import { Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import ButtonComponent from '../../../../../../../../components/Button/ButtonComponent';
import PopconfirmComponent from '../../../../../../../../components/Popconfirm/PopconfirmComponent';
import TableComponent, {
  Column,
} from '../../../../../../../../components/Table/TableComponent';
import AnimationAppear from '../../../../../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../../../../../components/UI/WhiteBackground';
import useFetcher from '../../../../../../../../hooks/useFetcher';
import useModal from '../../../../../../../../hooks/useModal';
import useToast from '../../../../../../../../hooks/useToast';
import { ItemBatch } from '../../../../../../../../model/Warehouse/itemBatch';
import { Item } from '../../../../../../../../model/Warehouse/items';
import CreateItemBatchModal from './components/CreateItemBatchModal';
import SelectComponent from '../../../../../../../../components/Select/SelectComponent';
import { ITEM_BATCH_OPTIONS } from '../../../../../../../../service/data/item';
import { useTranslation } from 'react-i18next';
import { SupplierType } from '../../../../../../../../model/Warehouse/supplier';

const ListItemBatch = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { data, isLoading, mutate } = useFetcher<ItemBatch[]>(
    'itembatchs',
    'GET'
  );
  const { isLoading: deleteLoading, trigger } = useFetcher(
    `itembatchs/delete`,
    'DELETE'
  );
  const { isLoading: updateLoading, trigger: triggerUpdate } = useFetcher(
    'itembatchs/update',
    'PUT'
  );
  const modal = useModal();

  const handleDeleteItemBatch = async (id: number) => {
    try {
      const response = await trigger({ url: `itembatchs/${id}` });
      toast.showSuccess(response.message);
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };
  const { t } = useTranslation();
  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const response = await triggerUpdate({
        url: `itembatchs/update/${id}/${status}`,
      });
      toast.showSuccess(response.message);
      console.log(response);
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const column: Column[] = [
    {
      dataIndex: 'quantity',
      key: 'quantity',
      title: t('Quantity'),
    },
    {
      dataIndex: 'importDate',
      key: 'importDate',
      title: t('Import Date'),
      render: (data) => formatDate(data),
    },
    {
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      title: t('Expired Date'),
      render: (data) => (data ? formatDate(data) : 'Not Yet'),
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: t('Status'),
      render: (data, record: ItemBatch) => (
        <SelectComponent
          className="w-full"
          options={ITEM_BATCH_OPTIONS}
          defaultValue={data}
          onChange={() => handleUpdateStatus(record?.itemBatchId, data)}
          loading={updateLoading}
        />
      ),
    },
    {
      dataIndex: 'itemEntity',
      key: 'itemEntity',
      title: t('Item'),
      render: (data: Item) => data?.name,
    },
    {
      dataIndex: 'supplierEntity',
      key: 'supplierEntity',
      title: t('Supplier'),
      render: (data: SupplierType) => data?.name,
    },
    {
      dataIndex: 'itemBatchId',
      key: 'action',
      title: t('Action'),
      render: (data) => (
        <div className="flex gap-4">
          <ButtonComponent type="primary" onClick={() => navigate(`${data}`)}>
            {t('View Detail')}
          </ButtonComponent>
          <PopconfirmComponent
            title="Are you sure to delete this item"
            onConfirm={() => handleDeleteItemBatch(data)}
          >
            <ButtonComponent type="primary" danger loading={deleteLoading}>
              {t('Delete')}
            </ButtonComponent>
          </PopconfirmComponent>
        </div>
      ),
    },
  ];
  return (
    <AnimationAppear>
      <WhiteBackground>
        <ButtonComponent type="primary" onClick={modal.openModal}>
          {t('Create Item Batch')}
        </ButtonComponent>
        <Divider className="!my-4" />
        <TableComponent
          columns={column}
          dataSource={data as ItemBatch[]}
          loading={isLoading}
        />
        <CreateItemBatchModal modal={modal} mutate={mutate} />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ListItemBatch;
