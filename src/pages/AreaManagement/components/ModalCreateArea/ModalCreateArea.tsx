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

interface ModalCreateAreaProps {
  mutate: any;
  modal: any;
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
  { label: t('Milking Parlor'), value: 'milkingParlor' },
  { label: t('Warehouse'), value: 'warehouse' },
];

// Define minimum dimensions with explicit types
const minDimensions: Record<AreaType, { length: number; width: number }> = {
  cowHousing: { length: 20, width: 10 },
  milkingParlor: { length: 15, width: 8 },
  warehouse: { length: 10, width: 5 },
};

const ModalCreateArea = ({ mutate, modal }: ModalCreateAreaProps) => {
  const toast = useToast();
  const { trigger, isLoading } = useFetcher(AREA_PATH.AREA_CREATE, 'POST');
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);
  const [disabledButton, setDisabledButton] = useState(true);
  const [areaTypeSelected, setAreaTypeSelected] = useState<AreaType | null>(
    null
  );

  const validateDimensions = (
    areaType: AreaType,
    length: number,
    width: number
  ) => {
    const { length: minLength, width: minWidth } = minDimensions[areaType];
    return length >= minLength && width >= minWidth;
  };

  useEffect(() => {
    const isButtonDisabled =
      !formValues || Object.values(formValues).some((value) => !value);
    setDisabledButton(isButtonDisabled);
  }, [formValues]);

  useEffect(() => {
    const { length, width } = minDimensions[areaTypeSelected || 'cowHousing'];
    form.setFieldsValue({ width: width });
    form.setFieldsValue({ length: length });
  }, [areaTypeSelected]);

  const onFinish = async (values: any) => {
    try {
      const response = await trigger({ body: values });
      if (response.message === 'Success') {
        toast.showSuccess(response.message);
        onClose();
        mutate();
      } else {
        toast.showWarning(response.message);
      }
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const onClose = () => {
    setAreaTypeSelected(null);
    modal.closeModal();
    form.resetFields();
  };

  return (
    <div>
      <ButtonComponent onClick={modal.openModal} type="primary">
        {t('Create Area')}
      </ButtonComponent>
      <ModalComponent
        disabledButtonOk={disabledButton}
        open={modal.open}
        onOk={() => form.submit()}
        onCancel={onClose}
        title={t('Create New Area')}
        loading={isLoading}
        width={800}
        style={{ overflow: 'none' }}
      >
        <FormComponent form={form} onFinish={onFinish}>
          <FormItemComponent
            rules={[{ required: true, message: 'Area type is required' }]}
            name="areaType"
            label={<LabelForm>{t('Area Type')}:</LabelForm>}
          >
            <Select
              open={open}
              onClick={() => setOpen(!open)}
              options={areaTypes}
              onChange={(value) => setAreaTypeSelected(value)}
            />
          </FormItemComponent>
          {areaTypeSelected ? (
            <>
              <div className="flex gap-5">
                <div className="flex flex-col w-1/2">
                  <FormItemComponent
                    rules={[
                      { required: true },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          // Ensure that the value for areaType is inferred as AreaType
                          const areaType: AreaType = getFieldValue('areaType');
                          const width = getFieldValue('width');
                          if (
                            !areaType ||
                            !width ||
                            validateDimensions(areaType, value, width)
                          ) {
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
                      type="number"
                      min={1}
                      disabled={!areaTypeSelected} // Disable if no area type is selected
                      onChange={(value) => {
                        form.setFieldsValue({ length: value }); // Make sure it's a number
                      }}
                    />
                  </FormItemComponent>
                  <FormItemComponent
                    rules={[
                      { required: true },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          // Ensure that the value for areaType is inferred as AreaType
                          const areaType: AreaType = getFieldValue('areaType');
                          const length = getFieldValue('length');
                          if (
                            !areaType ||
                            !length ||
                            validateDimensions(areaType, length, value)
                          ) {
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
                      disabled={!areaTypeSelected} // Disable if no area type is selected
                      onChange={(value) => {
                        form.setFieldsValue({ width: value }); // Make sure it's a number
                      }}
                    />
                  </FormItemComponent>
                  <FormItemComponent
                    dependencies={['length']}
                    hasFeedback
                    rules={[
                      { required: true },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const penWidth = getFieldValue('penWidth');
                          if (!value || !penWidth || value >= penWidth) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              t(
                                'Pen Length must be greater than or equal to the Pen Width'
                              )
                            )
                          );
                        },
                      }),
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || value > getFieldValue('length')) {
                            return Promise.reject(
                              new Error(
                                t('Pen length must be smaller than area length')
                              )
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                    name="penLength"
                    label={<LabelForm>{t('Pen Length (m)')}:</LabelForm>}
                  >
                    <InputComponent.Number
                      min={1}
                      disabled={!areaTypeSelected}
                      onChange={(value) => {
                        form.setFieldsValue({ penLength: value });
                      }}
                    />
                  </FormItemComponent>
                  <FormItemComponent
                    dependencies={['width']}
                    hasFeedback
                    rules={[
                      { required: true },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const penLength = getFieldValue('penLength');
                          if (!value || !penLength || value <= penLength) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              t(
                                'Pen Width must be smaller than or equal to the Pen Length'
                              )
                            )
                          );
                        },
                      }),
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || value > getFieldValue('width')) {
                            return Promise.reject(
                              new Error(
                                t('Pen width must be smaller than area width')
                              )
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                    name="penWidth"
                    label={<LabelForm>{t('Pen Width (m)')}:</LabelForm>}
                  >
                    <InputComponent.Number
                      min={1}
                      disabled={!areaTypeSelected}
                      onChange={(value) => {
                        form.setFieldsValue({ penWidth: value });
                      }}
                    />
                  </FormItemComponent>
                </div>
                <div className="flex flex-col w-1/2">
                  <FormItemComponent
                    name="maxPen"
                    rules={[{ required: true }]}
                    label={<LabelForm>{t('Max pen')}:</LabelForm>}
                  >
                    <InputComponent.Number />
                  </FormItemComponent>
                  <FormItemComponent
                    name="numberInRow"
                    rules={[{ required: true }]}
                    label={<LabelForm>{t('Number in row')}:</LabelForm>}
                  >
                    <InputComponent.Number />
                  </FormItemComponent>
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
            <p
              onClick={() => setOpen(true)}
              className="text-red-600 text-lg mb-5 font-semibold cursor-pointer !w-fit hover:opacity-65 duration-200"
            >
              {t('Please choose area type first')}
            </p>
          )}
        </FormComponent>
        <Divider />
        <div className="mb-4 text-sm text-gray-700">
          <p className="font-semibold">{t('Note')}:</p>
          <p>
            {t(
              'The minimum dimensions required for each area type are as follows'
            )}
            :
          </p>
          <ul className="list-disc pl-5">
            <li>
              <span className="font-medium">{t('Cow Housing')}:</span>{' '}
              {t('Minimum length 20m, minimum width 10m')}
            </li>
            <li>
              <span className="font-medium">{t('Milking Parlor')}:</span>{' '}
              {t('Minimum length 15m, minimum width 8m')}
            </li>
            <li>
              <span className="font-medium">{t('Warehouse')}:</span>{' '}
              {t('Minimum length 10m, minimum width 5m')}
            </li>
          </ul>
          <p>
            {t(
              'Ensure that the dimensions you enter meet or exceed the minimum requirements for the selected area type.'
            )}
          </p>
          <p className="mt-2 text-blue-600">
            <strong>{t('Tip')}:</strong>{' '}
            {t(
              'You can refer to the required dimensions when filling in the length and width.'
            )}
          </p>
        </div>
      </ModalComponent>
    </div>
  );
};

export default ModalCreateArea;
