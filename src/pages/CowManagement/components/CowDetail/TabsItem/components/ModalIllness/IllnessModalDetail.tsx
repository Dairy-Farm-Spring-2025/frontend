import { Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import FormComponent from '../../../../../../../components/Form/FormComponent';
import DateRangeItem from '../../../../../../../components/Form/Item/DateRangeItem/DateRangeItem';
import FormItemComponent from '../../../../../../../components/Form/Item/FormItemComponent';
import LabelForm from '../../../../../../../components/LabelForm/LabelForm';
import ModalComponent from '../../../../../../../components/Modal/ModalComponent';
import ReactQuillComponent from '../../../../../../../components/ReactQuill/ReactQuillComponent';
import SelectComponent from '../../../../../../../components/Select/SelectComponent';
import { IllnessCow } from '../../../../../../../model/Cow/Illness';
import { SEVERITY_OPTIONS } from '../../../../../../../service/data/severity';
import useFetcher from '../../../../../../../hooks/useFetcher';
import useToast from '../../../../../../../hooks/useToast';

interface IllnessModalDetailProps {
  modal: any;
  data: any;
  mutate: any;
}
const IllnessModalDetail = ({
  modal,
  data,
  mutate,
}: IllnessModalDetailProps) => {
  const [form] = Form.useForm();
  const [detailData, setDetailData] = useState<IllnessCow>();
  const toast = useToast();
  const { trigger: triggerUpdate, isLoading: isLoadingUpdate } = useFetcher(
    `illness`,
    'PUT'
  );
  useEffect(() => {
    if (data && modal.open) {
      setDetailData({
        illnessId: data?.id,
        cowEntity: data?.extendedProps?.cow,
        endDate: data?.extendedProps?.endDate,
        startDate: data?.extendedProps?.startDate,
        prognosis: data?.extendedProps?.prognosis,
        severity: data?.extendedProps?.severity,
        symptoms: data?.extendedProps?.symptoms,
        userEntity: data?.extendedProps?.user,
        veterinarian: data?.extendedProps?.veterinarian,
      });
    }
  }, [data, modal.open]);
  useEffect(() => {
    if (detailData) {
      form.setFieldsValue({
        severity: detailData?.severity,
        startDate: detailData?.startDate ? dayjs(detailData.startDate) : null,
        endDate: detailData?.endDate ? dayjs(detailData.endDate) : null,
        symptoms: detailData?.symptoms,
        prognosis: detailData?.prognosis,
      });
    }
  }, [detailData, form]);

  const handleCancel = async () => {
    form.resetFields();
    setDetailData(undefined);
    modal.closeModal();
  };

  const onFinish = async (values: any) => {
    try {
      const payload = {
        symptoms: values.symptoms,
        severity: values.severity,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
        prognosis: values.prognosis,
        cowId: detailData?.cowEntity?.cowId,
      };
      const response = await triggerUpdate({
        url: `illness/${detailData?.illnessId}`,
        body: payload,
      });
      toast.showSuccess(response.message);
      mutate();
      handleCancel();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  return (
    <ModalComponent
      title="Illness Detail"
      open={modal.open}
      onCancel={handleCancel}
      width={1700}
      loading={isLoadingUpdate}
      onOk={form.submit}
    >
      <div></div>
      <FormComponent form={form} onFinish={onFinish}>
        <div className="flex gap-5 w-full">
          <div className="w-1/5">
            <FormItemComponent
              rules={[{ required: true }]}
              name="severity"
              label={<LabelForm>Severity</LabelForm>}
            >
              <SelectComponent options={SEVERITY_OPTIONS} />
            </FormItemComponent>
            <DateRangeItem />
          </div>
          <div className="w-2/5">
            <FormItemComponent
              rules={[{ required: true }]}
              name="symptoms"
              label={<LabelForm>Symptoms</LabelForm>}
            >
              <ReactQuillComponent />
            </FormItemComponent>
          </div>
          <div className="w-2/5">
            <FormItemComponent
              rules={[{ required: true }]}
              name="prognosis"
              label={<LabelForm>Prognosis</LabelForm>}
            >
              <ReactQuillComponent />
            </FormItemComponent>
          </div>
        </div>
      </FormComponent>
    </ModalComponent>
  );
};

export default IllnessModalDetail;
