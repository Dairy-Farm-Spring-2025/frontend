import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import { ModalActionProps } from '@hooks/useModal';
import { ApplicationType } from '@model/ApplicationType/applicationType';
import { APPLICATION_PATH } from '@service/api/Application/applicationApi';
import { APPLICATION_TYPE_PATH } from '@service/api/Application/applicationTypeApi';
import { Col, Form, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalComponent from '@components/Modal/ModalComponent';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import SelectComponent from '@components/Select/SelectComponent';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';

interface ModalRequestApplicationProps {
  modal: ModalActionProps;
  mutate: any;
}

const checkApplicationType = (type: string) => {
  if (type === 'Đơn xin thôi việc' || type === 'Đơn xin đi trễ ') {
    return true;
  }
  return false;
};

const ModalRequestMyApplication = ({
  modal,
  mutate,
}: ModalRequestApplicationProps) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { data: dataTypeApplication } = useFetcher<ApplicationType[]>(
    APPLICATION_TYPE_PATH.APPLICATION_TYPE,
    'GET',
    'application/json',
    modal.open
  );
  const { trigger, isLoading } = useFetcher(
    APPLICATION_PATH.APPLICATION_REQUEST,
    'POST'
  );
  const toast = useToast();
  const [selectedTypeName, setSelectedTypeName] = useState('');
  const [fromDateValue, setFromDateValue] = useState<dayjs.Dayjs | null>(null);

  useEffect(() => {
    if (modal.open) {
      form.resetFields();
      setSelectedTypeName('');
      setFromDateValue(null);
    }
  }, [modal.open]);
  const isLeaveRequest = selectedTypeName === 'Đơn xin nghỉ phép';
  const disabledToDate = (current: dayjs.Dayjs) => {
    if (!isLeaveRequest || !fromDateValue) return false;

    const minDate = fromDateValue.startOf('day');
    const maxDate = fromDateValue.add(6, 'day').endOf('day');
    return current.isBefore(minDate) || current.isAfter(maxDate);
  };
  const disabledFromDate = (current: dayjs.Dayjs) => {
    return current.isBefore(dayjs().startOf('day'));
  };
  const handleFinish = async (values: any) => {
    try {
      const payload = {
        title: values.title,
        content: values.content,
        fromDate: checkApplicationType(selectedTypeName)
          ? dayjs(values.offDate).format('YYYY-MM-DD')
          : dayjs(values.fromDate).format('YYYY-MM-DD'),
        toDate: checkApplicationType(selectedTypeName)
          ? dayjs(values.offDate).format('YYYY-MM-DD')
          : dayjs(values.toDate).format('YYYY-MM-DD'),
        typeId: values.typeId,
      };
      const response = await trigger({ body: payload });
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
      width={800}
      title={t('Request Application')}
      open={modal.open}
      onCancel={handleClose}
    >
      <FormComponent
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <FormItemComponent
          name="typeId"
          label={t('Type')}
          rules={[{ required: true }]}
        >
          <SelectComponent
            options={
              dataTypeApplication
                ? dataTypeApplication.map((element) => ({
                    label: element.name,
                    value: element.applicationId,
                  }))
                : []
            }
            onChange={(value) => {
              const selected = dataTypeApplication?.find(
                (el) => el.applicationId === value
              );
              setSelectedTypeName(selected?.name || '');
            }}
          />
        </FormItemComponent>

        {selectedTypeName !== '' && (
          <>
            <FormItemComponent
              name="title"
              label={t('Title')}
              rules={[{ required: true }]}
            >
              <InputComponent />
            </FormItemComponent>

            <FormItemComponent
              name="content"
              label={t('Content')}
              rules={[{ required: true }]}
            >
              <ReactQuillComponent />
            </FormItemComponent>

            <Row gutter={16}>
              {checkApplicationType(selectedTypeName) ? (
                <>
                  <Col span={24}>
                    <FormItemComponent
                      name="offDate"
                      label={t('Select Date')}
                      rules={[{ required: true }]}
                    >
                      <DatePickerComponent
                        onChange={(date) => setFromDateValue(date)}
                        disabledDate={disabledFromDate}
                      />
                    </FormItemComponent>
                  </Col>
                </>
              ) : (
                <>
                  <Col span={12}>
                    <FormItemComponent
                      name="fromDate"
                      label={t('From Date')}
                      rules={[{ required: true }]}
                    >
                      <DatePickerComponent
                        onChange={(date) => setFromDateValue(date)}
                        disabledDate={disabledFromDate}
                      />
                    </FormItemComponent>
                  </Col>
                  <Col span={12}>
                    <FormItemComponent
                      name="toDate"
                      label={t('To Date')}
                      rules={[{ required: true }]}
                    >
                      <DatePickerComponent disabledDate={disabledToDate} />
                    </FormItemComponent>
                  </Col>
                </>
              )}
            </Row>
          </>
        )}
      </FormComponent>
    </ModalComponent>
  );
};

export default ModalRequestMyApplication;
