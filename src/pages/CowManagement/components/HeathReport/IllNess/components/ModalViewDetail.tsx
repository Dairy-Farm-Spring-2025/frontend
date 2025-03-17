import { DatePicker, Form, Select, Row, Col, Divider } from 'antd';
import { useEffect, useState } from 'react';
import ButtonComponent from '@components/Button/ButtonComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import { Health } from '@model/Cow/HealthReport';
import { healthSeverity } from '@service/data/health';
import { HEALTH_RECORD_PATH } from '@service/api/HealthRecord/healthRecordApi';
import Title from '@components/UI/Title';

interface ModalViewDetailProps {
  modal: any;
  mutate: any;
  id: string;
}

const ModalViewDetail = ({ modal, mutate, id }: ModalViewDetailProps) => {
  const [form] = Form.useForm();
  const toast = useToast();
  const { t } = useTranslation();
  const [edit, setEdit] = useState(false);

  // Fetch data
  const {
    data,
    isLoading: isLoadingDetail,
    mutate: mutateEdit,
    error: fetchError,
  } = useFetcher<Health>(HEALTH_RECORD_PATH.DETAIL_ILLNESS(id), 'GET');

  const { trigger, isLoading } = useFetcher(
    HEALTH_RECORD_PATH.UPDATE_ILLNESS(id),
    'PUT'
  );

  // Sync form with data
  useEffect(() => {
    if (data && !edit) {
      form.setFieldsValue({
        symptoms: data.symptoms,
        severity: data.severity,
        startDate: data.startDate ? dayjs(data.startDate) : null,
        endDate: data.endDate ? dayjs(data.endDate) : null,
        prognosis: data.prognosis,
      });
    } else if (!data && !edit) {
      form.resetFields();
    }
  }, [modal.open, data, edit, form]);

  // Handle form submission
  const handleFinish = async (values: any) => {
    try {
      const response = await trigger({
        body: {
          ...values,
          startDate: values.startDate?.toISOString(),
          endDate: values.endDate?.toISOString(),
        },
      });
      toast.showSuccess(response.message || t('Update successful'));
      mutate();
      mutateEdit();
      setEdit(false);
      modal.closeModal();
    } catch (error: any) {
      toast.showError(error.message || t('Update failed'));
    }
  };

  // Handle modal close
  const handleClose = () => {
    modal.closeModal();
    form.resetFields();
    setEdit(false);
  };

  // Render loading or error state
  if (isLoadingDetail) {
    return (
      <ModalComponent
        title={t('Loading')}
        open={modal.open}
        onCancel={handleClose}
        loading={true}
        footer={null}
        width={800}
      >
        <div className="flex justify-center py-10">
          <span>{t('Loading...')}</span>
        </div>
      </ModalComponent>
    );
  }

  if (fetchError) {
    return (
      <ModalComponent
        title={t('Error')}
        open={modal.open}
        onCancel={handleClose}
        loading={false}
        footer={null}
        width={800}
      >
        <div className="text-red-500 text-center py-10">
          {t('Failed to load health record details')}
        </div>
      </ModalComponent>
    );
  }

  return (
    <ModalComponent
      title={t('IllNess Details')}
      open={modal.open}
      onCancel={handleClose}
      loading={isLoadingDetail}
      footer={[
        !edit && (
          <ButtonComponent key="edit" type="primary" onClick={() => setEdit(true)}>
            {t('Edit')}
          </ButtonComponent>
        ),
        edit && (
          <div key="actions" className="flex gap-4 justify-end">
            <ButtonComponent onClick={() => setEdit(false)}>{t('Cancel')}</ButtonComponent>
            <ButtonComponent
              loading={isLoading}
              type="primary"
              onClick={() => form.submit()}
            >
              {t('Save')}
            </ButtonComponent>
          </div>
        ),
      ]}
      width={800}
      className="rounded-lg"
    >
      <FormComponent form={form} onFinish={handleFinish} layout="vertical">
        <div className="p-6">
          {/* Section 1: Illness Details */}
          <div className="mb-6">
            <Title className="!text-2xl mb-6">{t('Illness Information')}</Title>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <FormItemComponent
                  name="symptoms"
                  label={<LabelForm>{t('Symptoms')}</LabelForm>}
                  rules={[{ required: edit, message: t('Please input symptoms') }]}
                >
                  {!edit ? (
                    data ? (
                      <div
                        className="prose text-gray-700"
                        dangerouslySetInnerHTML={{ __html: data.symptoms }}
                      />
                    ) : (
                      <span className="text-gray-400">{t('No data')}</span>
                    )
                  ) : (
                    <ReactQuillComponent placeholder={t('Describe the symptoms here...')} />
                  )}
                </FormItemComponent>
              </Col>
              <Col span={24}>
                <FormItemComponent
                  name="severity"
                  label={<LabelForm>{t('Severity')}</LabelForm>}
                  rules={[{ required: edit, message: t('Please select severity') }]}
                >
                  {!edit ? (
                    data ? (
                      <span className="font-medium text-gray-700">{data.severity}</span>
                    ) : (
                      <span className="text-gray-400">{t('No data')}</span>
                    )
                  ) : (
                    <Select
                      options={healthSeverity}
                      placeholder={t('Select severity level')}
                      className="w-full"
                    />
                  )}
                </FormItemComponent>
              </Col>
              <Col span={24}>
                <FormItemComponent
                  name="prognosis"
                  label={<LabelForm>{t('Prognosis')}</LabelForm>}
                  rules={[{ required: edit, message: t('Please input prognosis') }]}
                >
                  {!edit ? (
                    data ? (
                      <div
                        className="prose text-gray-700"
                        dangerouslySetInnerHTML={{ __html: data.prognosis }}
                      />
                    ) : (
                      <span className="text-gray-400">{t('No data')}</span>
                    )
                  ) : (
                    <ReactQuillComponent placeholder={t('Describe the prognosis here...')} />
                  )}
                </FormItemComponent>
              </Col>
            </Row>
          </div>

          {/* Divider */}
          <Divider className="my-6" />

          {/* Section 2: Date Range */}
          <div>
            <Title className="!text-2xl mb-6">{t('Date Range')}</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <FormItemComponent
                  name="startDate"
                  label={<LabelForm>{t('Start Date')}</LabelForm>}
                  rules={[{ required: edit, message: t('Please select start date') }]}
                >
                  {!edit ? (
                    data && data.startDate ? (
                      <span className="font-medium text-gray-700">
                        {dayjs(data.startDate).format('DD/MM/YYYY')}
                      </span>
                    ) : (
                      <span className="text-gray-400">{t('No data')}</span>
                    )
                  ) : (
                    <DatePicker className="w-full" />
                  )}
                </FormItemComponent>
              </Col>
              <Col span={12}>
                <FormItemComponent
                  name="endDate"
                  label={<LabelForm>{t('End Date')}</LabelForm>}
                  rules={[{ required: edit, message: t('Please select end date') }]}
                >
                  {!edit ? (
                    data && data.endDate ? (
                      <span className="font-medium text-gray-700">
                        {dayjs(data.endDate).format('DD/MM/YYYY')}
                      </span>
                    ) : (
                      <span className="text-gray-400">{t('No data')}</span>
                    )
                  ) : (
                    <DatePicker className="w-full" />
                  )}
                </FormItemComponent>
              </Col>
            </Row>
          </div>
        </div>
      </FormComponent>
    </ModalComponent>
  );
};

export default ModalViewDetail;