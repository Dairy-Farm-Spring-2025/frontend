import { Form, Input, Select } from "antd";
import useToast from "../../../../hooks/useToast";
import useFetcher from "../../../../hooks/useFetcher";
import { Pen } from "../../../../model/Pen";
import ButtonComponent from "../../../../components/Button/ButtonComponent";
import ModalComponent from "../../../../components/Modal/ModalComponent";
import FormComponent from "../../../../components/Form/FormComponent";
import FormItemComponent from "../../../../components/Form/Item/FormItemComponent";
import LabelForm from "../../../../components/LabelForm/LabelForm";

import { penStatus, penType } from "../../../../service/data/Pen";


interface ModalCreatePenProps {
    mutate: any;
    modal: any;
}

const ModalCreatePen = ({ mutate, modal }: ModalCreatePenProps) => {
    const toast = useToast();
    const { trigger: TriggerPost, isLoading } = useFetcher("pens/create", "POST");
    const { data } = useFetcher<Pen[]>("areas", "GET");
    console.log("check data: ", data);
    const [form] = Form.useForm();
    const areas = data ? data.map(area => ({
        label: area.name,
        value: area.areaId
    })) : [];
    const onFinish = async (values: Pen) => {
        try {
            const response = await TriggerPost({ body: values });
            console.log("check value: ", values)
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
                Create New Pen
            </ButtonComponent>
            <ModalComponent
                open={modal.open}
                onOk={() => form.submit()}
                onCancel={modal.closeModal}
                title="Create New Pen "
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
                        name="description"
                        label={<LabelForm>Description:</LabelForm>}
                    >
                        <Input.TextArea />
                    </FormItemComponent>
                    <FormItemComponent
                        name="penType"
                        label={<LabelForm>Pen Type:</LabelForm>}
                        rules={[{ required: true }]}
                    >
                        <Select options={penType} />
                    </FormItemComponent>
                    <FormItemComponent
                        rules={[{ required: true }]}
                        name="length"
                        label={<LabelForm>Length:</LabelForm>}
                    >
                        <Input />
                    </FormItemComponent>
                    <FormItemComponent
                        rules={[{ required: true }]}
                        name="width"
                        label={<LabelForm>Width:</LabelForm>}
                    >
                        <Input />
                    </FormItemComponent>
                    <FormItemComponent
                        name="penStatus"
                        label={<LabelForm>Status:</LabelForm>}
                        rules={[{ required: true }]}
                    >
                        <Select options={penStatus} />
                    </FormItemComponent>
                    <FormItemComponent
                        name="areaId"
                        label={<LabelForm> Area:</LabelForm>}
                        rules={[{ required: true }]}
                    >
                        <Select options={areas} />
                    </FormItemComponent>

                </FormComponent>
            </ModalComponent>
        </div>
    );
};

export default ModalCreatePen;
