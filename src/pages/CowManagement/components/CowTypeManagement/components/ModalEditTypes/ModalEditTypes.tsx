import { Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { CowTypeRequest } from '@model/Cow/CowType';
import { cowTypesStatus } from '@service/data/cowTypesStatus';
import InputComponent from '@components/Input/InputComponent';
import { useTranslation } from 'react-i18next';
import { COW_TYPE_PATH } from '@service/api/CowType/cowType';

interface ModalTypesProps {
  mutate: any;
  modal: any;
  id: string;
}

const ModalEditTypes = ({ mutate, modal, id }: ModalTypesProps) => {
  const toast = useToast();
  const { data } = useFetcher<any>(COW_TYPE_PATH.COW_TYPES_DETAIL(id), 'GET');
  const { isLoading: isLoadingEdit, trigger } = useFetcher<any>(
    COW_TYPE_PATH.COW_TYPES_UPDATE(id),
    'PUT'
  );
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (id && modal.open) {
      form.setFieldsValue({
        name: data?.name,
        status: data?.status,
        description: data?.description,
        maxWeight: data?.maxWeight,
      });
    }
  }, [
    data?.description,
    data?.maxWeight,
    data?.name,
    data?.status,
    form,
    id,
    modal.open,
  ]);

  const onFinish = async (values: CowTypeRequest) => {
    try {
      const response = await trigger({ body: values });
      toast.showSuccess(response.message);
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
      <ModalComponent
        open={modal.open}
        onOk={() => form.submit()}
        onCancel={modal.closeModal}
        title="Create new cow types"
        loading={isLoadingEdit}
      >
        <FormComponent form={form} onFinish={onFinish}>
          <FormItemComponent name="id" hidden>
            <Input />
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true }]}
            name="name"
            label={<LabelForm>Name:</LabelForm>}
          >
            <Input />
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true }]}
            name="maxWeight"
            label={<LabelForm>{t('Max weight')}:</LabelForm>}
          >
            <InputComponent.Number min={1} />
          </FormItemComponent>
          <FormItemComponent
            name="status"
            label={<LabelForm>Status:</LabelForm>}
            rules={[{ required: true }]}
          >
            <Select options={cowTypesStatus()} />
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true }]}
            name="description"
            label={<LabelForm>Description:</LabelForm>}
          >
            <Input.TextArea></Input.TextArea>
          </FormItemComponent>
        </FormComponent>
      </ModalComponent>
    </div>
  );
};

export default ModalEditTypes;
