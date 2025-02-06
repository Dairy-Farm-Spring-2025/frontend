import { Form } from 'antd';
import FormComponent from '../../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../../components/Input/InputComponent';
import LabelForm from '../../../../../../components/LabelForm/LabelForm';
import ModalComponent from '../../../../../../components/Modal/ModalComponent';
import SelectComponent from '../../../../../../components/Select/SelectComponent';
import { shiftData } from '../../../../../../service/data/shiftData';
import { DailyMilkRequest } from '../../../../../../model/DailyMilk/DailyMilkRequest';
import useFetcher from '../../../../../../hooks/useFetcher';
import useToast from '../../../../../../hooks/useToast';

interface DailMilkModalProps {
  id: string;
  modal: any;
  mutate: any;
}

const CreateDailyMilkModal = ({ modal, id, mutate }: DailMilkModalProps) => {
  const [form] = Form.useForm();
  const toast = useToast();
  const { trigger, isLoading } = useFetcher<any>('dailymilks/create', 'POST');
  const handleClose = () => {
    form.resetFields();
    modal.closeModal();
  };

  const getCurrentShift = () => {
    const currentHour = new Date().getHours();
    const currentMinutes = new Date().getMinutes();
    return shiftData.map((shift) => ({
      ...shift,
      disabled: shift.end <= currentHour,
      title: `The shift is passed (${currentHour}:${currentMinutes})`,
    }));
  };

  const handleFinish = async (values: DailyMilkRequest) => {
    const data: DailyMilkRequest = {
      shift: values.shift,
      volume: values.volume,
      cowId: id,
    };
    try {
      const response = await trigger({ body: data });
      toast.showSuccess(response.message);
      handleClose();
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  return (
    <ModalComponent
      loading={isLoading}
      onOk={() => form.submit()}
      onCancel={handleClose}
      open={modal.open}
    >
      <FormComponent form={form} onFinish={handleFinish}>
        <FormItemComponent
          label={<LabelForm>Shift</LabelForm>}
          name="shift"
          rules={[{ required: true }]}
        >
          <SelectComponent
            placeholder="Select shift..."
            options={getCurrentShift()}
          />
        </FormItemComponent>
        <FormItemComponent
          name="volume"
          rules={[{ required: true }]}
          label={
            <LabelForm>
              Volume <span className="text-orange-500">(lit)</span>
            </LabelForm>
          }
        >
          <InputComponent.Number placeholder="Enter volume..." />
        </FormItemComponent>
      </FormComponent>
    </ModalComponent>
  );
};

export default CreateDailyMilkModal;
