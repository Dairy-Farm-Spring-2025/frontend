import { DatePicker, Form, Select } from 'antd';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';

import { useTranslation } from 'react-i18next';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { Cow } from '@model/Cow/Cow';
import { healthSeverity } from '@service/data/health';
import { HEALTH_RECORD_PATH } from '@service/api/HealthRecord/healthRecordApi';
import { COW_PATH } from '@service/api/Cow/cowApi';

interface ModalCreateIllNessProps {
  modal: any;
  mutate: any;
}

const ModalCreateIllNess = ({ modal, mutate }: ModalCreateIllNessProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const toast = useToast();
  const { trigger, isLoading } = useFetcher(
    HEALTH_RECORD_PATH.CREATE_ILLNESS,
    'POST'
  );
  const { data: dataCows } = useFetcher<any>(COW_PATH.COWS, 'GET');

  const handleFinish = async (values: any) => {
    try {
      const response = await trigger({ body: values });
      toast.showSuccess(response.message);
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
      title={t('Create IllNess')}
      open={modal.open}
      onCancel={handleClose}
      loading={isLoading}
      onOk={() => form.submit()}
    >
      <FormComponent form={form} onFinish={handleFinish}>
        <FormItemComponent
          name="cowId"
          label={<LabelForm>{t('Cow')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select a cow"
            options={
              dataCows?.map((cow: Cow) => ({
                value: cow.cowId,
                label: cow.name,
              })) || []
            }
          />
        </FormItemComponent>
        <FormItemComponent
          name="symptoms"
          label={<LabelForm>{t('Symptoms')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <InputComponent placeholder="Enter symptoms" />
        </FormItemComponent>
        <FormItemComponent
          name="severity"
          label={<LabelForm>{t('Severity')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <Select options={healthSeverity} placeholder="Select severity " />
        </FormItemComponent>
        <FormItemComponent
          name="prognosis"
          label={<LabelForm>{t('Prognosis')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <InputComponent placeholder="Enter prognosis" />
        </FormItemComponent>

        <FormItemComponent
          name="startDate"
          label={<LabelForm>{t('Start Date')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <DatePicker className="w-full" />
        </FormItemComponent>
        <FormItemComponent
          name="endDate"
          label={<LabelForm>{t('End Date')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <DatePicker className="w-full" />
        </FormItemComponent>
      </FormComponent>
    </ModalComponent>
  );
};

export default ModalCreateIllNess;
