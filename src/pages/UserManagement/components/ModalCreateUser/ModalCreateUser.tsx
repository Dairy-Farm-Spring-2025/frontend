import { Form, Input, Select } from "antd";
import useToast from "../../../../hooks/useToast";
import useFetcher from "../../../../hooks/useFetcher";

import CreateUser from "../../../../model/User";
import ButtonComponent from "../../../../components/Button/ButtonComponent";
import ModalComponent from "../../../../components/Modal/ModalComponent";
import FormComponent from "../../../../components/Form/FormComponent";
import FormItemComponent from "../../../../components/Form/Item/FormItemComponent";
import LabelForm from "../../../../components/LabelForm/LabelForm";
import { role } from "../../../../service/data/role";


interface ModalCreateUserProps {
    mutate: any;
    modal: any;
}

const ModalCreateUser = ({ mutate, modal }: ModalCreateUserProps) => {
    const toast = useToast();
    const { trigger, isLoading } = useFetcher("users/create", "POST");
    const [form] = Form.useForm();

    const onFinish = async (values: CreateUser) => {
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
                Create User
            </ButtonComponent>
            <ModalComponent
                open={modal.open}
                onOk={() => form.submit()}
                onCancel={modal.closeModal}
                title="Create new user"
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
                        rules={[{ required: true }]}
                        name="email"
                        label={<LabelForm>Email:</LabelForm>}
                    >
                        <Input />
                    </FormItemComponent>

                    <FormItemComponent
                        rules={[{ required: true }]}
                        name="roleId"
                        label={<LabelForm>Role:</LabelForm>}
                    >
                        <Select options={role} />
                    </FormItemComponent>
                </FormComponent>
            </ModalComponent>
        </div>
    );
};

export default ModalCreateUser;
