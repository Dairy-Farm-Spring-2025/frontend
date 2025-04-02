import { Descriptions, Space } from 'antd';
import Title from '@components/UI/Title';
import { UserOutlined, MedicineBoxOutlined, FileTextOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { healthSeverity } from '@service/data/health';
import { formatAreaType, formatDateHour } from '@utils/format';


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
            <Title className="!text-2xl mb-6 text-blue-600">{t('Review Information')}</Title>

            <div className="mb-8">
                <Space align="center" className="mb-4">
                    <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                    <Title className="!text-xl text-gray-700">{t('Cow Information')}</Title>
                </Space>
                <Descriptions
                    bordered
                    column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                    labelStyle={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}
                    contentStyle={{ backgroundColor: '#fff' }}
                >
                    <Descriptions.Item label={t('Cow')}>
                        {cowOptions.find((cow: any) => cow.value === apiBody?.cowId)?.label || t('No data')}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('Cow Status')}>
                        {formatAreaType(selectedCow?.cowStatus) || t('No data')}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('Date Of Birth')}>
                        {selectedCow?.dateOfBirth ? formatDateHour(selectedCow.dateOfBirth) : t('No data')}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('Cow Origin')}>
                        {formatAreaType(selectedCow?.cowOrigin) || t('No data')}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('Gender')}>
                        {formatAreaType(selectedCow?.gender) || t('No data')}
                    </Descriptions.Item>
                </Descriptions>
            </div>

            <div className="mb-8">
                <Space align="center" className="mb-4">
                    <MedicineBoxOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                    <Title className="!text-xl text-gray-700">{t('Illness Information')}</Title>
                </Space>
                <Descriptions
                    bordered
                    column={1}
                    labelStyle={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}
                    contentStyle={{ backgroundColor: '#fff' }}
                >
                    <Descriptions.Item label={t('Symptoms')}>
                        <div
                            className="max-h-40 overflow-y-auto"
                            dangerouslySetInnerHTML={{ __html: apiBody?.symptoms || t('No data') }}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label={t('Prognosis')}>
                        <div
                            className="max-h-40 overflow-y-auto"
                            dangerouslySetInnerHTML={{ __html: apiBody?.prognosis || t('No data') }}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label={t('Severity')}>
                        {healthSeverity().find((option: any) => option.value === apiBody?.severity)?.label || t('No data')}
                    </Descriptions.Item>
                </Descriptions>
            </div>

            {treatmentDetails.length > 0 && (
                <div>
                    <Space align="center" className="mb-4">
                        <FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                        <Title className="!text-xl text-gray-700">{t('Illness Details')}</Title>
                    </Space>
                    {treatmentDetails.map((detail: any, index: number) => (
                        <div key={index} className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
                            <Title className="!text-lg text-gray-600 mb-3">
                                {`${t('Treatment')} ${index + 1}`}
                            </Title>
                            <Descriptions
                                bordered
                                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                                labelStyle={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}
                                contentStyle={{ backgroundColor: '#fff' }}
                            >
                                <Descriptions.Item label={t('Item')}>
                                    {itemOptions.find((item: any) => item.value === detail.itemId)?.label || t('No data')}
                                </Descriptions.Item>
                                <Descriptions.Item label={t('Dosage (ml)')}>
                                    {detail.dosage || t('No data')}
                                </Descriptions.Item>
                                <Descriptions.Item label={t('Injection Site')}>
                                    {injectionSiteOptions.find((site: any) => site.value === detail.injectionSite)?.label || t('No data')}
                                </Descriptions.Item>
                                <Descriptions.Item label={t('Treatment Date')}>
                                    {detail.treatmentDate ? formatDateHour(detail.treatmentDate) : t('No data')}
                                </Descriptions.Item>
                                <Descriptions.Item label={t('Treatment Plan')} span={2}>
                                    <div
                                        className="max-h-40 overflow-y-auto"
                                        dangerouslySetInnerHTML={{ __html: detail.treatmentPlan || t('No data') }}
                                    />
                                </Descriptions.Item>
                            </Descriptions>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewInformation;