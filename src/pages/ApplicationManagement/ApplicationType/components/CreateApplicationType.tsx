import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';

import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { Form } from 'antd';

import { useTranslation } from 'react-i18next';

interface ModalCreateApplicationTypeProps {
  modal: any;
  mutate: any;
}

const ModalCreateApplicationType = ({
  modal,
  mutate,
}: ModalCreateApplicationTypeProps) => {
  const [form] = Form.useForm();
  const toast = useToast();
  const { trigger, isLoading } = useFetcher('application-type', 'POST');
  const { t } = useTranslation();
  const handleFinish = async (values: any) => {
    try {
      const response = await trigger({ body: values });
      toast.showSuccess(response.message || t('Create success'));
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
      title={t('Create Application Type')}
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
      </FormComponent>
    </ModalComponent>
  );
};

export default ModalCreateApplicationType;
