import { useEffect, useState } from 'react';
import { Form, UploadFile } from 'antd';
import { t } from 'i18next';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import UploadComponent from '@components/Upload/UploadComponent';
import { ModalActionProps } from '@hooks/useModal';
import useFetcher from '@hooks/useFetcher';
import { REPORT_TASK_PATH } from '@service/api/Task/reportTaskApi';
import useToast from '@hooks/useToast';

interface CreateReportModalProps {
  modal: ModalActionProps;
  mutate: any;
  taskId: number;
  setRefetch: any;
}

const CreateReportModal = ({
  modal,
  mutate,
  taskId,
  setRefetch,
}: CreateReportModalProps) => {
  const [file, setFile] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);
  const [disabledButton, setDisabledButton] = useState(true);
  const toast = useToast();
  const { isLoading, trigger } = useFetcher(
    REPORT_TASK_PATH.CREATE_REPORT(taskId),
    'POST',
    'multipart/form-data'
  );
  useEffect(() => {
    if (modal.open) {
      form.resetFields();
      setDisabledButton(true);
      setFile([]);
      form.setFieldsValue({ imageFile: [] });
    }
  }, [form, modal.open]);

  useEffect(() => {
    form.setFieldsValue({ imagesFile: file }); // ✅ Ensure form gets the latest file state

    const isButtonDisabled =
      !formValues ||
      Object.values(formValues).some((value) => !value) ||
      file.length === 0;

    setDisabledButton(isButtonDisabled);
  }, [file, form, formValues]);

  const handleClose = () => {
    modal.closeModal();
  };

  const normFile = (e: any) => {
    return e?.fileList || [];
  };

  const onFinish = async (values: any) => {
    const formData = new FormData();
    if (values.description) formData.append('description', values.description);
    if (values.imagesFile) {
      values.imagesFile.forEach((file: any) => {
        formData.append(`imagesFile`, file.originFileObj);
      });
    }
    try {
      const response = await trigger({ body: formData });
      toast.showSuccess(response.message);
      handleClose();
      mutate();
      setRefetch(true);
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  return (
    <ModalComponent
      loading={isLoading}
      open={modal.open}
      onCancel={handleClose}
      title={t('Create report')}
      width={1000}
      onOk={form.submit}
      disabledButtonOk={disabledButton}
    >
      <FormComponent form={form} onFinish={onFinish}>
        <FormItemComponent
          rules={[{ required: true }]}
          label={<LabelForm>{t('Description')}</LabelForm>}
          name="description"
        >
          <ReactQuillComponent />
        </FormItemComponent>

        <FormItemComponent
          name="imagesFile"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          label={<LabelForm>{t('Image')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <UploadComponent file={file} setFile={setFile} />
        </FormItemComponent>
      </FormComponent>
    </ModalComponent>
  );
};

export default CreateReportModal;
