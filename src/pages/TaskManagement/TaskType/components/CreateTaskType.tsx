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
import { useTranslation } from "react-i18next";
import { TASK_TYPE_PATH } from "@service/api/Task/taskType";
import ReactQuillComponent from "@components/ReactQuill/ReactQuillComponent";


interface ModalCreateTaskType {
    mutate: any;
    modal: any;
}

const CreateTaskType = ({ mutate, modal }: ModalCreateTaskType) => {
    const toast = useToast();

    const { isLoading, trigger } = useFetcher(
        TASK_TYPE_PATH.CREATE_TASK_TYPE,
        'POST',
    );
    const [form] = Form.useForm();
    const { t } = useTranslation();

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
        <div>
            <ButtonComponent onClick={modal.openModal} type="primary">
                {t('Create Task Type')}
            </ButtonComponent>
            <ModalComponent
                open={modal.open}
                onOk={() => form.submit()}
                onCancel={modal.closeModal}
                title="Create Task Type"
                loading={isLoading}
            >
                <FormComponent form={form} onFinish={handleFinish}>
                    <FormItemComponent name="id" hidden>
                        <Input />
                    </FormItemComponent>
                    <FormItemComponent
                        rules={[{ required: true }]}
                        name="name"
                        label={<LabelForm>{t("Name")}:</LabelForm>}
                    >
                        <Input />
                    </FormItemComponent>


                    <FormItemComponent
                        rules={[{ required: true }]}
                        name="roleId"
                        label={<LabelForm>{t("role")}:</LabelForm>}
                    >
                        <Select options={role} />
                    </FormItemComponent>

                    <FormItemComponent
                        rules={[{ required: true }]}
                        name="description"
                        label={<LabelForm>{t("Description")}:</LabelForm>}
                    >
                        <ReactQuillComponent />
                    </FormItemComponent>

                </FormComponent>
            </ModalComponent>
        </div>
    );
};

export default CreateTaskType;
