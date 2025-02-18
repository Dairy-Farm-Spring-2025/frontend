import { DatePicker, Form, Select } from 'antd';
import { useEffect, useState } from 'react';
import ButtonComponent from '../../../../../../components/Button/ButtonComponent';
import DescriptionComponent, {
    DescriptionPropsItem,
} from '../../../../../../components/Description/DescriptionComponent';
import FormComponent from '../../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../../components/Input/InputComponent';
import ModalComponent from '../../../../../../components/Modal/ModalComponent';
import useFetcher from '../../../../../../hooks/useFetcher';
import useToast from '../../../../../../hooks/useToast';

import { Health } from '../../../../../../model/Cow/HealthReport';
import { healthSeverity } from '../../../../../../service/data/health';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import ReactQuillComponent from '../../../../../../components/ReactQuill/ReactQuillComponent';


interface ModalViewDetailProps {
    modal: any;
    mutate: any;
    id: string;
}

const ModalViewDetail = ({
    modal,
    mutate,
    id,
}: ModalViewDetailProps) => {
    const [form] = Form.useForm();
    const toast = useToast();
    const { trigger, isLoading } = useFetcher(`illness/${id}`, 'PUT');
    const [edit, setEdit] = useState(false);
    const { t } = useTranslation();
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
    }, [modal.open, data, form]);

    const handleFinish = async (values: any) => {
        try {
            await trigger({ body: values });
            toast.showSuccess(t('Update success'));
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
            label: t('Symptoms'),
            children: !edit ? (
                data ? (
                    data?.symptoms.replace(/<\/?p>/g, '') // Loại bỏ thẻ <p>
                ) : (
                    ''
                )
            ) : (
                <FormItemComponent name="symptoms" rules={[{ required: true }]}>
                    <ReactQuillComponent />
                </FormItemComponent>
            ),
            span: 3,
        },
        {
            key: 'severity',
            label: t('Severity'),
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
            label: t('Prognosis'),
            children: !edit ? (
                data ? (
                    data?.prognosis.replace(/<\/?p>/g, '') // Loại bỏ thẻ <p>
                ) : (
                    ''
                )
            ) : (
                <FormItemComponent name="prognosis" rules={[{ required: true }]}>
                    <ReactQuillComponent />
                </FormItemComponent>
            ),
            span: 3,
        },

        {
            key: 'startDate',
            label: t('Start Date'),
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
            label: t('End Date'),
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
            title={t("Edit")}
            open={modal.open}
            onCancel={handleClose}
            loading={isLoadingDetail}
            footer={[
                !edit && (
                    <ButtonComponent type="primary" onClick={() => setEdit(true)}>
                        {t("Edit")}
                    </ButtonComponent>
                ),
                edit && (
                    <div className="flex gap-5 justify-end">
                        <ButtonComponent onClick={() => setEdit(false)}>
                            {t("Cancel")}
                        </ButtonComponent>
                        <ButtonComponent
                            loading={isLoading}
                            type="primary"
                            onClick={() => form.submit()}
                        >
                            {t("Save")}
                        </ButtonComponent>
                    </div>
                ),
            ]}
            width={1200}
        >
            <FormComponent form={form} onFinish={handleFinish}>
                <DescriptionComponent items={items} />
            </FormComponent>
        </ModalComponent>
    );
};

export default ModalViewDetail;
