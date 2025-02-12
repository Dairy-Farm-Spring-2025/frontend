import { Tag } from 'antd';
import CardComponent from '../../../../../../../../../components/Card/CardComponent';

interface ExportInformationProps {
  data: any; // Replace 'any' with a proper type for export item data
}

const TitleExport = ({ children }: any) => {
  return <p className='text-base font-bold'>{children}</p>;
};

const TextExport = ({ children }: any) => {
  return <p className=''>{children}</p>;
};

const TextInformation = ({ title, description }: any) => {
  return (
    <div className='flex flex-col gap-2'>
      <TitleExport>{title}: </TitleExport>
      <TextExport>{description}</TextExport>
    </div>
  );
};

const ExportInformation = ({ data }: ExportInformationProps) => {
  return (
    <div className='flex gap-5'>
      {/* Left Side: Export Information */}
      <CardComponent className='w-1/3 h-fit' title={'Export Information'}>
        <div className='flex flex-col gap-4'>
          <TextInformation title='Export ID' description={data?.exportItemId} />
          <TextInformation title='Quantity' description={`${data?.quantity} liters`} />
          <TextInformation title='Export Date' description={data?.exportDate} />
          <TextInformation
            title='Status'
            description={<Tag className='px-5 py-1'>{data?.status}</Tag>}
          />
          <TextInformation title='Received' description={data?.received ? 'Yes' : 'No'} />
        </div>
      </CardComponent>

      {/* Right Side: Item, Picker, Exporter, and Supplier Information */}
      <div className='w-2/3 flex flex-col gap-5'>
        {/* Item Information */}
        <CardComponent title={'Item Details'}>
          <div className='flex justify-between items-center'>
            <TextInformation title='Name' description={data?.itemBatchEntity?.itemEntity?.name} />
            <TextInformation
              title='Category'
              description={data?.itemBatchEntity?.itemEntity?.categoryEntity?.name}
            />
            <TextInformation title='Unit' description={data?.itemBatchEntity?.itemEntity?.unit} />
            <TextInformation
              title='Status'
              description={
                <Tag className='px-5 py-1'>{data?.itemBatchEntity?.itemEntity?.status}</Tag>
              }
            />
          </div>
          <CardComponent
            title={`Warehouse: ${data?.itemBatchEntity?.itemEntity?.warehouseLocationEntity?.name}`}
            className='mt-5'
          >
            <p>{data?.itemBatchEntity?.itemEntity?.warehouseLocationEntity?.description}</p>
          </CardComponent>
        </CardComponent>

        {/* Picker Information */}
        <CardComponent title={'Picker Information'}>
          <div className='flex justify-between items-center w-3/3'>
            <TextInformation title='Employee Number' description={data?.picker?.employeeNumber} />
            <TextInformation title='Name' description={data?.picker?.name} />
            <TextInformation
              title='Phone'
              description={data?.picker?.phoneNumber ? data?.picker?.phoneNumber : 'N/A'}
            />
            <TextInformation
              title='Mail'
              description={data?.picker?.email ? data?.picker?.email : 'N/A'}
            />
            <TextInformation title='Role' description={data?.picker?.roleId?.name} />
            <TextInformation
              title='Status'
              description={<Tag className='px-5 py-1'>{data?.picker?.status}</Tag>}
            />
          </div>
        </CardComponent>

        {/* Exporter Information */}
        <CardComponent title={'Exporter Information'}>
          <div className='flex justify-between items-center w-3/3'>
            <TextInformation title='Employee Number' description={data?.exporter?.employeeNumber} />
            <TextInformation title='Name' description={data?.exporter?.name} />
            <TextInformation
              title='Phone'
              description={data?.exporter?.phoneNumber ? data?.exporter?.phoneNumber : 'N/A'}
            />
            <TextInformation
              title='Mail'
              description={data?.exporter?.email ? data?.exporter?.email : 'N/A'}
            />
            <TextInformation title='Role' description={data?.exporter?.roleId?.name} />
            <TextInformation
              title='Status'
              description={<Tag className='px-5 py-1'>{data?.exporter?.status}</Tag>}
            />
          </div>
        </CardComponent>

        {/* Supplier Information */}
        <CardComponent title={'Supplier Information'}>
          <div className='flex flex-col gap-4'>
            <TextInformation
              title='Name'
              description={data?.itemBatchEntity?.supplierEntity?.name}
            />
            <TextInformation
              title='Address'
              description={data?.itemBatchEntity?.supplierEntity?.address}
            />
            <TextInformation
              title='Phone'
              description={data?.itemBatchEntity?.supplierEntity?.phone}
            />
            <TextInformation
              title='Email'
              description={data?.itemBatchEntity?.supplierEntity?.email}
            />
          </div>
        </CardComponent>
      </div>
    </div>
  );
};

export default ExportInformation;
