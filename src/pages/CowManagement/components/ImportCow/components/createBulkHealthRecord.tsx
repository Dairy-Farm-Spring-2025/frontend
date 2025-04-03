import { Form, message } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SelectComponent from '@components/Select/SelectComponent';
import InputComponent from '@components/Input/InputComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import { HEALTH_RECORD_STATUS } from '@service/data/healthRecordStatus';
import { cowStatus } from '@service/data/cowStatus';
import ModalComponent from '@components/Modal/ModalComponent';

import useFetcher from '@hooks/useFetcher';
import { HEALTH_RECORD_PATH } from '@service/api/HealthRecord/healthRecordApi';

interface CreateBulkHealthRecordProps {
    visible: boolean;
    onCancel: () => void;
    importedCowIds: number[];
    onSuccess: () => void; // To handle post-success actions (e.g., hiding the "Create Health Records" button)
}

const CreateBulkHealthRecord = ({ visible, onCancel, importedCowIds, onSuccess }: CreateBulkHealthRecordProps) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { trigger, isLoading, error } = useFetcher(
        HEALTH_RECORD_PATH.CREATE_BULK,
        'POST',
        'application/json'
    );
    console.log('CreateBulkHealthRecord component rendered, trigger:', trigger); // Debug log


    const handleCreateHealthRecords = async (values: any) => {
        if (importedCowIds.length === 0) {
            message.error(t('No cow data to create health record'));
            return;
        }

        setLoading(true);
        try {
            // Chuẩn bị dữ liệu gửi lên API
            const healthRecords = importedCowIds.map((cowId) => ({
                status: values.status,
                size: Number(values.size),
                period: values.period,
                cowId: cowId,
            }));

            // Gửi request POST lên API
            await trigger({ body: healthRecords });

            message.success(t('Health records created successfully'));
            onSuccess(); // Gọi callback sau khi thành công
            form.resetFields(); // Reset form
            onCancel(); // Đóng modal
        } catch (error) {
            console.error('Error creating health records:', error);
            message.error(t('Error creating health records'));
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission when the "Confirm" button in ModalComponent is clicked
    const handleOk = () => {
        form.submit(); // Trigger form submission
    };

    return (
        <ModalComponent
            title={t('Create Bulk Health Records')}
            open={visible}
            onCancel={onCancel}
            onOk={handleOk} // Use onOk to trigger form submission
            disabledButtonOk={loading} // Disable the "Confirm" button while loading
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleCreateHealthRecords} // This will be triggered when form.submit() is called
                initialValues={{
                    status: 'good',
                    size: 0,
                    period: 'milkingCow',
                }}
            >
                <FormItemComponent
                    label={t('Status')}
                    name="status"
                    rules={[{ required: true, message: t('Please select a status') }]}
                >
                    <SelectComponent options={HEALTH_RECORD_STATUS()} />
                </FormItemComponent>

                <FormItemComponent
                    label={t('Size')}
                    name="size"
                    rules={[{ required: true, message: t('Please enter a size') }]}
                >
                    <InputComponent type="number" min={0} />
                </FormItemComponent>

                <FormItemComponent
                    label={t('Period')}
                    name="period"
                    rules={[{ required: true, message: t('Please select a period') }]}
                >
                    <SelectComponent options={cowStatus()} />
                </FormItemComponent>
            </Form>
        </ModalComponent>
    );
};

export default CreateBulkHealthRecord;