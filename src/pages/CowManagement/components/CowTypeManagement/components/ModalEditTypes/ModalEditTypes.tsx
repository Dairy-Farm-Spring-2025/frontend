import { Form, Input, Select } from 'antd';
import { useEffect } from 'react';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { CowType, CowTypeRequest } from '@model/Cow/CowType';
import { cowTypesStatus } from '@service/data/cowTypesStatus';
import InputComponent from '@components/Input/InputComponent';
import { useTranslation } from 'react-i18next';
import { COW_TYPE_PATH } from '@service/api/CowType/cowType';
import { useEditToggle } from '@hooks/useEditToggle';
import TextBorder from '@components/UI/TextBorder';
import { formatStatusWithCamel } from '@utils/format';
import ButtonComponent from '@components/Button/ButtonComponent';
import useGetRole from '@hooks/useGetRole';

interface ModalTypesProps {
  mutate: any;
  modal: any;
  id: string;
}

const ModalEditTypes = ({ mutate, modal, id }: ModalTypesProps) => {
  const toast = useToast();
  const role = useGetRole();
  const { edited, toggleEdit } = useEditToggle();
  const { data } = useFetcher<CowType>(
    COW_TYPE_PATH.COW_TYPES_DETAIL(id),
    'GET',
    'application/json',
    modal.open
  );
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
        maxHeight: data?.maxHeight,
        maxLength: data?.maxLength,
      });
    }
  }, [
    data?.description,
    data?.maxWeight,
    data?.maxHeight,
    data?.maxLength,
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
        title={t('Edit cow types')}
        loading={isLoadingEdit}
        footer={[
          edited && [
            <ButtonComponent
              key="cancel"
              type="primary"
              buttonType="volcano"
              onClick={toggleEdit}
              className="!mr-2"
            >
              {t('Cancel')}
            </ButtonComponent>,
            <ButtonComponent
              key="edit"
              type="primary"
              onClick={form.submit}
              className="!mr-2"
            >
              {t('Confirm')}
            </ButtonComponent>,
          ],
          role !== 'Veterinarians' && !edited && (
            <ButtonComponent
              key={'toggleEdit'}
              type="primary"
              buttonType="warning"
              onClick={toggleEdit}
            >
              {t('Edit')}
            </ButtonComponent>
          ),
        ]}
      >
        <FormComponent form={form} onFinish={onFinish}>
          <FormItemComponent name="id" hidden>
            <Input />
          </FormItemComponent>
          {/* <FormItemComponent
            rules={[{ required: true }]}
            name="name"
            label={<LabelForm>{t('Name')}:</LabelForm>}
          >
            <Input />
          </FormItemComponent> */}
          <FormItemComponent
            rules={[{ required: true }]}
            name="maxWeight"
            label={<LabelForm>{t('Max weight')}:</LabelForm>}
          >
            {edited ? (
              <InputComponent.Number min={1} />
            ) : (
              <TextBorder>{data?.maxWeight || 'N/A'}</TextBorder>
            )}
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true }]}
            name="maxHeight"
            label={<LabelForm>{t('Max height')}:</LabelForm>}
          >
            {edited ? (
              <InputComponent.Number min={1} />
            ) : (
              <TextBorder>{data?.maxHeight || 'N/A'}</TextBorder>
            )}
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true }]}
            name="maxLength"
            label={<LabelForm>{t('Max length')}:</LabelForm>}
          >
            {edited ? (
              <InputComponent.Number min={1} />
            ) : (
              <TextBorder>{data?.maxLength || 'N/A'}</TextBorder>
            )}
          </FormItemComponent>
          <FormItemComponent
            name="status"
            label={<LabelForm>{t('Status')}:</LabelForm>}
            rules={[{ required: true }]}
          >
            {edited ? (
              <Select options={cowTypesStatus()} />
            ) : (
              <TextBorder>
                {t(formatStatusWithCamel(data?.status as any)) || 'N/A'}
              </TextBorder>
            )}
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true }]}
            name="description"
            label={<LabelForm>{t('Description')}:</LabelForm>}
          >
            {edited ? (
              <Input.TextArea></Input.TextArea>
            ) : (
              <TextBorder>{data?.description || 'N/A'}</TextBorder>
            )}
          </FormItemComponent>
        </FormComponent>
      </ModalComponent>
    </div>
  );
};

export default ModalEditTypes;
