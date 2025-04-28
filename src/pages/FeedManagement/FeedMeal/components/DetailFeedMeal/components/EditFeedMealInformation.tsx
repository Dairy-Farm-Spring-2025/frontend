import ModalComponent from '@components/Modal/ModalComponent';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import api from '@config/axios/axios';
import { FeedMeals } from '@model/Feed/Feed';
import { Form, Input, message, Select } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface EditFeedMealInformationProps {
  visible: boolean;
  data: FeedMeals | null;
  feedMealId: number;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditFeedMealInformation = ({
  visible,
  data,
  feedMealId,
  onCancel,
  onSuccess,
}: EditFeedMealInformationProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name ?? '',
        description: data.description ?? '',
        status: data.status ?? 'inUse',
        cowType: data.cowTypeEntity
          ? `${data.cowTypeEntity.name} - ${data.cowTypeEntity.maxWeight}`
          : '',
        // Translate cowStatus using the t function
        cowStatus: data.cowStatus ? t(data.cowStatus) : '',
      });
    }
  }, [data, form, t]); // Add t to dependencies since we're using it

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (!feedMealId) {
        message.error(t('Invalid feed meal ID'));
        return;
      }

      const payload = {
        name: values.name,
        description: values.description,
        status: values.status,
      };

      const response = await api.put(`/feedmeals/${feedMealId}`, payload);

      if (response.status === 200) {
        message.success(t('Updated successfully'));
        onSuccess();
        onCancel();
      } else {
        message.error(t('Failed to update feed meal'));
      }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          message.error(t('Invalid data provided'));
        } else if (status === 404) {
          message.error(t('Feed meal not found'));
        } else {
          message.error(t('Error occurred while updating'));
        }
      } else {
        message.error(t('Network error occurred'));
      }
    }
  };

  return (
    <ModalComponent
      title={t('Edit Feed Meal Information')}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={t('Save')}
      cancelText={t('Cancel')}
    >
      {data ? (
        <Form form={form} layout="vertical">
          <Form.Item
            label={t('Name')}
            name="name"
            rules={[{ required: true, message: t('Please input the name!') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('Description')}
            name="description"
            rules={[{ required: true, message: t('Please input the description!') }]}
          >
            <ReactQuillComponent />
          </Form.Item>
          <Form.Item
            label={t('Status')}
            name="status"
            rules={[{ required: true, message: t('Please select the status!') }]}
          >
            <Select>
              <Select.Option value="inUse">{t('In Use')}</Select.Option>
              <Select.Option value="noUse">{t('No Use')}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label={t('Cow Type')} name="cowType">
            <Input disabled />
          </Form.Item>
          <Form.Item label={t('Cow Status')} name="cowStatus">
            <Input disabled />
          </Form.Item>
        </Form>
      ) : (
        <p>{t('No data selected')}</p>
      )}
    </ModalComponent>
  );
};

export default EditFeedMealInformation;