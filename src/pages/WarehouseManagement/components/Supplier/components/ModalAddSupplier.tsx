import { Form } from 'antd';
import FormComponent from '../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../components/Input/InputComponent';
import LabelForm from '../../../../../components/LabelForm/LabelForm';
import ModalComponent from '../../../../../components/Modal/ModalComponent';
import useFetcher from '../../../../../hooks/useFetcher';
import useToast from '../../../../../hooks/useToast';
import { useTranslation } from 'react-i18next';

interface ModalAddSupplierProps {
  modal: any;
  mutate: any;
}

const ModalAddSupplier = ({ modal, mutate }: ModalAddSupplierProps) => {
  const [form] = Form.useForm();
  const toast = useToast();
  const { trigger, isLoading } = useFetcher('suppliers/create', 'POST');
  const { t } = useTranslation();
  const handleFinish = async (values: any) => {
    try {
      await trigger({ body: values });
      toast.showSuccess(t('Create success'));
      mutate();
      handleClose();
    } catch (error: any) {
      toast.showSuccess(error.message);
    }
  };

  const handleClose = () => {
    modal.closeModal();
    form.resetFields();
  };
  return (
    <ModalComponent
      title={t('Create Supplier')}
      open={modal.open}
      onCancel={handleClose}
      loading={isLoading}
      onOk={() => form.submit()}
    >
      <FormComponent form={form} onFinish={handleFinish}>
        <FormItemComponent
          name="name"
          label={<LabelForm>{t('Name')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <InputComponent />
        </FormItemComponent>
        <FormItemComponent
          name="address"
          label={<LabelForm>{t('Address')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <InputComponent />
        </FormItemComponent>
        <FormItemComponent
          name="phone"
          label={<LabelForm>{t('Phone')}</LabelForm>}
          rules={[
            {
              required: true,
            },
            {
              pattern: /^0\d{9}$/,
              message: t('Must be a number starting with 0 and have 10 digits'),
            },
          ]}
        >
          <InputComponent />
        </FormItemComponent>
        <FormItemComponent
          name="email"
          label={<LabelForm>{t('Email')}</LabelForm>}
          rules={[{ required: true }, { type: 'email' }]}
        >
          <InputComponent />
        </FormItemComponent>
      </FormComponent>
    </ModalComponent>
  );
};

export default ModalAddSupplier;
