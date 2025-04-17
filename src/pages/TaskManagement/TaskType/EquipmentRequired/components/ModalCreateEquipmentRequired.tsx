import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import ModalComponent from '@components/Modal/ModalComponent';
import SelectComponent from '@components/Select/SelectComponent';
import LabelDashboard from '@core/layout/components/LabelDashboard';
import useFetcher from '@hooks/useFetcher';
import { ModalActionProps } from '@hooks/useModal';
import useRequiredForm from '@hooks/useRequiredForm';
import useToast from '@hooks/useToast';
import { EquipmentTypeStatus } from '@model/Warehouse/equipment';
import { TASK_TYPE_PATH } from '@service/api/Task/taskType';
import { Form } from 'antd';
import { t } from 'i18next';
import { useState } from 'react';

interface ModalCreateEquipmentRequired {
  modal: ModalActionProps;
  optionsTaskType: any;
  optionsEquipment: any;
  mutate: any;
}
const ModalCreateEquipmentRequired = ({
  modal,
  optionsTaskType,
  optionsEquipment,
  mutate,
}: ModalCreateEquipmentRequired) => {
  const [form] = Form.useForm();
  const toast = useToast();
  const [quantityEquipment, setQuantityEquipment] = useState(null);
  const [hasSelectedEquipment, setHasSelectedEquipment] = useState(false);
  const requiredFields = [
    'equipmentId',
    'taskTypeId',
    'requiredQuantity',
    'note',
  ];
  const disabledButton = useRequiredForm(form, requiredFields);
  const { trigger: triggerCreate, isLoading: isLoadingCreate } = useFetcher(
    TASK_TYPE_PATH.CREATE_USE_EQUIPMENT,
    'POST',
    'application/json'
  );

  const handleCancel = () => {
    modal.closeModal();
    setQuantityEquipment(null);
    setHasSelectedEquipment(false);
    form.resetFields();
  };

  const autoSetValueForTaskType: Record<EquipmentTypeStatus, string> = {
    milking: 'Lấy sữa bò',
    feeding: 'Cho bò ăn',
    cleaning: 'Dọn chuồng bò',
    heathcare: '', // sẽ xử lý đặc biệt vì có 2 task
    housing: '',
    energy: '',
  };

  const handleSelectEquipment = async (_: any, record: any) => {
    const autoValue = record?.desc?.type
      ? autoSetValueForTaskType[record?.desc?.type as EquipmentTypeStatus]
      : undefined;
    const filteredOptionsTaskType = optionsTaskType?.filter(
      (element: any) => element.desc.name === autoValue
    );

    setQuantityEquipment(record?.desc?.quantity ?? null);
    setHasSelectedEquipment(true);
    form.setFieldsValue({
      requiredQuantity: undefined,
      taskTypeId: filteredOptionsTaskType?.[0]?.value, // chỉ set value
      note: undefined,
    });
  };

  const validateRequiredQuantity = (maxQuantity: number | null) => {
    return (_: any, value: number) => {
      if (maxQuantity === null) return Promise.resolve(); // chưa chọn equipment
      if (value === undefined || value === null) return Promise.resolve();
      if (value > maxQuantity) {
        return Promise.reject(
          new Error(
            t(
              'Required quantity must not exceed available quantity ({{quantity}})',
              {
                quantity: maxQuantity,
              }
            )
          )
        );
      }
      return Promise.resolve();
    };
  };
  const handleFinish = async (values: any) => {
    try {
      console.log(values);
      const response = await triggerCreate({ body: values });
      toast.showSuccess(response.message);
      handleCancel();
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };
  return (
    <ModalComponent
      title={t('Create equipment required')}
      open={modal.open}
      onCancel={handleCancel}
      width={700}
      disabledButtonOk={disabledButton}
      onOk={form.submit}
      loading={isLoadingCreate}
    >
      <FormComponent form={form} onFinish={handleFinish}>
        <FormItemComponent
          name="equipmentId"
          label={<LabelDashboard>{t('Equipment')}</LabelDashboard>}
          rules={[{ required: true }]}
        >
          <SelectComponent
            options={optionsEquipment}
            onChange={handleSelectEquipment}
          />
        </FormItemComponent>
        {hasSelectedEquipment && (
          <>
            <FormItemComponent
              name="taskTypeId"
              label={<LabelDashboard>{t('Task type')}</LabelDashboard>}
              rules={[{ required: true }]}
            >
              <SelectComponent options={optionsTaskType} />
            </FormItemComponent>

            <FormItemComponent
              name="requiredQuantity"
              label={<LabelDashboard>{t('Required Quantity')}</LabelDashboard>}
              rules={[
                { required: true },
                { validator: validateRequiredQuantity(quantityEquipment) },
              ]}
            >
              <InputComponent.Number />
            </FormItemComponent>
            <FormItemComponent
              name="note"
              label={<LabelDashboard>{t('Note')}</LabelDashboard>}
              rules={[{ required: true }]}
            >
              <InputComponent.TextArea />
            </FormItemComponent>
          </>
        )}
      </FormComponent>
    </ModalComponent>
  );
};

export default ModalCreateEquipmentRequired;
