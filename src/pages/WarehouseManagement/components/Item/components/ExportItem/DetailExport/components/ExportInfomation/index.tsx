import TagComponents from '@components/UI/TagComponents';
import { formatDateHour, formatStatusWithCamel } from '@utils/format';
import { useTranslation } from 'react-i18next';
import CardComponent from '../../../../../../../../../components/Card/CardComponent';

interface ExportInformationProps {
  data: any; // Replace 'any' with a proper type for export item data
}

const TitleExport = ({ children }: any) => {
  return <p className="text-base font-bold">{children}</p>;
};

const TextExport = ({ children }: any) => {
  return <p className="">{children}</p>;
};

const TextInformation = ({ title, description }: any) => {
  return (
    <div className="flex flex-col gap-2">
      <TitleExport>{title}: </TitleExport>
      <TextExport>{description}</TextExport>
    </div>
  );
};

const ExportInformation = ({ data }: ExportInformationProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-5">
      {/* Left Side: Export Information */}
      <CardComponent className="w-1/3 h-fit" title={t('Export Information')}>
        <div className="flex flex-col gap-4">
          <TextInformation
            title={t('Quantity')}
            description={`${data?.quantity}`}
          />
          <TextInformation
            title={t('Export Date')}
            description={formatDateHour(data?.exportDate)}
          />
          <TextInformation
            title={t('Status')}
            description={
              <TagComponents className="px-5 py-1 !text-base">
                {t(formatStatusWithCamel(data?.status))}
              </TagComponents>
            }
          />
          <TextInformation
            title={t('Received')}
            description={data?.received ? t('Yes') : t('No')}
          />
        </div>
      </CardComponent>

      {/* Right Side: Item, Picker, Exporter, and Supplier Information */}
      <div className="w-2/3 flex flex-col gap-5">
        {/* Item Information */}
        <CardComponent title={t('Item Details')}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <TextInformation
              title={t('Name')}
              description={data?.itemBatchEntity?.itemEntity?.name}
            />
            <TextInformation
              title={t('Category')}
              description={
                data?.itemBatchEntity?.itemEntity?.categoryEntity?.name
              }
            />
            <TextInformation
              title={t('Unit')}
              description={data?.itemBatchEntity?.itemEntity?.unit}
            />
            <TextInformation
              title={t('Status')}
              description={
                <TagComponents className="px-5 py-1">
                  {t(
                    formatStatusWithCamel(
                      data?.itemBatchEntity?.itemEntity?.status
                    )
                  )}
                </TagComponents>
              }
            />
          </div>
          <CardComponent
            title={`${t('Warehouse')}: ${
              data?.itemBatchEntity?.itemEntity?.warehouseLocationEntity?.name
            }`}
            className="mt-5"
          >
            <p>
              {
                data?.itemBatchEntity?.itemEntity?.warehouseLocationEntity
                  ?.description
              }
            </p>
          </CardComponent>
        </CardComponent>

        {/* Picker Information */}
        <CardComponent title={t('Picker Information')}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <TextInformation
              title={t('Employee Number')}
              description={data?.picker ? data?.picker?.employeeNumber : 'N/A'}
            />
            <TextInformation
              title={t('Name')}
              description={data?.picker ? data?.picker?.name : 'N/A'}
            />
            <TextInformation
              title={t('Phone')}
              description={
                data?.picker?.phoneNumber ? data?.picker?.phoneNumber : 'N/A'
              }
            />
            <TextInformation
              title={t('Mail')}
              description={data?.picker?.email ? data?.picker?.email : 'N/A'}
            />
            <TextInformation
              title={t('Role')}
              description={
                data?.picker
                  ? t(formatStatusWithCamel(data?.picker?.roleId?.name))
                  : 'N/A'
              }
            />
          </div>
        </CardComponent>

        {/* Exporter Information */}
        <CardComponent title={t('Task')}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5  gap-4">
            <TextInformation
              title={t('Task type')}
              description={
                data?.task?.taskTypeId ? data?.task?.taskTypeId?.name : 'N/A'
              }
            />
            <TextInformation
              title={t('Area')}
              description={
                data?.task?.areaId ? data?.task?.areaId?.name : 'N/A'
              }
            />
            <TextInformation
              title={t('Assignee')}
              description={
                data?.task?.assignee ? data?.task?.assignee?.name : 'N/A'
              }
            />
            <TextInformation
              title={t('From date')}
              description={
                data?.task?.fromDate
                  ? formatDateHour(data?.task?.fromDate)
                  : 'N/A'
              }
            />
            <TextInformation
              title={t('To date')}
              description={
                data?.task?.toDate ? formatDateHour(data?.task?.toDate) : 'N/A'
              }
            />
          </div>
        </CardComponent>

        {/* Supplier Information */}
        <CardComponent title={t('Supplier Information')}>
          <div className="flex flex-col gap-4">
            <TextInformation
              title={t('Name')}
              description={data?.itemBatchEntity?.supplierEntity?.name}
            />
            <TextInformation
              title={t('Address')}
              description={data?.itemBatchEntity?.supplierEntity?.address}
            />
            <TextInformation
              title={t('Phone')}
              description={data?.itemBatchEntity?.supplierEntity?.phone}
            />
            <TextInformation
              title={t('Email')}
              description={data?.itemBatchEntity?.supplierEntity?.email}
            />
          </div>
        </CardComponent>
      </div>
    </div>
  );
};

export default ExportInformation;
