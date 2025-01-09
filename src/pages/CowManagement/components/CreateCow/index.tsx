import { Form, Input, InputNumber } from "antd";
import FormComponent from "../../../../components/Form/FormComponent";
import ButtonComponent from "../../../../components/Button/ButtonComponent";
import FormItemComponent from "../../../../components/Form/Item/FormItemComponent";
import WhiteBackground from "../../../../components/UI/WhiteBackground";
import useModal from "../../../../hooks/useModal";
import ModalComponent from "../../../../components/Modal/ModalComponent";

const CreateCow = () => {
  const [form] = Form.useForm();
  const modal = useModal();
  const handleSubmit = (event: any) => {
    console.log(event);
  };
  const handleConsole = () => console.log("AAAA");
  const handleOk = () => {
    console.log("AHAHA");
    modal.closeModal(handleConsole);
  };
  return (
    <WhiteBackground>
      <ButtonComponent
        onClick={() => modal.openModal(handleConsole)}
        type="primary"
      >
        Open modal
      </ButtonComponent>
      <ModalComponent
        open={modal.open}
        onCancel={() => modal.closeModal(handleConsole)}
        onOk={handleOk}
      >
        Modal
      </ModalComponent>
      <FormComponent form={form} onFinish={handleSubmit}>
        <FormItemComponent
          name={"name"}
          label="Name"
          rules={[{ required: true }]}
        >
          <Input />
        </FormItemComponent>
        <FormItemComponent
          name="phoneNumber"
          label="Phone Number"
          rules={[{ min: 0, max: 99, required: true, type: "number" }]}
        >
          <InputNumber />
        </FormItemComponent>
        <ButtonComponent htmlType="submit">Submit</ButtonComponent>
      </FormComponent>
    </WhiteBackground>
  );
};

export default CreateCow;
