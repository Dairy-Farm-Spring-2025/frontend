import TableComponent, { Column } from '@components/Table/TableComponent';
import TagComponents from '@components/UI/TagComponents';
import TextTitle from '@components/UI/TextTitle';
import Title from '@components/UI/Title';
import useFetcher from '@hooks/useFetcher';
import { ItemBatch, ItemBatchStatus } from '@model/Warehouse/itemBatch';
import { SupplierType } from '@model/Warehouse/supplier';
import { ITEMS_PATH } from '@service/api/Storage/itemApi';
import {
  formatDateHour,
  formatFollowTime,
  formatStatusWithCamel,
} from '@utils/format';
import statusColorMapItemBatch from '@utils/statusRender/itemBatchRender';
import { getItemStatusColor } from '@utils/statusRender/itemStatusRender';
import { Divider, Popover, Tag } from 'antd';
import { t } from 'i18next';
import CardComponent from '../../../../../../../components/Card/CardComponent';
import { Item } from '../../../../../../../model/Warehouse/items';
import { ITEM_BATCH_FILTER } from '@service/data/item';

interface ItemInformationProps {
  data: Item;
}
const ItemInformation = ({ data }: ItemInformationProps) => {
  const { data: dataItemBatch, isLoading } = useFetcher<ItemBatch[]>(
    ITEMS_PATH.VIEW_ITEM_BATCHES(data ? data?.itemId : 0),
    'GET'
  );
  const columns: Column[] = [
    {
      dataIndex: 'importDate',
      key: 'importDate',
      title: t('Import Date'),
      render: (data) => formatDateHour(data),
      filteredDate: true,
      sorter: (a, b) => a?.importDate - b?.importDate,
    },
    {
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      title: t('Expiry Date'),
      render: (data) => formatDateHour(data),
      filteredDate: true,
      sorter: (a, b) => a?.expiryDate - b?.expiryDate,
    },
    {
      dataIndex: 'quantity',
      key: 'quantity',
      title: t('Quantity'),
      render: (quantity) => (
        <p>
          {quantity} ({data?.unit})
        </p>
      ),
      sorter: (a, b) => a?.unit - b?.unit,
    },
    {
      dataIndex: 'supplierEntity',
      key: 'supplierEntity',
      title: t('Supplier'),
      render: (data: SupplierType) => (
        <Popover
          title={t('Supplier Information')}
          content={
            <div className="flex flex-col gap-3">
              <TextTitle
                layout="horizontal"
                title={t('Email')}
                description={data?.email}
              />
              <TextTitle
                layout="horizontal"
                title={t('Phone')}
                description={data?.phone}
              />
              <TextTitle
                layout="horizontal"
                title={t('Address')}
                description={data?.address}
              />
            </div>
          }
        >
          {data?.name}
        </Popover>
      ),
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: t('Status'),
      render: (data) => (
        <TagComponents color={statusColorMapItemBatch(data as ItemBatchStatus)}>
          {t(formatStatusWithCamel(data))}
        </TagComponents>
      ),
      filterable: true,
      filterOptions: ITEM_BATCH_FILTER(),
    },
  ];
  return (
    <div className="w-full flex flex-col gap-5">
      <p className="text-2xl">
        <strong>{data?.name}</strong>
      </p>
      <p className="text-lg">
        <strong>{t('Status')}: </strong>{' '}
        <Tag
          color={getItemStatusColor(data?.status)}
          className="!text-base !px-5"
        >
          {t(formatStatusWithCamel(data?.status))}
        </Tag>
      </p>
      <div className="grid grid-cols-3 gap-5">
        <CardComponent title={t('Category')}>
          {data?.categoryEntity?.name}
        </CardComponent>
        <CardComponent
          className="col-span-2"
          title={data?.warehouseLocationEntity?.name}
        >
          {data?.warehouseLocationEntity?.description}
        </CardComponent>
      </div>
      <Divider className="my-3" />
      <Title>{t('Item batches of item {{item}}', { item: data?.name })}</Title>
      <TableComponent
        columns={columns}
        dataSource={formatFollowTime(
          dataItemBatch ? dataItemBatch : [],
          'importDate'
        )}
        loading={isLoading}
      />
    </div>
  );
};

export default ItemInformation;
