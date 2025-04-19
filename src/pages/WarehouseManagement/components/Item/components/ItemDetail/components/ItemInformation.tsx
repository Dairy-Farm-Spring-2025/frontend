import { Tag } from 'antd';
import { Item } from '../../../../../../../model/Warehouse/items';
import CardComponent from '../../../../../../../components/Card/CardComponent';
import { formatStatusWithCamel } from '@utils/format';
import { t } from 'i18next';
import { getItemStatusColor } from '@utils/statusRender/itemStatusRender';

interface ItemInformationProps {
  data: Item;
}
const ItemInformation = ({ data }: ItemInformationProps) => {
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
      <p className="text-lg">
        <strong>{t('Unit')}: </strong>{' '}
        <Tag className="!text-base !px-5">
          {t(formatStatusWithCamel(data?.unit))}
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
    </div>
  );
};

export default ItemInformation;
