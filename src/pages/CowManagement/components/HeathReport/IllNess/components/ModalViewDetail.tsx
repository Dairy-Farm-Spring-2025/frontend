

import { DatePicker, Form, Select, Row, Col, Divider, Card } from 'antd';
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
import { formatAreaType } from '@utils/format';
import SelectComponent from '@components/Select/SelectComponent';

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

  const handleFinish = async (values: any) => {
    try {
      const response = await trigger({
        body: {
          ...values,
          cowId: data?.cowEntity?.cowId, // Thêm cowId từ data vào payload
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

  const handleClose = () => {
    modal.closeModal();
    form.resetFields();
    setEdit(false);
  };

  if (isLoadingDetail) {
    return (
      <ModalComponent title={t('Loading')} open={modal.open} onCancel={handleClose} loading={true} footer={null} width={800}>
        <div className="flex justify-center py-10">
          <span>{t('Loading...')}</span>
        </div>
      </ModalComponent>
    );
  }

  if (fetchError) {
    return (
      <ModalComponent title={t('Error')} open={modal.open} onCancel={handleClose} loading={false} footer={null} width={800}>
        <div className="text-red-500 text-center py-10">{t('Failed to load health record details')}</div>
      </ModalComponent>
    );
  }

  return (
    <ModalComponent
      title={t('Illness Details')}
      open={modal.open}
      onCancel={handleClose}
      loading={isLoadingDetail}
      footer={[
        !edit && data?.illnessStatus === 'pending' && (
          <ButtonComponent
            key="edit"
            type="primary"
            onClick={() => setEdit(true)}
          >
            {t('Edit')}
          </ButtonComponent>
        ),
        edit && (
          <div key="actions" className="flex gap-4 justify-end">
            <ButtonComponent onClick={() => setEdit(false)}>
              {t('Cancel')}
            </ButtonComponent>
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
      width={1000}
      className="rounded-lg"
      styles={{ wrapper: { height: '100vh', top: 0, paddingBottom: 0 }, body: { height: 'calc(80vh - 60px)', overflowY: 'auto' } }}
    >
      <FormComponent form={form} onFinish={handleFinish} layout="vertical">
        <div className="p-6 space-y-6">
          <Card>
            <Title className="!text-2xl mb-6">{t('Cow Information')}</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <LabelForm>{t('Cow Name')}</LabelForm>
                <div className="font-medium text-gray-700">{data?.cowEntity?.name || t('No data')}</div>
              </Col>
              <Col span={12}>
                <LabelForm>{t('Cow Status')}</LabelForm>
                <div className="font-medium text-gray-700">
                  {formatAreaType(data?.cowEntity?.cowStatus ?? t('No data'))}
                </div>
              </Col>
              <Col span={12}>
                <LabelForm>{t('Cow Origin')}</LabelForm>
                <div className="font-medium text-gray-700">{formatAreaType(data?.cowEntity?.cowOrigin ?? t('No data'))}</div>
              </Col>
              <Col span={12}>
                <LabelForm>{t('Gender')}</LabelForm>
                <div className="font-medium text-gray-700">{formatAreaType(data?.cowEntity?.gender ?? t('No data'))}</div>
              </Col>
              <Col span={12}>
                <LabelForm>{t('Cow Type')}</LabelForm>
                <div className="font-medium text-gray-700">{formatAreaType(data?.cowEntity?.cowTypeEntity.name ?? t('No data'))}</div>
              </Col>
              <Col span={12}>
                <LabelForm>{t('Max Weight')}</LabelForm>
                <div className="font-medium text-gray-700">{(data?.cowEntity?.cowTypeEntity.maxWeight ?? t('No data'))}</div>
              </Col>
            </Row>
          </Card>

          <Card>

            <Title className="!text-2xl mb-6">{t('Illness Information')}</Title>
            <LabelForm>{t('Symptoms')}</LabelForm>
            <div className="prose mb-6" dangerouslySetInnerHTML={{ __html: data?.symptoms || t('No data') }} />
            {/* <FormItemComponent
              name="symptoms"
              label={<LabelForm>{t('Symptoms')}</LabelForm>}
              rules={[{ required: edit, message: t('Please input symptoms') }]}
            >
              {!edit ? (
                <div className="prose" dangerouslySetInnerHTML={{ __html: data?.symptoms || t('No data') }} />
              ) : (
                <ReactQuillComponent />
              )}
            </FormItemComponent> */}

            <FormItemComponent
              name="severity"
              label={<LabelForm>{t('Severity')}</LabelForm>}
              rules={[{ required: edit, message: t('Please select severity') }]}
            >
              {!edit ? (
                <div className="prose">{data?.severity || t('No data')}</div>
              ) : (
                <SelectComponent
                  options={healthSeverity}
                  placeholder={t('Select severity level')}
                />
              )}
            </FormItemComponent>


            <FormItemComponent
              name="prognosis"
              label={<LabelForm>{t('Prognosis')}</LabelForm>}
              rules={[{ required: edit, message: t('Please input prognosis') }]}
            >
              {!edit ? (
                <div className="prose" dangerouslySetInnerHTML={{ __html: data?.prognosis || t('No data') }} />
              ) : (
                <ReactQuillComponent />
              )}
            </FormItemComponent>



          </Card>

          <Card>
            <Title className="!text-2xl mb-6">{t('Date Range')}</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <FormItemComponent name="startDate" label={<LabelForm>{t('Start Date')}</LabelForm>} rules={[{ required: edit }]}>
                  {!edit ? <span className="font-medium">{dayjs(data?.startDate).format('DD/MM/YYYY')}</span> : <DatePicker className="w-full" />}
                </FormItemComponent>
              </Col>
              <Col span={12}>
                <FormItemComponent name="endDate" label={<LabelForm>{t('End Date')}</LabelForm>}
                  rules={[{ required: edit }]}>
                  {!edit ? <span className="font-medium">{dayjs(data?.endDate).format('DD/MM/YYYY')}</span> : <DatePicker className="w-full" />}
                </FormItemComponent>
              </Col>
            </Row>
          </Card>
        </div>
      </FormComponent>
    </ModalComponent>
  );
};

export default ModalViewDetail;
