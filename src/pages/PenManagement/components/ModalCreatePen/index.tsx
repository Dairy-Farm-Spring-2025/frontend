import { Form, Input, Select, Spin } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonComponent from '../../../../components/Button/ButtonComponent';
import CardComponent from '../../../../components/Card/CardComponent';
import FormComponent from '../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../components/Form/Item/FormItemComponent';
import LabelForm from '../../../../components/LabelForm/LabelForm';
import ModalComponent from '../../../../components/Modal/ModalComponent';
import ReactQuillComponent from '../../../../components/ReactQuill/ReactQuillComponent';
import useFetcher from '../../../../hooks/useFetcher';
import useToast from '../../../../hooks/useToast';
import { Area } from '../../../../model/Area';
import { Pen } from '../../../../model/Pen';
import { penStatus, penType } from '../../../../service/data/pen';
import { formatAreaType, validateInput } from '../../../../utils/format';

interface ModalCreatePenProps {
  mutate: any;
  modal: any;
}

const ModalCreatePen = ({ mutate, modal }: ModalCreatePenProps) => {
  const toast = useToast();
  const { trigger: TriggerPost, isLoading } = useFetcher('pens/create', 'POST');
  const { data, isLoading: isAreasLoading } = useFetcher<Area[]>(
    'areas',
    'GET'
  );
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [selectedAreaDetails, setSelectedAreaDetails] = useState<Area | null>(
    null
  );

  const areas = data
    ? data.map((area) => ({
        label: area.name,
        value: area.areaId,
      }))
    : [];

  const onFinish = async (values: Pen) => {
    try {
      const response = await TriggerPost({ body: values });
      toast.showSuccess(response.message);
      onClose();
    } catch (error: any) {
      toast.showError(error.message);
    } finally {
      mutate();
    }
  };

  const onClose = () => {
    modal.closeModal();
    setSelectedAreaDetails(null);
    form.resetFields();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '48%' }}>
        <ButtonComponent onClick={modal.openModal} type="primary">
          {t('Create New Pen')}
        </ButtonComponent>

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
                    name="areaId"
                    label={<LabelForm>{t('Area')}:</LabelForm>}
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={areas}
                      placeholder="Select area"
                      onChange={(areaId) =>
                        setSelectedAreaDetails(
                          data?.find((area) => area.areaId === areaId) || null
                        )
                      }
                    />
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

                {selectedAreaDetails && (
                  <CardComponent
                    title={t('Area Details')}
                    className="my-2 !w-1/3"
                  >
                    <div className="flex flex-col gap-2">
                      <p>
                        <strong>{t('Dimensions')}:</strong>{' '}
                        {selectedAreaDetails.length} x{' '}
                        {selectedAreaDetails.width} m
                      </p>
                      <p>
                        <strong>{t('Type')}:</strong>{' '}
                        {formatAreaType(selectedAreaDetails.areaType)}
                      </p>
                      <p>
                        <strong>{t('Description')}:</strong>{' '}
                        {selectedAreaDetails.description}
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
