import ModalComponent from '@components/Modal/ModalComponent';
import api from '@config/axios/axios';
import { FeedMealDetails } from '@model/Feed/Feed';
import { Form, InputNumber, message } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface EditDetailProps {
  visible: boolean;
  detail: FeedMealDetails | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditDetail = ({
  visible,
  detail,
  onCancel,
  onSuccess,
}: EditDetailProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  // Populate the form with the current detail data when the modal opens
  useEffect(() => {
    if (detail) {
      form.setFieldsValue({
        quantity: detail.quantity ?? 0, // Default to 0 if quantity is undefined or null
      });
    }
  }, [detail, form]);

  // Handle form submission
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (!detail?.feedMealDetailId) {
        message.error(t('Invalid feed meal detail ID'));
        return;
      }

      // Ensure quantity is a number and not null/undefined
      const quantity = Number(values.quantity);
      if (isNaN(quantity) || quantity < 0) {
        message.error(t('Quantity must be a valid non-negative number'));
        return;
      }

      // Call the API to update the feed meal detail with quantity as a query parameter
      const response = await api.put(
        `/feedmeals/detail/${detail.feedMealDetailId}?quantity=${quantity}`
      );

      if (response.status === 200) {
        message.success(t('Updated successfully'));
        onSuccess(); // Trigger the success callback to refresh data
        onCancel(); // Close the modal
      } else {
        message.error(t('Failed to update'));
      }
    } catch (error: any) {
      console.error('Error updating feed meal detail:', error);
      message.error(t('Error occurred while updating'));
    }
  };

  return (
    <ModalComponent
      title={t('Edit Feed Meal Detail')}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={t('Save')}
      cancelText={t('Cancel')}
    >
      {detail ? (
        <Form form={form} layout="vertical">
          <Form.Item label={t('Item')} style={{ marginBottom: 16 }}>
            <span>{detail.itemEntity?.name}</span>
          </Form.Item>
          <Form.Item
            label={t('Quantity (kilogram)')}
            name="quantity"
            rules={[
              { required: true, message: t('Please input the quantity!') },
              {
                validator: (_, value) =>
                  value >= 0
                    ? Promise.resolve()
                    : Promise.reject(t('Quantity must be non-negative')),
              },
            ]}
          >
            <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      ) : (
        <p>{t('No detail selected')}</p>
      )}
    </ModalComponent>
  );
};

export default EditDetail;
