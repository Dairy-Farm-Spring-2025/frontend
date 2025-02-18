import { Form } from 'antd';
import FormComponent from '../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../components/Input/InputComponent';
import LabelForm from '../../../../../components/LabelForm/LabelForm';
import ModalComponent from '../../../../../components/Modal/ModalComponent';
import useFetcher from '../../../../../hooks/useFetcher';
import useToast from '../../../../../hooks/useToast';
import { useTranslation } from 'react-i18next';

interface ModalAddCategoryProps {
  modal: any;
  mutate: any;
}

const ModalAddCategory = ({ modal, mutate }: ModalAddCategoryProps) => {
  const [form] = Form.useForm();
  const toast = useToast();
  const { trigger, isLoading } = useFetcher('categories/create', 'POST');

  const handleFinish = async (values: any) => {
    try {
      await trigger({ body: values });
      toast.showSuccess('Create success');
      mutate();
      handleClose();
    } catch (error: any) {
      toast.showSuccess(error.message);
    }
  };
  const { t } = useTranslation();
  const handleClose = () => {
    modal.closeModal();
    form.resetFields();
  };
  return (
    <ModalComponent
      title={t("Create Category")}
      open={modal.open}
      onCancel={handleClose}
      loading={isLoading}
      onOk={() => form.submit()}
    >
      <FormComponent form={form} onFinish={handleFinish}>
        <FormItemComponent
          name="name"
          label={<LabelForm>{t("Name")}</LabelForm>}
          rules={[{ required: true }]}
        >
          <InputComponent
            placeholder='Enter name of Category' />
        </FormItemComponent>

      </FormComponent>
    </ModalComponent>
  );
};

export default ModalAddCategory;
