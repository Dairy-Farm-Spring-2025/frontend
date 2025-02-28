import { Card, Form, Input, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import FormComponent from '../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../components/Form/Item/FormItemComponent';
import LabelForm from '../../../../components/LabelForm/LabelForm';
import ModalComponent from '../../../../components/Modal/ModalComponent';
import useFetcher from '../../../../hooks/useFetcher';
import useToast from '../../../../hooks/useToast';
import { Area } from '../../../../model/Area';
import { Pen } from '../../../../model/Pen';
import { penStatus, penType } from '../../../../service/data/pen';
import QuillRender from '../../../../components/UI/QuillRender';
import ButtonComponent from '../../../../components/Button/ButtonComponent';
import { useTranslation } from 'react-i18next';
import Text from '../../../../components/UI/Text';
import { formatStatusWithCamel } from '../../../../utils/format';
import ReactQuillComponent from '../../../../components/ReactQuill/ReactQuillComponent';

interface ModalTypesProps {
  mutate: any;
  modal: any;
  id: number;
}

const ModalEditPens = ({ mutate, modal, id }: ModalTypesProps) => {
  const toast = useToast();
  const { t } = useTranslation();
  const [showEdit, setShowEdit] = useState(false);
  const { data: dataPen } = useFetcher<Pen>(`pens/${id}`, 'GET');
  const { data: dataArea, isLoading: isAreasLoading } = useFetcher<Area[]>(
    'areas',
    'GET'
  );
  const [selectedAreaDetails, setSelectedAreaDetails] = useState<Area | null>(
    null
  );
  const { isLoading: isLoadingEdit, trigger } = useFetcher<any>(
    `pens/${id}`,
    'PUT'
  );
  const [form] = Form.useForm();

  const areas = dataArea
    ? dataArea.map((area) => ({
        label: area.name,
        value: area.areaId,
      }))
    : [];
  useEffect(() => {
    if (id && modal.open) {
      form.setFieldsValue({
        name: dataPen?.name,

        description: dataPen?.description,
        penType: dataPen?.penType,

        length: dataPen?.length,
        width: dataPen?.width,
        penStatus: dataPen?.penStatus,
        areaId: dataPen?.area?.areaId,
      });
    }
  }, [
    dataPen?.description,
    dataPen?.name,
    dataPen?.penStatus,
    dataPen?.penType,
    form,
    id,
    modal.open,
    dataPen?.area?.areaId,
    dataPen?.length,
    dataPen?.width,
  ]);

  const onFinish = async (values: Pen) => {
    try {
      const response = await trigger({ body: values });
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
    setShowEdit(false);
    setSelectedAreaDetails(null);
  };
  return (
    <div>
      <ModalComponent
        open={modal.open}
        onCancel={onClose}
        title="Edit Pen"
        loading={isLoadingEdit}
        width={800}
        footer={[]}
      >
        {isAreasLoading ? (
          <Spin tip="Loading areas..." />
        ) : (
          <FormComponent form={form} onFinish={onFinish} layout="vertical">
            <FormItemComponent name="id" hidden>
              <Input />
            </FormItemComponent>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-x-4 w-full">
                <FormItemComponent
                  className="col-span-3"
                  name="name"
                  label={<LabelForm>Pen Name:</LabelForm>}
                  rules={[
                    { required: true, message: 'Please enter the pen name' },
                  ]}
                >
                  {!showEdit ? (
                    <Text className="px-3">{dataPen?.name}</Text>
                  ) : (
                    <Input placeholder="Enter pen name" />
                  )}
                </FormItemComponent>
                <FormItemComponent
                  name="areaId"
                  label={<LabelForm>Area:</LabelForm>}
                  rules={[{ required: true, message: 'Please select an area' }]}
                >
                  {!showEdit ? (
                    <Text className="px-3">{dataPen?.area?.name}</Text>
                  ) : (
                    <Select
                      options={areas}
                      placeholder="Select area"
                      onChange={(areaId) =>
                        setSelectedAreaDetails(
                          dataArea?.find((area) => area.areaId === areaId) ||
                            null
                        )
                      }
                    />
                  )}
                </FormItemComponent>

                <FormItemComponent
                  name="penType"
                  label={<LabelForm>Pen Type:</LabelForm>}
                  rules={[
                    { required: true, message: 'Please select a pen type' },
                  ]}
                >
                  {!showEdit ? (
                    <Text className="px-3">
                      {formatStatusWithCamel(dataPen?.penType as string)}
                    </Text>
                  ) : (
                    <Select options={penType} placeholder="Select pen type" />
                  )}
                </FormItemComponent>

                <FormItemComponent
                  name="penStatus"
                  label={<LabelForm>Status:</LabelForm>}
                  rules={[
                    { required: true, message: 'Please select a status' },
                  ]}
                >
                  {!showEdit ? (
                    <Text className="px-3">
                      {formatStatusWithCamel(dataPen?.penStatus as string)}
                    </Text>
                  ) : (
                    <Select options={penStatus} placeholder="Select status" />
                  )}
                </FormItemComponent>
              </div>

              {selectedAreaDetails && (
                <Card
                  className="area-details"
                  title="Area Details"
                  bordered={true}
                  style={{ backgroundColor: '#f7f7f7' }}
                >
                  <div>
                    <p className="dimensions">
                      <strong>Dimensions:</strong> {selectedAreaDetails.length}{' '}
                      x {selectedAreaDetails.width} m
                    </p>
                    <p className="type">
                      <strong>Type:</strong> {selectedAreaDetails.areaType}
                    </p>
                    <p className="description">
                      <strong>Description:</strong>{' '}
                      {selectedAreaDetails.description}
                    </p>
                  </div>
                </Card>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid gap-5 w-full">
                <FormItemComponent
                  name="description"
                  label={<LabelForm>Description:</LabelForm>}
                  rules={[
                    { required: true, message: 'Please enter a description' },
                  ]}
                >
                  {!showEdit ? (
                    <div className="px-3">
                      <QuillRender
                        description={dataPen?.description as string}
                      />
                    </div>
                  ) : (
                    <ReactQuillComponent />
                  )}
                </FormItemComponent>
              </div>
            </div>
            <div className="w-full flex justify-end gap-5">
              <ButtonComponent
                onClick={() => setShowEdit(!showEdit)}
                colorButton="orange"
                className="!text-white"
              >
                {showEdit ? 'Cancel' : 'Edit'}
              </ButtonComponent>
              {showEdit && (
                <ButtonComponent htmlType="submit" type="primary">
                  {t('Submit')}
                </ButtonComponent>
              )}
            </div>
          </FormComponent>
        )}
      </ModalComponent>
    </div>
  );
};

export default ModalEditPens;
