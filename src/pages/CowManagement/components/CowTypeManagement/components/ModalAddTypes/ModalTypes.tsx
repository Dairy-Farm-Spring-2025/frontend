import { Form, Input, Select } from "antd";
import ButtonComponent from "../../../../../../components/Button/ButtonComponent";
import FormComponent from "../../../../../../components/Form/FormComponent";
import FormItemComponent from "../../../../../../components/Form/Item/FormItemComponent";
import LabelForm from "../../../../../../components/LabelForm/LabelForm";
import ModalComponent from "../../../../../../components/Modal/ModalComponent";
import useFetcher from "../../../../../../hooks/useFetcher";
import useToast from "../../../../../../hooks/useToast";
import { CowTypeRequest } from "../../../../../../model/Cow/CowType";
import { cowTypesStatus } from "../../../../../../service/data/cowTypesStatus";

interface ModalTypesProps {
  mutate: any;
  modal: any;
}

const ModalTypes = ({ mutate, modal }: ModalTypesProps) => {
  const toast = useToast();
  const { trigger, isLoading } = useFetcher("cow-types/create", "POST");
  const [form] = Form.useForm();

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
        Create New Types
      </ButtonComponent>
      <ModalComponent
        open={modal.open}
        onOk={() => form.submit()}
        onCancel={modal.closeModal}
        title="Create new cow types"
        loading={isLoading}
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
            name="status"
            label={<LabelForm>Status:</LabelForm>}
            rules={[{ required: true }]}
          >
            <Select options={cowTypesStatus} />
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true }]}
            name="description"
            label={<LabelForm>Description:</LabelForm>}
          >
            <Input.TextArea />
          </FormItemComponent>
        </FormComponent>
      </ModalComponent>
    </div>
  );
};

export default ModalTypes;
