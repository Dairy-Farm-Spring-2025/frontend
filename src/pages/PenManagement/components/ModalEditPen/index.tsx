import { Form, Input, Select } from "antd";
import { useEffect } from "react";
import useToast from "../../../../hooks/useToast";
import useFetcher from "../../../../hooks/useFetcher";
import { Pen } from "../../../../model/Pen";
import ModalComponent from "../../../../components/Modal/ModalComponent";
import FormComponent from "../../../../components/Form/FormComponent";
import FormItemComponent from "../../../../components/Form/Item/FormItemComponent";
import LabelForm from "../../../../components/LabelForm/LabelForm";
import { penStatus, penType } from "../../../../service/data/pen";


interface ModalTypesProps {
    mutate: any;
    modal: any;
    id: number;
}

const ModalEditPens = ({ mutate, modal, id }: ModalTypesProps) => {
    const toast = useToast();
    const { data: dataPen } = useFetcher<Pen>(`pens/${id}`, "GET");
    const { data: dataArea } = useFetcher<Pen[]>("areas", "GET");
    console.log("check data: ", dataArea)

    const { isLoading: isLoadingEdit, trigger } = useFetcher<any>(`pens/${id}`, "PUT");
    const [form] = Form.useForm();

    const areas = dataArea ? dataArea.map(area => ({
        label: area.name,
        value: area.areaId
    })) : [];
    useEffect(() => {
        if (id && modal.open) {
            form.setFieldsValue({
                name: dataPen?.name,

                description: dataPen?.description,
                penType: dataPen?.penType,

                length: dataPen?.length,
                width: dataPen?.width,
                penStatus: dataPen?.penStatus,
                areaId: dataPen?.areaId
            });
        }
    }, [dataPen?.description, dataPen?.name, dataPen?.penStatus, form, id, modal.open]);

    const onFinish = async (values: Pen) => {
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
                title="Edit Pen"
                loading={isLoadingEdit}
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

export default ModalEditPens;
