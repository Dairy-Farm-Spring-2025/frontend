import { Form, Input } from 'antd';
import useFetcher from '../../../../hooks/useFetcher';
import useToast from '../../../../hooks/useToast';
import { useTranslation } from 'react-i18next';
import ButtonComponent from '../../../../components/Button/ButtonComponent';
import FormComponent from '../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../components/Form/Item/FormItemComponent';
import LabelForm from '../../../../components/LabelForm/LabelForm';
import ModalComponent from '../../../../components/Modal/ModalComponent';
import { Role } from '../../../../model/Role';

interface ModalCreateUserProps {
  mutate: any;
  modal: any;
}

const ModalCreateRole = ({ mutate, modal }: ModalCreateUserProps) => {
  const toast = useToast();
  const { trigger, isLoading } = useFetcher('roles/create', 'POST');
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const onFinish = async (values: Role) => {
    try {
      const response = await trigger({ body: values });
      toast.showSuccess(t(response?.message || 'Create role successfully'));
      onClose();
    } catch (error: any) {
      toast.showError(error.message);
    } finally {
      mutate();
    }
  };
  const onClose = () => {
    modal.closeModal();
    form.resetFields();
  };
  return (
    <div>
      <ButtonComponent onClick={modal.openModal} type="primary">
        {t('Create Role')}
      </ButtonComponent>
      <ModalComponent
        open={modal.open}
        onOk={() => form.submit()}
        onCancel={modal.closeModal}
        title="Create new role"
        loading={isLoading}
      >
        <FormComponent form={form} onFinish={onFinish}>
          <FormItemComponent name="id" hidden>
            <Input />
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true }]}
            name="roleName"
            label={<LabelForm>{t('Role Name')}:</LabelForm>}
          >
            <Input />
          </FormItemComponent>
        </FormComponent>
      </ModalComponent>
    </div>
  );
};

export default ModalCreateRole;
