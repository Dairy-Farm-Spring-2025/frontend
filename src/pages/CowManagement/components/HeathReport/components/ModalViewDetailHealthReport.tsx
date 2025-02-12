import { DatePicker, Form, Select } from 'antd';
import { useEffect, useState } from 'react';
import ButtonComponent from '../../../../../components/Button/ButtonComponent';
import DescriptionComponent, {
    DescriptionPropsItem,
} from '../../../../../components/Description/DescriptionComponent';
import FormComponent from '../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../components/Input/InputComponent';
import ModalComponent from '../../../../../components/Modal/ModalComponent';
import useFetcher from '../../../../../hooks/useFetcher';
import useToast from '../../../../../hooks/useToast';

import { Health } from '../../../../../model/Cow/HealthReport';
import { healthSeverity } from '../../../../../service/data/health';
import dayjs from 'dayjs';


interface ModalViewDetailHealthReportProps {
    modal: any;
    mutate: any;
    id: string;
}

const ModalViewDetailHealthReport = ({
    modal,
    mutate,
    id,
}: ModalViewDetailHealthReportProps) => {
    const [form] = Form.useForm();
    const toast = useToast();
    const { trigger, isLoading } = useFetcher(`illness/${id}`, 'PUT');
    const [edit, setEdit] = useState(false);
    const {
        data,
        isLoading: isLoadingDetail,
        mutate: mutateEdit,
    } = useFetcher<Health>(`illness/${id}`, 'GET');

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                symptoms: data.symptoms,
                severity: data.severity,
                startDate: data.startDate ? dayjs(data.startDate) : null,
                endDate: data.endDate ? dayjs(data.endDate) : null,
                prognosis: data.prognosis,

            });
        }
    }, [data, form]);

    const handleFinish = async (values: any) => {
        try {
            await trigger({ body: values });
            toast.showSuccess('Update success');
            mutate();
            mutateEdit();
            setEdit(false);
            modal.closeModal();
        } catch (error: any) {
            toast.showSuccess(error.message);
        }
    };

    const handleClose = () => {
        modal.closeModal();
        form.resetFields();
    };

    const items: DescriptionPropsItem['items'] = [
        {
            key: 'symptoms',
            label: 'Symptoms',
            children: !edit ? (
                data ? (
                    data?.symptoms
                ) : (
                    ''
                )
            ) : (
                <FormItemComponent name="symptoms" rules={[{ required: true }]}>
                    <InputComponent />
                </FormItemComponent>
            ),
            span: 3,
        },
        {
            key: 'severity',
            label: 'Severity',
            children: !edit ? (
                data ? (
                    data?.severity
                ) : (
                    ''
                )
            ) : (
                <FormItemComponent name="severity" rules={[{ required: true }]}>
                    <Select options={healthSeverity} />
                </FormItemComponent>
            ),
            span: 3,
        },
        {
            key: 'prognosis',
            label: 'Prognosis',
            children: !edit ? (
                data ? (
                    data?.severity
                ) : (
                    ''
                )
            ) : (
                <FormItemComponent name="prognosis" rules={[{ required: true }]}>
                    <InputComponent />
                </FormItemComponent>
            ),
            span: 3,
        },

        {
            key: 'startDate',
            label: 'Start Date',
            children: !edit ? (
                data ? (
                    data?.startDate
                ) : (
                    ''
                )
            ) : (
                <FormItemComponent name="startDate" rules={[{ required: true }]}>
                    <DatePicker value={form.getFieldValue('startDate') ? dayjs(form.getFieldValue('startDate')) : null} />
                </FormItemComponent>
            ),
            span: 3,
        },
        {
            key: 'endDate',
            label: 'EndDate',
            children: !edit ? (
                data ? (
                    data?.endDate
                ) : (
                    ''
                )
            ) : (
                <FormItemComponent name="endDate" rules={[{ required: true }]}>
                    <DatePicker value={form.getFieldValue('endDate') ? dayjs(form.getFieldValue('endDate')) : null} />
                </FormItemComponent>
            ),
            span: 3,
        },

    ];

    return (
        <ModalComponent
            title="Edit Health Report"
            open={modal.open}
            onCancel={handleClose}
            loading={isLoadingDetail}
            footer={[
                !edit && (
                    <ButtonComponent type="primary" onClick={() => setEdit(true)}>
                        Edit
                    </ButtonComponent>
                ),
                edit && (
                    <div className="flex gap-5 justify-end">
                        <ButtonComponent onClick={() => setEdit(false)}>
                            Cancel
                        </ButtonComponent>
                        <ButtonComponent
                            loading={isLoading}
                            type="primary"
                            onClick={() => form.submit()}
                        >
                            Save
                        </ButtonComponent>
                    </div>
                ),
            ]}
        >
            <FormComponent form={form} onFinish={handleFinish}>
                <DescriptionComponent items={items} />
            </FormComponent>
        </ModalComponent>
    );
};

export default ModalViewDetailHealthReport;
