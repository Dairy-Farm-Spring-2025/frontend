import {
  FileTextOutlined,
  MedicineBoxOutlined,
  UserOutlined,
} from '@ant-design/icons';
import DescriptionComponent from '@components/Description/DescriptionComponent';
import Title from '@components/UI/Title';
import { healthSeverity } from '@service/data/health';
import { formatAreaType, formatDateHour } from '@utils/format';
import { Space } from 'antd';
import { useTranslation } from 'react-i18next';

interface ReviewInformationProps {
  apiBody: any;
  cowOptions: any[];
  selectedCow: any;
  treatmentDetails: any[];
  itemOptions: any[];
  injectionSiteOptions: any[];
}

const ReviewInformation = ({
  apiBody,
  cowOptions,
  selectedCow,
  treatmentDetails,
  itemOptions,
  injectionSiteOptions,
}: ReviewInformationProps) => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <Title className="!text-2xl mb-6 text-blue-600">
        {t('Review Information')}
      </Title>

      <div className="mb-8">
        <Space align="center" className="mb-4">
          <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          <Title className="!text-xl text-gray-700">
            {t('Cow Information')}
          </Title>
        </Space>
        <DescriptionComponent
          bordered
          column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
          layout="horizontal"
          items={[
            {
              label: t('Cow'),
              children:
                cowOptions.find((cow: any) => cow.value === apiBody?.cowId)
                  ?.label || t('No data'),
            },
            {
              label: t('Cow Status'),
              children:
                t(formatAreaType(selectedCow?.cowStatus)) || t('No data'),
            },
            {
              label: t('Date Of Birth'),
              children: selectedCow?.dateOfBirth
                ? formatDateHour(selectedCow.dateOfBirth)
                : t('No data'),
            },
            {
              label: t('Cow Origin'),
              children:
                t(formatAreaType(selectedCow?.cowOrigin)) || t('No data'),
            },
            {
              label: t('Gender'),
              children: t(formatAreaType(selectedCow?.gender)) || t('No data'),
            },
          ]}
        />
      </div>

      <div className="mb-8">
        <Space align="center" className="mb-4">
          <MedicineBoxOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          <Title className="!text-xl text-gray-700">
            {t('Illness Information')}
          </Title>
        </Space>
        <DescriptionComponent
          bordered
          column={1}
          layout="vertical"
          items={[
            {
              label: t('Symptoms'),
              children: (
                <div
                  className="max-h-40 overflow-y-auto"
                  dangerouslySetInnerHTML={{
                    __html: apiBody?.symptoms || t('No data'),
                  }}
                />
              ),
            },
            {
              label: t('Prognosis'),
              children: (
                <div
                  className="max-h-40 overflow-y-auto"
                  dangerouslySetInnerHTML={{
                    __html: apiBody?.prognosis || t('No data'),
                  }}
                />
              ),
            },
            {
              label: t('Severity'),
              children:
                healthSeverity().find(
                  (option: any) => option.value === apiBody?.severity
                )?.label || t('No data'),
            },
          ]}
        />
      </div>

      {treatmentDetails.length > 0 && (
        <div>
          <Space align="center" className="mb-4">
            <FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <Title className="!text-xl text-gray-700">
              {t('Illness Details')}
            </Title>
          </Space>
          {treatmentDetails.map((detail: any, index: number) => (
            <div
              key={index}
              className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50"
            >
              <Title className="!text-lg text-gray-600 mb-3">
                {`${t('Treatment')} ${index + 1}`}
              </Title>
              <DescriptionComponent
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                layout="horizontal"
                items={[
                  {
                    label: t('Item'),
                    children:
                      itemOptions.find(
                        (item: any) => item.value === detail.itemId
                      )?.label || t('No data'),
                  },
                  {
                    label: t('Dosage (ml)'),
                    children: detail.dosage || t('No data'),
                  },
                  {
                    label: t('Treatment Date'),
                    children: detail.treatmentDate
                      ? formatDateHour(detail.treatmentDate)
                      : t('No data'),
                  },
                  {
                    label: t('Injection Site'),
                    children:
                      injectionSiteOptions.find(
                        (site: any) => site.value === detail.injectionSite
                      )?.label || t('No data'),
                  },
                  {
                    label: t('Treatment Plan'),
                    children: (
                      <div
                        className="max-h-40 overflow-y-auto"
                        dangerouslySetInnerHTML={{
                          __html: detail.treatmentPlan || t('No data'),
                        }}
                      />
                    ),
                  },
                ]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewInformation;
