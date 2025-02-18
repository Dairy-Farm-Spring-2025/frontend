import { Tag } from 'antd';
import CardComponent from '../../../../../../../../../components/Card/CardComponent';
import { ItemBatch } from '../../../../../../../../../model/Warehouse/itemBatch';
import TextTitle from '../../../../../../../../../components/UI/TextTitle';
import { useTranslation } from 'react-i18next';

interface ItemBatchInformationProps {
  data: ItemBatch;
}

const ItemBatchInformation = ({ data }: ItemBatchInformationProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-5">
      <CardComponent className="w-1/3 h-fit" title={t('Item Batch Information')}>
        <div className="flex justify-between items-center">
          <TextTitle title={t("Quantity")} description={data?.quantity} />
          <TextTitle title={t("Import Date")} description={data?.importDate} />
          <TextTitle title={t("Expired Date")} description={data?.expiryDate} />
        </div>
        <div className="mt-5">
          <Tag className="px-5 text-base w-full text-center py-1">
            {data?.status}
          </Tag>
        </div>
      </CardComponent>
      <div className="w-2/3 flex flex-col gap-5">
        <CardComponent title={t('Item')}>
          <div className="flex justify-between items-center">
            <TextTitle title={t("Name")} description={data?.itemEntity?.name} />
            <TextTitle
              title={t("Quantity")}
              description={`${data?.itemEntity?.quantity} (${data?.itemEntity?.unit})`}
            />
            <TextTitle
              title={t("Category")}
              description={data?.itemEntity?.categoryEntity?.name}
            />
            <TextTitle
              title={t("Status")}
              description={
                <Tag className="px-5 py-1">{data?.itemEntity?.status}</Tag>
              }
            />
          </div>
          <CardComponent
            title={`${t("Warehouse")}: ${data?.itemEntity?.warehouseLocationEntity?.name}`}
            className="mt-5"
          >
            <p>{data?.itemEntity?.warehouseLocationEntity?.description}</p>
          </CardComponent>
        </CardComponent>
        <CardComponent title={t('Supplier')}>
          <div className="flex justify-between items-center w-2/3">
            <TextTitle
              title={t("Worker name")}
              description={data?.supplierEntity?.name}
            />
            <TextTitle
              title={t("Phone")}
              description={data?.supplierEntity?.phone}
            />
            <TextTitle
              title={t("Email")}
              description={data?.supplierEntity?.email}
            />
          </div>
          <div className="mt-5">
            <TextTitle
              title={t("Address")}
              description={data?.supplierEntity?.address}
            />
          </div>
        </CardComponent>
      </div>
    </div>
  );
};

export default ItemBatchInformation;
