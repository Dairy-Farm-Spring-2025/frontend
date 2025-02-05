import { Tag } from 'antd';
import { Item } from '../../../../../../../model/Warehouse/items';
import CardComponent from '../../../../../../../components/Card/CardComponent';

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
        <strong>Quantity: </strong>{' '}
        <Tag className="!text-base !px-5">
          {data?.quantity} ({data?.unit})
        </Tag>
      </p>
      <p className="text-lg">
        <strong>Status: </strong>{' '}
        <Tag className="!text-base !px-5">{data?.status}</Tag>
      </p>
      <div className="grid grid-cols-3 gap-5">
        <CardComponent title={'Category'}>
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
