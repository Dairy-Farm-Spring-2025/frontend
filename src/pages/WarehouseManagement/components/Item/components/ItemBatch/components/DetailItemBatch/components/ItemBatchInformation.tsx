import { Tag } from 'antd';
import CardComponent from '../../../../../../../../../components/Card/CardComponent';
import { ItemBatch } from '../../../../../../../../../model/Warehouse/itemBatch';

interface ItemBatchInformationProps {
  data: ItemBatch;
}

const TitleItemBatch = ({ children }: any) => {
  return <p className="text-base font-bold">{children}</p>;
};

const TextItemBatch = ({ children }: any) => {
  return <p className="">{children}</p>;
};

const TextInformation = ({ title, description }: any) => {
  return (
    <div className="flex flex-col gap-2">
      <TitleItemBatch>{title}: </TitleItemBatch>
      <TextItemBatch>{description}</TextItemBatch>
    </div>
  );
};

const ItemBatchInformation = ({ data }: ItemBatchInformationProps) => {
  return (
    <div className="flex gap-5">
      <CardComponent className="w-1/3 h-fit" title={'Item Batch Information'}>
        <div className="flex justify-between items-center">
          <TextInformation title="Quantity" description={data?.quantity} />
          <TextInformation title="Import Date" description={data?.importDate} />
          <TextInformation
            title="Expired Date"
            description={data?.expiryDate}
          />
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
            <TextInformation
              title="Name"
              description={data?.itemEntity?.name}
            />
            <TextInformation
              title="Quantity"
              description={`${data?.itemEntity?.quantity} (${data?.itemEntity?.unit})`}
            />
            <TextInformation
              title="Category"
              description={data?.itemEntity?.categoryEntity?.name}
            />
            <TextInformation
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
            <TextInformation
              title="Worker name"
              description={data?.supplierEntity?.name}
            />
            <TextInformation
              title="Phone"
              description={data?.supplierEntity?.phone}
            />
            <TextInformation
              title="Email"
              description={data?.supplierEntity?.email}
            />
          </div>
          <div className="mt-5">
            <TextInformation
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
