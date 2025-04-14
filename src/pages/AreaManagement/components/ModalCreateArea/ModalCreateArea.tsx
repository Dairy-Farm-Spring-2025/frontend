import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { Divider, Form, Input, Select } from 'antd';
import ButtonComponent from '@components/Button/ButtonComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import { AreaType } from '@model/Area/AreaType';
import { AREA_PATH } from '@service/api/Area/areaApi';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import { cowStatus } from '@service/data/cowStatus';
import { COW_TYPE_PATH } from '@service/api/CowType/cowType';
import { CowType } from '@model/Cow/CowType';

interface ModalCreateAreaProps {
  mutate: any;
  modal: { open: boolean; openModal: () => void; closeModal: () => void };
}

const validateInput = (_: any, value: string) => {
  const regex = /^[A-Z]+-area-[0-9]+$/;
  if (!value) {
    return Promise.reject('Please input the value!');
  }
  if (!regex.test(value)) {
    return Promise.reject(
      'Input does not match the required format (A-Z)-area-(1-0), eg: ABC-area-123'
    );
  }
  return Promise.resolve();
};

const areaTypes: { label: string; value: AreaType }[] = [
  { label: t('Cow Housing'), value: 'cowHousing' },

  { label: t('Quarantine'), value: 'quarantine' },
];

const minDimensions: Record<AreaType, { length: number; width: number }> = {
  cowHousing: { length: 20, width: 10 },
  quarantine: { length: 20, width: 10 }
};

