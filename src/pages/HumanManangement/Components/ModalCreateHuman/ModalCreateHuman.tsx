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




const ModalCreateHuman = ({ mutate, modal, title, defaultValues, hiddenFields }: any) => {
    console.log("Default values:", defaultValues); // Log defaultValues
    const toast = useToast();
    const { trigger, isLoading } = useFetcher("users/create", "POST");
    const [form] = Form.useForm();

    const onFinish = async (values: CreateUser) => {
        try {
            const response = await trigger({ body: values });
            console.log("Submitted values:", values);
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
                {title || "Create Human"}
            </ButtonComponent>
            <ModalComponent
                open={modal.open}
                onOk={() => form.submit()}
                onCancel={modal.closeModal}
                title={title || "Create Human"}
                loading={isLoading}
            >
                <FormComponent
                    form={form}
                    onFinish={onFinish}
                    initialValues={defaultValues}

                >

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

                    {!hiddenFields?.includes("roleId") && ( // Kiểm tra ẩn trường roleId
                        <FormItemComponent
                            rules={[{ required: true }]}
                            name="roleId"
                            label={<LabelForm>Role:</LabelForm>}
                        >
                            <Select options={role} />
                        </FormItemComponent>
                    )}

                </FormComponent>
            </ModalComponent>
        </div>
    );
};

export default ModalCreateHuman;
