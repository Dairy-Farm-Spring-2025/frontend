import { Card, Col, Form, Input, InputNumber, Row, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import useToast from "../../../../hooks/useToast";
import useFetcher from "../../../../hooks/useFetcher";
import { Pen } from "../../../../model/Pen";
import ModalComponent from "../../../../components/Modal/ModalComponent";
import FormComponent from "../../../../components/Form/FormComponent";
import FormItemComponent from "../../../../components/Form/Item/FormItemComponent";
import LabelForm from "../../../../components/LabelForm/LabelForm";
import { penStatus, penType } from "../../../../service/data/pen";
import { Area } from "../../../../model/Area";


interface ModalTypesProps {
    mutate: any;
    modal: any;
    id: number;
}

const ModalEditPens = ({ mutate, modal, id }: ModalTypesProps) => {
    const toast = useToast();
    const { data: dataPen } = useFetcher<Pen>(`pens/${id}`, "GET");
    const { data: dataArea, isLoading: isAreasLoading } = useFetcher<Area[]>("areas", "GET");
    console.log("check data: ", dataArea)
    const [selectedAreaDetails, setSelectedAreaDetails] = useState<Area | null>(null);
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
                areaId: dataPen?.area?.areaId
            });
        }
    }, [dataPen?.description, dataPen?.name, dataPen?.penStatus, dataPen?.penType, form, id, modal.open, dataPen?.area?.areaId]);

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
        setSelectedAreaDetails(null);
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
                width={1200}

            >
                {isAreasLoading ? (
                    <Spin tip="Loading areas..." />
                ) : (
                    <FormComponent form={form} onFinish={onFinish} layout="vertical">
                        <FormItemComponent name="id" hidden>
                            <Input />
                        </FormItemComponent>

                        <div className="flex flex-col gap-4">
                            <p className="text-2xl text-primary font-bold">Pen Information</p>
                            <div className="grid grid-cols-4 gap-5 w-full">
                                <FormItemComponent
                                    className="col-span-4"
                                    name="name"
                                    label={<LabelForm>Pen Name:</LabelForm>}
                                    rules={[{ required: true, message: "Please enter the pen name" }]}
                                >
                                    <Input placeholder="Enter pen name" />
                                </FormItemComponent>
                                <FormItemComponent
                                    name="areaId"
                                    label={<LabelForm>Area:</LabelForm>}
                                    rules={[{ required: true, message: "Please select an area" }]}

                                >
                                    <Select
                                        options={areas}
                                        placeholder="Select area"
                                        onChange={(areaId) => setSelectedAreaDetails(dataArea?.find(area => area.areaId === areaId) || null)}
                                    />
                                </FormItemComponent>



                                <FormItemComponent
                                    name="penType"
                                    label={<LabelForm>Pen Type:</LabelForm>}
                                    rules={[{ required: true, message: "Please select a pen type" }]}
                                >
                                    <Select options={penType} placeholder="Select pen type" />
                                </FormItemComponent>

                                <FormItemComponent
                                    name="penStatus"
                                    label={<LabelForm>Status:</LabelForm>}
                                    rules={[{ required: true, message: "Please select a status" }]}
                                >
                                    <Select options={penStatus} placeholder="Select status" />
                                </FormItemComponent>


                            </div>

                            {selectedAreaDetails && (
                                <Card className="area-details"
                                    title="Area Details"
                                    bordered={true}
                                    style={{ backgroundColor: "#f7f7f7" }}
                                >
                                    <div>
                                        <p className="dimensions"><strong>Dimensions:</strong> {selectedAreaDetails.length} x {selectedAreaDetails.width} m</p>
                                        <p className="type"><strong>Type:</strong> {selectedAreaDetails.areaType}</p>
                                        <p className="description"><strong>Description:</strong> {selectedAreaDetails.description}</p>
                                    </div>
                                </Card>
                            )}
                        </div>

                        <div className="flex flex-col gap-4">
                            <p className="text-2xl text-primary font-bold">Dimensions</p>
                            <div className="grid grid-cols-2 gap-5 w-full">
                                <FormItemComponent
                                    name="length"
                                    label={<LabelForm>Length (m):</LabelForm>}
                                    rules={[{ required: true, message: "Please enter a valid length" }]}
                                >
                                    <InputNumber placeholder="Enter length in m" min={1} style={{ width: "100%" }} />
                                </FormItemComponent>

                                <FormItemComponent
                                    name="width"
                                    label={<LabelForm>Width (m):</LabelForm>}
                                    rules={[{ required: true, message: "Please enter a valid width" }]}
                                >
                                    <InputNumber placeholder="Enter width in m" min={1} style={{ width: "100%" }} />
                                </FormItemComponent>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <p className="text-2xl text-primary font-bold">Description</p>
                            <div className="grid gap-5 w-full">
                                <FormItemComponent
                                    name="description"
                                    label={<LabelForm>Description:</LabelForm>}
                                    rules={[{ required: true, message: "Please enter a description" }]}
                                >
                                    <Input.TextArea placeholder="Enter a brief description" rows={3} />
                                </FormItemComponent>
                            </div>
                        </div>
                    </FormComponent>
                )}
            </ModalComponent>
        </div>
    );
};

export default ModalEditPens;
