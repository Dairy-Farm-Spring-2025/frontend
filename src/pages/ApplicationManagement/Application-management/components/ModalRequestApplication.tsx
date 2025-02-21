
import { Form, Input, Button, Modal, Row, Col, DatePicker, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import React from 'react';
import useFetcher from '../../../../hooks/useFetcher';
import ButtonComponent from '../../../../components/Button/ButtonComponent';
import ModalComponent from '../../../../components/Modal/ModalComponent';
import SelectComponent from '../../../../components/Select/SelectComponent';
import { typeApplication } from '../../../../service/data/typeApplication';
import ReactQuillComponent from '../../../../components/ReactQuill/ReactQuillComponent';
import useToast from '../../../../hooks/useToast';
import dayjs from 'dayjs';

interface ModalRequestApplicationProps {
    modal: any;
    mutate: any;
}

const ModalRequestApplication = ({ modal, mutate }: ModalRequestApplicationProps) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();
    const { trigger, isLoading } = useFetcher('application/request', 'POST');
    const toast = useToast();
    const handleFinish = async (values: any) => {
        try {
            const payload = {
                title: values.title,
                content: values.content,
                fromDate: dayjs(values.fromDate).format('YYYY-MM-DD'),
                toDate: dayjs(values.toDate).format('YYYY-MM-DD'),
                typeId: values.typeId,
            };
            console.log("Submitting payload:", payload);
            const response = await trigger({ body: payload });
            // mutate();
            toast.showSuccess(response.message);
            handleClose();
        } catch (error: any) {
            toast.showError(error.message);
        }
    };

    const handleClose = () => {
        modal.closeModal();
        form.resetFields();
        mutate();
    };

    return (
        <ModalComponent
            onOk={() => form.submit()}
            loading={isLoading}
            footer={isLoading ? <Spin tip="Submitting..." /> : null}
            width={1000}
            title="Request Application"
            open={modal.open}
            onCancel={handleClose}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish} onFinishFailed={(error) => console.log(error)}>

                <Form.Item name="typeId" label={t("Type")} rules={[{ required: true }]}>
                    <SelectComponent options={typeApplication} />
                </Form.Item>

                <Form.Item name="title" label={t("Title")} rules={[{ required: true }]}>
                    <Input placeholder="Enter your title" />
                </Form.Item>

                <Form.Item name="content" label={t("Content")} rules={[{ required: true }]}>
                    <ReactQuillComponent />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="fromDate" label={t("From Date")} rules={[{ required: true }]}>
                            <DatePicker />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="toDate" label={t("To Date")} rules={[{ required: true }]}>
                            <DatePicker />
                        </Form.Item>
                    </Col>
                </Row>


            </Form>
        </ModalComponent>
    );
};

export default ModalRequestApplication;
