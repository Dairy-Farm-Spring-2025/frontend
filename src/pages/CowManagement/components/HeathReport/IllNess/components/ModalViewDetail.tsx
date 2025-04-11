import ButtonComponent from '@components/Button/ButtonComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import SelectComponent from '@components/Select/SelectComponent';
import Title from '@components/UI/Title';
import { setModalCreate } from '@core/store/slice/taskModalSlice';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { Health } from '@model/Cow/HealthReport';
import { HEALTH_RECORD_PATH } from '@service/api/HealthRecord/healthRecordApi';
import { healthSeverity } from '@service/data/health';
import { formatAreaType } from '@utils/format';
import { Card, Col, Divider, Form, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface ModalViewDetailProps {
  modal: any;
  mutate: any;
  id: string;
}

const ModalViewDetail = ({ modal, mutate, id }: ModalViewDetailProps) => {
  const [form] = Form.useForm();
  const toast = useToast();
  const dispatch = useDispatch();
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
  const navigate = useNavigate();

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

  const handleNavigate = () => {
    dispatch(setModalCreate(true));
    navigate('/dairy/task-management/list');
  };

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
    >
      <FormComponent form={form} onFinish={handleFinish} layout="vertical">
        <div className="p-6 space-y-6">
          {/* Cow Information */}
          {data?.illnessStatus === 'pending' && (
            <div className="flex justify-end">
              <ButtonComponent
                type="primary"
                buttonType="warning"
                className="!text-base"
                onClick={handleNavigate}
              >
                {t('Move to create task')}
              </ButtonComponent>
            </div>
          )}
          <Card>
            <Title className="!text-2xl mb-6">{t('Cow Information')}</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <LabelForm>{t('Cow Name')}</LabelForm>
                <div className="font-medium text-gray-700">
                  {data?.cowEntity?.name || t('No data')}
                </div>
              </Col>
              <Col span={12}>
                <LabelForm>{t('Cow Status')}</LabelForm>
                <div className="font-medium text-gray-700">
                  {formatAreaType(data?.cowEntity?.cowStatus ?? t('No data'))}
                </div>
              </Col>
              <Col span={12}>
                <LabelForm>{t('Cow Origin')}</LabelForm>
                <div className="font-medium text-gray-700">
                  {formatAreaType(data?.cowEntity?.cowOrigin ?? t('No data'))}
                </div>
              </Col>
              <Col span={12}>
                <LabelForm>{t('Gender')}</LabelForm>
                <div className="font-medium text-gray-700">
                  {formatAreaType(data?.cowEntity?.gender ?? t('No data'))}
                </div>
              </Col>
              <Col span={12}>
                <LabelForm>{t('Cow Type')}</LabelForm>
                <div className="font-medium text-gray-700">
                  {formatAreaType(
                    data?.cowEntity?.cowTypeEntity.name ?? t('No data')
                  )}
                </div>
              </Col>
              <Col span={12}>
                <LabelForm>{t('Max Weight')}</LabelForm>
                <div className="font-medium text-gray-700">
                  {data?.cowEntity?.cowTypeEntity.maxWeight ?? t('No data')}
                </div>
              </Col>
            </Row>
          </Card>

          {/* Illness Information (Including Illness Details) */}
          <Card>
            <Title className="!text-2xl mb-6">{t('Illness Information')}</Title>
            <LabelForm>{t('Symptoms')}</LabelForm>
            <div
              className="prose mb-6"
              dangerouslySetInnerHTML={{
                __html: data?.symptoms || t('No data'),
              }}
            />

            <FormItemComponent
              name="severity"
              label={<LabelForm>{t('Severity')}</LabelForm>}
              rules={[{ required: edit, message: t('Please select severity') }]}
            >
              {!edit ? (
                <div className="prose">{data?.severity || t('No data')}</div>
              ) : (
                <SelectComponent
                  options={healthSeverity()}
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
                <div
                  className="prose mb-6"
                  dangerouslySetInnerHTML={{
                    __html: data?.prognosis || t('No data'),
                  }}
                />
              ) : (
                <ReactQuillComponent />
              )}
            </FormItemComponent>
            {/* Illness Details Section */}
            <Divider />
            <Title className="!text-xl mb-4">{t('Illness Details')}</Title>
            {data?.illnessDetails && data.illnessDetails.length > 0 ? (
              data.illnessDetails.map((detail, index) => (
                <div key={detail.illnessDetailId} className="mb-6">
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <LabelForm>{t('Date')}</LabelForm>
                      <div className="font-medium text-gray-700">
                        {detail.date
                          ? dayjs(detail.date).format('DD/MM/YYYY')
                          : t('No data')}
                      </div>
                    </Col>
                    <Col span={12}>
                      <LabelForm>{t('Description')}</LabelForm>
                      <div
                        className="prose mb-6"
                        dangerouslySetInnerHTML={{
                          __html: detail.description || t('No data'),
                        }}
                      />
                    </Col>
                    <Col span={12}>
                      <LabelForm>{t('Dosage')}</LabelForm>
                      <div className="font-medium text-gray-700">
                        {detail.dosage ? `${detail.dosage}` : t('No data')}
                      </div>
                    </Col>
                    <Col span={12}>
                      <LabelForm>{t('Injection Site')}</LabelForm>
                      <div className="font-medium text-gray-700">
                        {formatAreaType(detail.injectionSite ?? t('No data'))}
                      </div>
                    </Col>
                    <Col span={12}>
                      <LabelForm>{t('Status')}</LabelForm>
                      <div className="font-medium text-gray-700">
                        {formatAreaType(detail.status ?? t('No data'))}
                      </div>
                    </Col>
                    <Col span={12}>
                      <LabelForm>{t('Vaccine Name')}</LabelForm>
                      <div className="font-medium text-gray-700">
                        {detail.vaccine?.name || t('No data')}
                      </div>
                    </Col>
                    <Col span={12}>
                      <LabelForm>{t('Veterinarian')}</LabelForm>
                      <div className="font-medium text-gray-700">
                        {detail.veterinarian?.name || t('No data')}
                      </div>
                    </Col>
                  </Row>
                  {index < data.illnessDetails.length - 1 && <Divider />}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center">
                {t('No illness details available')}
              </div>
            )}
          </Card>

          {/* Date Range */}
          <Card>
            <Title className="!text-2xl mb-6">{t('Date Range')}</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <LabelForm>{t('Start Date')}</LabelForm>
                <div className="prose mb-6" />
                {data?.startDate || t('N/A')}
              </Col>
              <Col span={12}>
                <LabelForm>{t('End Date')}</LabelForm>
                <div className="prose mb-6" />
                {data?.endDate || t('N/A')}
              </Col>
            </Row>
          </Card>
        </div>
      </FormComponent>
    </ModalComponent>
  );
};

export default ModalViewDetail;
