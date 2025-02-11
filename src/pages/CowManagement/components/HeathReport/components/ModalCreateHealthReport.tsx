import { Form } from 'antd';
import FormComponent from '../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../components/Input/InputComponent';
import LabelForm from '../../../../../components/LabelForm/LabelForm';
import ModalComponent from '../../../../../components/Modal/ModalComponent';
import useFetcher from '../../../../../hooks/useFetcher';
import useToast from '../../../../../hooks/useToast';

interface ModalCreateHealthReportProps {
    modal: any;
    mutate: any;
}

const ModalCreateHealthReport = ({ modal, mutate }: ModalCreateHealthReportProps) => {
    const [form] = Form.useForm();
    const toast = useToast();
    const { trigger, isLoading } = useFetcher('suppliers/create', 'POST');

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
            title="Create HealthReport"
            open={modal.open}
            onCancel={handleClose}
            loading={isLoading}
            onOk={() => form.submit()}
        >
            <FormComponent form={form} onFinish={handleFinish}>
                <FormItemComponent
                    name="symptoms"
                    label={<LabelForm>Symptoms</LabelForm>}
                    rules={[{ required: true }]}
                >
                    <InputComponent
                        placeholder='Enter name of symptoms' />
                </FormItemComponent>
                <FormItemComponent
                    name="address"
                    label={<LabelForm>Address</LabelForm>}
                    rules={[{ required: true }]}

                >
                    <InputComponent
                        placeholder='Enter email of supplier' />
                </FormItemComponent>
                <FormItemComponent
                    name="phone"
                    label={<LabelForm>Phone</LabelForm>}
                    rules={[
                        { required: true, message: 'Please enter phone of supplier' },
                        { pattern: /^\d{10}$/, message: 'phone must have 10 numbers' }
                    ]}
                >
                    <InputComponent
                        placeholder='Enter phone of supplier' />
                </FormItemComponent>
                <FormItemComponent
                    name="email"
                    label={<LabelForm>Email</LabelForm>}
                    rules={[
                        { required: true, message: 'Please enter email of supplier' },
                        { type: 'email', message: 'Email is invalid!' }
                    ]}
                >
                    <InputComponent
                        placeholder='Enter email of supplier' />
                </FormItemComponent>
            </FormComponent>
        </ModalComponent>
    );
};

export default ModalCreateHealthReport;
