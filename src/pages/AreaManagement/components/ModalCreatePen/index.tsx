import { Form, Input, Select, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import CardComponent from '@components/Card/CardComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { Area } from '@model/Area';
import { Pen } from '@model/Pen';
import { penStatus, penType } from '@service/data/pen';
import { formatAreaType, validateInput } from '@utils/format';

interface ModalCreatePenProps {
  mutate: any;
  modal: any;
  areaId: any;
  mutatePen: any;
}

const ModalCreatePen = ({
  mutate,
  modal,
  areaId,
  mutatePen,
}: ModalCreatePenProps) => {
  const toast = useToast();
  const { trigger: TriggerPost, isLoading } = useFetcher('pens/create', 'POST');
  const { data, isLoading: isAreasLoading } = useFetcher<Area>(
    `areas/${areaId}`,
    'GET'
  );
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = async (values: Pen) => {
    try {
      const payload = {
        ...values,
        areaId: areaId,
      };
      const response = await TriggerPost({ body: payload });
      toast.showSuccess(response.message);
      mutatePen();
      mutate();
      onClose();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const onClose = () => {
    modal.closeModal();
    form.resetFields();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '48%' }}>
        <ModalComponent
          open={modal.open}
          onOk={() => form.submit()}
          onCancel={onClose}
          title={t('Create New Pen')}
          loading={isLoading}
          footer={isLoading ? <Spin tip="Submitting..." /> : null}
          width={800}
        >
          {isAreasLoading ? (
            <Spin tip="Loading areas..." />
          ) : (
            <FormComponent form={form} onFinish={onFinish} layout="vertical">
              <FormItemComponent name="id" hidden>
                <Input />
              </FormItemComponent>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-x-5 w-full">
                  <FormItemComponent
                    className="col-span-3"
                    name="name"
                    label={<LabelForm>{t('Pen Name')}:</LabelForm>}
                    rules={[{ required: true }, { validator: validateInput }]}
                  >
                    <Input placeholder="Enter pen name , eg: ABC-Pen-123 " />
                  </FormItemComponent>

                  <FormItemComponent
                    name="penType"
                    label={<LabelForm>{t('Pen Type')}:</LabelForm>}
                    rules={[{ required: true }]}
                  >
                    <Select options={penType} placeholder="Select pen type" />
                  </FormItemComponent>

                  <FormItemComponent
                    name="penStatus"
                    label={<LabelForm>{t('Status')}:</LabelForm>}
                    rules={[
                      { required: true, message: 'Please select a status' },
                    ]}
                  >
                    <Select options={penStatus} placeholder="Select status" />
                  </FormItemComponent>
                </div>

                {data && (
                  <CardComponent
                    title={t('Area Details')}
                    className="my-2 !w-1/3"
                  >
                    <div className="flex flex-col gap-2">
                      <p>
                        <strong>{t('Dimensions')}:</strong> {data?.length} x{' '}
                        {data?.width} m
                      </p>
                      <p>
                        <strong>{t('Type')}:</strong>{' '}
                        {formatAreaType(data?.areaType)}
                      </p>
                      <p>
                        <strong>{t('Description')}:</strong> {data?.description}
                      </p>
                    </div>
                  </CardComponent>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <FormItemComponent
                  name="description"
                  label={<LabelForm>{t('Description')}:</LabelForm>}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter a description',
                    },
                  ]}
                >
                  <ReactQuillComponent />
                </FormItemComponent>
              </div>
            </FormComponent>
          )}
        </ModalComponent>
      </div>
    </div>
  );
};

export default ModalCreatePen;
