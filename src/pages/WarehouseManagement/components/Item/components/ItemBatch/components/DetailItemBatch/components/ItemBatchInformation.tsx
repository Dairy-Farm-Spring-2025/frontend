import { Tag } from 'antd';
import CardComponent from '../../../../../../../../../components/Card/CardComponent';
import { ItemBatch } from '../../../../../../../../../model/Warehouse/itemBatch';
import TextTitle from '../../../../../../../../../components/UI/TextTitle';

interface ItemBatchInformationProps {
  data: ItemBatch;
}

const ItemBatchInformation = ({ data }: ItemBatchInformationProps) => {
  return (
    <div className="flex gap-5">
      <CardComponent className="w-1/3 h-fit" title={'Item Batch Information'}>
        <div className="flex justify-between items-center">
          <TextTitle title="Quantity" description={data?.quantity} />
          <TextTitle title="Import Date" description={data?.importDate} />
          <TextTitle title="Expired Date" description={data?.expiryDate} />
        </div>
        <div className="mt-5">
          <Tag className="px-5 text-base w-full text-center py-1">
            {data?.status}
          </Tag>
        </div>
      </CardComponent>
      <div className="w-2/3 flex flex-col gap-5">
        <CardComponent title={'Item'}>
          <div className="flex justify-between items-center">
            <TextTitle title="Name" description={data?.itemEntity?.name} />
            <TextTitle
              title="Quantity"
              description={`${data?.itemEntity?.quantity} (${data?.itemEntity?.unit})`}
            />
            <TextTitle
              title="Category"
              description={data?.itemEntity?.categoryEntity?.name}
            />
            <TextTitle
              title="Status"
              description={
                <Tag className="px-5 py-1">{data?.itemEntity?.status}</Tag>
              }
            />
          </div>
          <CardComponent
            title={`Warehouse: ${data?.itemEntity?.warehouseLocationEntity?.name}`}
            className="mt-5"
          >
            <p>{data?.itemEntity?.warehouseLocationEntity?.description}</p>
          </CardComponent>
        </CardComponent>
        <CardComponent title={'Supplier'}>
          <div className="flex justify-between items-center w-2/3">
            <TextTitle
              title="Worker name"
              description={data?.supplierEntity?.name}
            />
            <TextTitle
              title="Phone"
              description={data?.supplierEntity?.phone}
            />
            <TextTitle
              title="Email"
              description={data?.supplierEntity?.email}
            />
          </div>
          <div className="mt-5">
            <TextTitle
              title="Address"
              description={data?.supplierEntity?.address}
            />
          </div>
        </CardComponent>
      </div>
    </div>
  );
};

export default ItemBatchInformation;
