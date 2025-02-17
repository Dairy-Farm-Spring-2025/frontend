import { DatePicker, Form, Select } from 'antd';
import FormComponent from '../../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../../components/Input/InputComponent';
import LabelForm from '../../../../../../components/LabelForm/LabelForm';
import ModalComponent from '../../../../../../components/Modal/ModalComponent';

import useToast from '../../../../../../hooks/useToast';
import { healthSeverity } from '../../../../../../service/data/health';
import { Cow } from '../../../../../../model/Cow/Cow';
import useFetcher from '../../../../../../hooks/useFetcher';
import { useState } from 'react';

interface ModalCreateIllNessProps {
    modal: any;
    mutate: any;
}

const ModalCreateIllNess = ({ modal, mutate }: ModalCreateIllNessProps) => {
    const [form] = Form.useForm();
    const toast = useToast();
    const { trigger, isLoading } = useFetcher('illness/create', 'POST');
    const { data: dataCows } = useFetcher<any>(`cows`, 'GET');

    const handleFinish = async (values: any) => {
        try {
            await trigger({ body: values });
            toast.showSuccess('Create success');
            mutate();
            handleClose();
        } catch (error: any) {
            toast.showSuccess(error.message);
        }
    };

    const handleClose = () => {
        modal.closeModal();
        form.resetFields();
    };
    return (
        <ModalComponent
            title="Create IllNess"
            open={modal.open}
            onCancel={handleClose}
            loading={isLoading}
            onOk={() => form.submit()}
        >
            <FormComponent form={form} onFinish={handleFinish}>

                <FormItemComponent
                    name="cowId"
                    label={<LabelForm>Cow</LabelForm>}
                    rules={[{ required: true }]}
                >
                    <Select
                        placeholder="Select a cow"
                        options={dataCows?.map((cow: Cow) => ({
                            value: cow.cowId,
                            label: cow.name
                        })) || []}

                    />
                </FormItemComponent>
                <FormItemComponent
                    name="symptoms"
                    label={<LabelForm>Symptoms</LabelForm>}
                    rules={[{ required: true }]}
                >

                    <InputComponent
                        placeholder='Enter symptoms' />
                </FormItemComponent>
                <FormItemComponent
                    name="severity"
                    label={<LabelForm>Severity</LabelForm>}
                    rules={[{ required: true }]}

                >
                    <Select options={healthSeverity}
                        placeholder="Select severity " />

                </FormItemComponent>
                <FormItemComponent
                    name="prognosis"
                    label={<LabelForm>Prognosis</LabelForm>}
                    rules={[{ required: true }]}
                >

                    <InputComponent
                        placeholder='Enter prognosis' />
                </FormItemComponent>

                <FormItemComponent
                    name="startDate"
                    label={<LabelForm>Start Date</LabelForm>}
                    rules={[
                        { required: true }
                    ]}
                >
                    <DatePicker className="w-full" />
                </FormItemComponent>
                <FormItemComponent
                    name="endDate"
                    label={<LabelForm>End Date</LabelForm>}
                    rules={[
                        { required: true, }
                    ]}
                >
                    <DatePicker className="w-full" />
                </FormItemComponent>
            </FormComponent>
        </ModalComponent>
    );
};

export default ModalCreateIllNess;
