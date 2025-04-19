import TagComponents from '@components/UI/TagComponents';
import { formatStatusWithCamel } from '@utils/format';
import { useTranslation } from 'react-i18next';
import CardComponent from '../../../../../../../../../components/Card/CardComponent';
import TextTitle from '../../../../../../../../../components/UI/TextTitle';
import { ItemBatch } from '../../../../../../../../../model/Warehouse/itemBatch';

interface ItemBatchInformationProps {
  data: ItemBatch;
}

const ItemBatchInformation = ({ data }: ItemBatchInformationProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-5">
      <CardComponent
        className="w-full md:w-full lg:!w-1/3 2xl:!w-1/3 h-fit"
        title={t('Item Batch Information')}
      >
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-5">
          <TextTitle title={t('Quantity')} description={data?.quantity} />
          <TextTitle title={t('Import Date')} description={data?.importDate} />
          <TextTitle title={t('Expired Date')} description={data?.expiryDate} />
        </div>
        <div className="mt-5">
          <TagComponents className="px-5 text-base w-full text-center py-1">
            {t(formatStatusWithCamel(data?.status))}
          </TagComponents>
        </div>
      </CardComponent>
      <div className="w-2/3 flex flex-col gap-5">
        <CardComponent title={t('Item')}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            <TextTitle title={t('Name')} description={data?.itemEntity?.name} />
            <TextTitle
              title={t('Category')}
              description={data?.itemEntity?.categoryEntity?.name}
            />
            <TextTitle
              title={t('Status')}
              description={
                <TagComponents className="px-5 py-1">
                  {t(formatStatusWithCamel(data?.itemEntity?.status))}
                </TagComponents>
              }
            />
          </div>
          <CardComponent
            title={`${t('Warehouse')}: ${
              data?.itemEntity?.warehouseLocationEntity?.name
            }`}
            className="mt-5"
          >
            <p>{data?.itemEntity?.warehouseLocationEntity?.description}</p>
          </CardComponent>
        </CardComponent>
        <CardComponent title={t('Supplier')}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            <TextTitle
              title={t('Worker name')}
              description={data?.supplierEntity?.name}
            />
            <TextTitle
              title={t('Phone')}
              description={data?.supplierEntity?.phone}
            />
            <TextTitle
              title={t('Email')}
              description={data?.supplierEntity?.email}
            />
          </div>
          <div className="mt-5">
            <TextTitle
              title={t('Address')}
              description={data?.supplierEntity?.address}
            />
          </div>
        </CardComponent>
      </div>
    </div>
  );
};

export default ItemBatchInformation;
