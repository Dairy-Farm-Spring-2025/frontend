import { Form, Input, Select } from 'antd';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';

import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import { TASK_TYPE_PATH } from '@service/api/Task/taskType';
import { useTranslation } from 'react-i18next';
import ButtonComponent from '@components/Button/ButtonComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import { ROLE_TASKTYPE_SELECT } from '@service/data/role';

interface ModalCreateTaskType {
  mutate: any;
  modal: any;
}

const CreateTaskType = ({ mutate, modal }: ModalCreateTaskType) => {
  const toast = useToast();

  const { isLoading, trigger } = useFetcher(
    TASK_TYPE_PATH.CREATE_TASK_TYPE,
    'POST'
  );
  const [form] = Form.useForm();
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
    <div>
      <ButtonComponent onClick={modal.openModal} type="primary">
        {t('Create Task Type')}
      </ButtonComponent>
      <ModalComponent
        open={modal.open}
        onOk={() => form.submit()}
        onCancel={modal.closeModal}
        title={t('Create Task Type')}
        loading={isLoading}
      >
        <FormComponent form={form} onFinish={handleFinish}>
          <FormItemComponent name="id" hidden>
            <Input />
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true }]}
            name="name"
            label={<LabelForm>{t('Name')}:</LabelForm>}
          >
            <Input />
          </FormItemComponent>

          <FormItemComponent
            rules={[{ required: true }]}
            name="roleId"
            label={<LabelForm>{t('role')}:</LabelForm>}
          >
            <Select options={ROLE_TASKTYPE_SELECT()} />
          </FormItemComponent>

          <FormItemComponent
            rules={[{ required: true }]}
            name="description"
            label={<LabelForm>{t('Description')}:</LabelForm>}
          >
            <ReactQuillComponent />
          </FormItemComponent>
        </FormComponent>
      </ModalComponent>
    </div>
  );
};

export default CreateTaskType;