const ModalCreateArea = ({ mutate, modal }: ModalCreateAreaProps) => {
  const toast = useToast();
  const { trigger, isLoading } = useFetcher(AREA_PATH.AREA_CREATE, 'POST');
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);
  const [disabledButton, setDisabledButton] = useState(true);
  const [areaTypeSelected, setAreaTypeSelected] = useState<AreaType | null>(null);
  const { data: cowTypesData } = useFetcher<CowType[]>(COW_TYPE_PATH.COW_TYPES, 'GET');

  const cowTypeOptions = cowTypesData?.map((cowType) => ({
    label: cowType.name,
    value: cowType.cowTypeId,
  })) || [];

  const validateDimensions = (areaType: AreaType, length: number, width: number) => {
    const { length: minLength, width: minWidth } = minDimensions[areaType];
    return length >= minLength && width >= minWidth;
  };

  useEffect(() => {
    console.log('Modal open state:', modal.open); // Debug log
    if (modal.open) {
      form.resetFields();
      setAreaTypeSelected(null);
      setDisabledButton(true);
    }
  }, [modal.open, form]);

  useEffect(() => {
    const isButtonDisabled = !formValues || Object.values(formValues).some((value) => !value);
    setDisabledButton(isButtonDisabled);
  }, [formValues]);

  useEffect(() => {
    if (areaTypeSelected) {
      const { length, width } = minDimensions[areaTypeSelected];
      form.setFieldsValue({ length, width });
    }
  }, [areaTypeSelected, form]);

  const onFinish = async (values: any) => {
    console.log('onFinish called with values:', values); // Debug log
    try {
      const response = await trigger({ body: values }); // Send payload as-is
      console.log('API Response:', response); // Debug log
      // Updated success condition
      if (response.message === 'Create successfully!' || response.code === 200) {
        toast.showSuccess(response.message || 'Area created successfully');
        console.log('Mutating data'); // Debug log
        mutate();
        console.log('Calling modal.closeModal()'); // Debug log
        modal.closeModal();
        console.log('Modal open state after closeModal:', modal.open); // Debug log
      } else {
        console.log('API response not successful:', response); // Debug log
        toast.showWarning(response.message || 'Failed to create area');
      }
    } catch (error: any) {
      console.error('Error creating area:', error); // Debug log
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 'Invalid request format';
        toast.showError(`Failed to create area: ${errorMessage}`);
      } else {
        toast.showError(error.message || 'An error occurred');
      }
    }
  };

  const onCancel = () => {
    console.log('Cancel modal'); // Debug log
    form.resetFields();
    setAreaTypeSelected(null);
    modal.closeModal();
    console.log('Modal open state after cancel:', modal.open); // Debug log
  };

  return (
    <div>
      <ButtonComponent
        onClick={() => {
          console.log('Opening modal'); // Debug log
          modal.openModal();
        }}
        type="primary"
      >
        {t('Create Area')}
      </ButtonComponent>
      <ModalComponent
        open={modal.open}
        onOk={() => {
          console.log('Submitting form'); // Debug log
          form.submit();
        }}
        onCancel={onCancel}
        title={t('Create New Area')}
        loading={isLoading}
        disabledButtonOk={disabledButton}
        width={800}
        style={{ overflow: 'none' }}
      >
        <FormComponent form={form} onFinish={onFinish}>
          <FormItemComponent
            rules={[{ required: true, message: t('Area Type is required') }]}
            name="areaType"
            label={<LabelForm>{t('Area Type')}:</LabelForm>}
          >
            <Select
              options={areaTypes}
              onChange={(value) => setAreaTypeSelected(value)}
              placeholder={t('Select Area Type')}
            />
          </FormItemComponent>
          {areaTypeSelected ? (
            <>
              <div className="flex gap-5">
                <div className="flex flex-col w-1/2">
                  <FormItemComponent
                    rules={[
                      { required: true, message: t('Length is required') },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const areaType: AreaType = getFieldValue('areaType');
                          const width = getFieldValue('width');
                          if (!areaType || !width || validateDimensions(areaType, value, width)) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              t(`area_modal.minimum_length_area`, {
                                length: minDimensions[areaType].length,
                              })
                            )
                          );
                        },
                      }),
                    ]}
                    name="length"
                    label={<LabelForm>{t('Length (m)')}:</LabelForm>}
                  >
                    <InputComponent.Number
                      min={1}
                      disabled={!areaTypeSelected}
                    />
                  </FormItemComponent>
                  <FormItemComponent
                    rules={[
                      { required: true, message: t('Width is required') },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const areaType: AreaType = getFieldValue('areaType');
                          const length = getFieldValue('length');
                          if (!areaType || !length || validateDimensions(areaType, length, value)) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              t(`area_modal.minimun_width_area`, {
                                width: minDimensions[areaType].width,
                              })
                            )
                          );
                        },
                      }),
                    ]}
                    name="width"
                    label={<LabelForm>{t('Width (m)')}:</LabelForm>}
                  >
                    <InputComponent.Number
                      min={1}
                      disabled={!areaTypeSelected}
                    />
                  </FormItemComponent>
                  <FormItemComponent
                    dependencies={['length']}
                    hasFeedback
                    rules={[
                      { required: true, message: t('Pen Length is required') },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const penWidth = getFieldValue('penWidth');
                          if (!value || !penWidth || value >= penWidth) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              t('Pen Length must be greater than or equal to the Pen Width')
                            )
                          );
                        },
                      }),
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || value <= getFieldValue('length')) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              t('Pen length must be smaller than area length')
                            )
                          );
                        },
                      }),
                    ]}
                    name="penLength"
                    label={<LabelForm>{t('Pen Length (m)')}:</LabelForm>}
                  >
                    <InputComponent.Number
                      min={1}
                      disabled={!areaTypeSelected}
                    />
                  </FormItemComponent>
                  <FormItemComponent
                    dependencies={['width']}
                    hasFeedback
                    rules={[
                      { required: true, message: t('Pen Width is required') },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const penLength = getFieldValue('penLength');
                          if (!value || !penLength || value <= penLength) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              t('Pen Width must be smaller than or equal to the Pen Length')
                            )
                          );
                        },
                      }),
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || value <= getFieldValue('width')) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              t('Pen width must be smaller than area width')
                            )
                          );
                        },
                      }),
                    ]}
                    name="penWidth"
                    label={<LabelForm>{t('Pen Width (m)')}:</LabelForm>}
                  >
                    <InputComponent.Number
                      min={1}
                      disabled={!areaTypeSelected}
                    />
                  </FormItemComponent>
                </div>
                <div className="flex flex-col w-1/2">
                  <FormItemComponent
                    name="maxPen"
                    rules={[{ required: true, message: t('Max pen is required') }]}
                    label={<LabelForm>{t('Max pen')}:</LabelForm>}
                  >
                    <InputComponent.Number min={1} />
                  </FormItemComponent>
                  <FormItemComponent
                    name="numberInRow"
                    rules={[{ required: true, message: t('Number in row is required') }]}
                    label={<LabelForm>{t('Number in row')}:</LabelForm>}
                  >
                    <InputComponent.Number min={1} />
                  </FormItemComponent>
                  {areaTypeSelected !== 'quarantine' && (
                    <>
                      <FormItemComponent
                        rules={[{ required: true, message: t('Cow Status is required') }]}
                        name="cowStatus"
                        label={<LabelForm>{t('Cow Status')}:</LabelForm>}
                      >
                        <Select
                          options={cowStatus()}
                          placeholder={t('Select Cow Status')}
                        />
                      </FormItemComponent>
                      <FormItemComponent
                        rules={[{ required: true, message: t('Cow Type is required') }]}
                        name="cowTypeId"
                        label={<LabelForm>{t('Cow Type')}:</LabelForm>}
                      >
                        <Select
                          options={cowTypeOptions}
                          placeholder={t('Select Cow Type')}
                        />
                      </FormItemComponent>
                    </>
                  )}
                </div>
              </div>
              <FormItemComponent
                rules={[
                  { required: true, message: t('Name is required') },
                  { validator: validateInput },
                ]}
                name="name"
                label={<LabelForm>{t('Name')}:</LabelForm>}
              >
                <Input />
              </FormItemComponent>
              <FormItemComponent
                rules={[
                  { required: true, message: t('Description is required') },
                ]}
                name="description"
                label={<LabelForm>{t('Description')}:</LabelForm>}
              >
                <ReactQuillComponent style={{ height: 80 }} />
              </FormItemComponent>
            </>
          ) : (
            <p className="text-red-600 text-lg mb-5 font-semibold">
              {t('Please choose area type first')}
            </p>
          )}
        </FormComponent>
        <Divider />
        <div className="mb-4 text-sm text-gray-700">
          <p className="font-semibold">{t('Note')}:</p>
          <p>{t('The minimum dimensions required for each area type are as follows')}:</p>
          <ul className="list-disc pl-5">
            <li>
              <span className="font-medium">{t('Cow Housing')}:</span>{' '}
              {t('Minimum length 20m, minimum width 10m')}
            </li>

            <li>
              <span className="font-medium">{t('Quarantine')}:</span>{' '}
              {t('Minimum length 20m, minimum width 10m')}
            </li>
          </ul>
          <p>
            {t(
              'Ensure that the dimensions you enter meet or exceed the minimum requirements for the selected area type.'
            )}
          </p>
          <p className="mt-2 text-blue-600">
            <strong>{t('Tip')}:</strong>{' '}
            {t('You can refer to the required dimensions when filling in the length and width.')}
          </p>
        </div>
      </ModalComponent>
    </div>
  );
};

export default ModalCreateArea;