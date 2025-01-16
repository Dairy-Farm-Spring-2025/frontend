
import React, { useState, useEffect } from "react";
import { Form, Input, Select, InputNumber, Spin, Card } from "antd";
import useToast from "../../../../hooks/useToast";
import useFetcher from "../../../../hooks/useFetcher";
import ButtonComponent from "../../../../components/Button/ButtonComponent";
import ModalComponent from "../../../../components/Modal/ModalComponent";
import FormComponent from "../../../../components/Form/FormComponent";
import FormItemComponent from "../../../../components/Form/Item/FormItemComponent";
import LabelForm from "../../../../components/LabelForm/LabelForm";
import { penStatus, penType } from "../../../../service/data/pen";
import { Area } from "../../../../model/Area";
import { Pen } from "../../../../model/Pen";

interface ModalCreatePenProps {
    mutate: any;
    modal: any;
    areaId: number | null;
}

const ModalCreatePen = ({ mutate, modal, areaId }: ModalCreatePenProps) => {
    const toast = useToast();
    const { trigger: TriggerPost, isLoading } = useFetcher("pens/create", "POST");
    const { data, isLoading: isAreasLoading } = useFetcher<Area[]>("areas", "GET");

    const [form] = Form.useForm();
    const [selectedAreaDetails, setSelectedAreaDetails] = useState<Area | null>(null);

    const areas = data
        ? data.map((area) => ({
            label: area.name,
            value: area.areaId,
        }))
        : [];


    const onFinish = async (values: Pen) => {
        try {
            const response = await TriggerPost({ body: values });
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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "48%" }}>
                <ButtonComponent onClick={modal.openModal} type="primary">
                    Create New Pen
                </ButtonComponent>

                <ModalComponent
                    open={modal.open}
                    onOk={() => form.submit()}
                    onCancel={onClose}
                    title="Create New Pen"
                    loading={isLoading}
                    footer={isLoading ? <Spin tip="Submitting..." /> : null}
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
                                            onChange={(areaId) => setSelectedAreaDetails(data?.find(area => area.areaId === areaId) || null)}
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
        </div>
    );
};

export default ModalCreatePen;
