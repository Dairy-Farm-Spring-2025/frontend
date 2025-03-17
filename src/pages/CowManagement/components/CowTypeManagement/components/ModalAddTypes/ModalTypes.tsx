import { Form, Input, Select } from 'antd';
import ButtonComponent from '@components/Button/ButtonComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { CowTypeRequest } from '@model/Cow/CowType';
import { cowTypesStatus } from '@service/data/cowTypesStatus';
import { useTranslation } from 'react-i18next';
import InputComponent from '@components/Input/InputComponent';
import { useEffect, useState } from 'react';
import { COW_TYPE_PATH } from '@service/api/CowType/cowType';

interface ModalTypesProps {
  mutate: any;
  modal: any;
}

const ModalTypes = ({ mutate, modal }: ModalTypesProps) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { trigger, isLoading } = useFetcher(
    COW_TYPE_PATH.COW_TYPES_CREATE,
    'POST'
  );
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);
  const [disabledButton, setDisabledButton] = useState(true);
  useEffect(() => {
    if (modal.open) {
      form.resetFields(); // Reset form khi modal mở
      setDisabledButton(true); // Disable nút ngay từ đầu
    }
  }, [form, modal.open]);
  useEffect(() => {
    const isButtonDisabled =
      !formValues || Object.values(formValues).some((value) => !value);
    setDisabledButton(isButtonDisabled);
  }, [formValues]);

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
      <ButtonComponent onClick={modal.openModal} type="primary">
        {t('Create new cow types')}
      </ButtonComponent>
      <ModalComponent
        open={modal.open}
        onOk={() => form.submit()}
        onCancel={modal.closeModal}
        title={t('Create new cow types')}
        loading={isLoading}
        disabledButtonOk={disabledButton}
      >
        <FormComponent form={form} onFinish={onFinish}>
          <FormItemComponent
            rules={[{ required: true }]}
            name="name"
            label={<LabelForm>{t('Name')}:</LabelForm>}
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
            label={<LabelForm>{t('Status')}:</LabelForm>}
            rules={[{ required: true }]}
          >
            <Select options={cowTypesStatus} />
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true }]}
            name="description"
            label={<LabelForm>{t('Description')}:</LabelForm>}
          >
            <Input.TextArea />
          </FormItemComponent>
        </FormComponent>
      </ModalComponent>
    </div>
  );
};

export default ModalTypes;
