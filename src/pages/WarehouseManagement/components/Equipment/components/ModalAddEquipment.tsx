import { Form } from 'antd';
import { useTranslation } from 'react-i18next';
import FormComponent from '../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../components/Input/InputComponent';
import LabelForm from '../../../../../components/LabelForm/LabelForm';
import ModalComponent from '../../../../../components/Modal/ModalComponent';
import SelectComponent from '../../../../../components/Select/SelectComponent';
import useFetcher from '../../../../../hooks/useFetcher';
import useToast from '../../../../../hooks/useToast';
import { WarehouseType } from '../../../../../model/Warehouse/warehouse';
import {
  EquipmentStatus,
  equipmentTypeSelect,
} from '../../../../../service/data/equipment';

interface ModalAddWarehouseProps {
  modal: any;
  mutate: any;
}

const ModalAddEquipment = ({ modal, mutate }: ModalAddWarehouseProps) => {
  const [form] = Form.useForm();
  const toast = useToast();
  const { trigger, isLoading } = useFetcher('equipment', 'POST');
  const { data } = useFetcher<WarehouseType[]>('warehouses', 'GET');
  const { t } = useTranslation();
  const handleFinish = async (values: any) => {
    try {
      await trigger({ body: values });
      toast.showSuccess(t('Create success'));
      mutate();
      handleClose();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const handleClose = () => {
    modal.closeModal();
    form.resetFields();
    mutate();
  };
  return (
    <ModalComponent
      title={t('Create Equipment')}
      open={modal.open}
      onCancel={handleClose}
      loading={isLoading}
      onOk={() => form.submit()}
    >
      <FormComponent form={form} onFinish={handleFinish}>
        <FormItemComponent
          name="locationId"
          label={<LabelForm>{t('Location')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <SelectComponent
            options={data
              ?.filter((element) => element.type === 'equipment')
              ?.map((item) => ({
                label: item.name,
                value: item.warehouseLocationId,
              }))}
          />
        </FormItemComponent>
        <FormItemComponent
          name="name"
          label={<LabelForm>{t('Name')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <InputComponent />
        </FormItemComponent>
        <FormItemComponent
          name="type"
          label={<LabelForm>{t('Type')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <SelectComponent options={equipmentTypeSelect()} />
        </FormItemComponent>
        <FormItemComponent
          name="status"
          label={<LabelForm>{t('Status')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <SelectComponent options={EquipmentStatus()} />
        </FormItemComponent>
        <FormItemComponent
          name="quantity"
          label={<LabelForm>{t('Quantity')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <InputComponent.Number />
        </FormItemComponent>
        <FormItemComponent
          name="description"
          label={<LabelForm>{t('Description')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <InputComponent.TextArea />
        </FormItemComponent>
      </FormComponent>
    </ModalComponent>
  );
};

export default ModalAddEquipment;
