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
import { minDimensions } from '@utils/validate/minDimesionArea';

interface ModalCreateAreaProps {
  mutate: any;
  modal: { open: boolean; openModal: () => void; closeModal: () => void };
}

const validateInput = (_: any, value: string) => {
  const regex = /^[A-Z]+-area-[0-9]+$/;
  if (!regex.test(value)) {
    return Promise.reject(
      t('Input does not match the required format (A-Z)-area-(1-0), eg: ABC-area-123')
    );
  }
  return Promise.resolve();
};

const areaTypes: { label: string; value: AreaType }[] = [
  { label: t('Cow Housing'), value: 'cowHousing' },
  { label: t('Quarantine'), value: 'quarantine' },
];

const ModalCreateArea = ({ mutate, modal }: ModalCreateAreaProps) => {
  const toast = useToast();
  const { trigger, isLoading } = useFetcher(AREA_PATH.AREA_CREATE, 'POST');
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);
  const formAreaLength = Form.useWatch(['length'], form);
  const formAreaWidth = Form.useWatch(['width'], form);
  const formAreaPenLength = Form.useWatch(['penLength'], form);
  const formAreaPenWidth = Form.useWatch(['penWidth'], form);
  const [numberInRowSuggested, setNumberInRowSuggested] = useState<number>(0);
  const [disabledButton, setDisabledButton] = useState(true);
  const [areaTypeSelected, setAreaTypeSelected] = useState<AreaType | null>(null);
  const { data: cowTypesData } = useFetcher<CowType[]>(COW_TYPE_PATH.COW_TYPES, 'GET');

  const cowTypeOptions =
    cowTypesData?.map((cowType) => ({
      label: cowType.name,
      value: cowType.cowTypeId,
    })) || [];

  const validateDimensions = (areaType: AreaType, length: number, width: number) => {
    const { length: minLength, width: minWidth } = minDimensions[areaType];
    return length >= minLength && width >= minWidth;
  };

  useEffect(() => {
    if (modal.open) {
      form.resetFields();
      setAreaTypeSelected(null);
      setDisabledButton(true);
      setNumberInRowSuggested(0);
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
    try {
      const response = await trigger({ body: values });
      if (response.message === 'Create successfully!' || response.code === 200) {
        toast.showSuccess(response.message || t('Area created successfully'));
        mutate();
        modal.closeModal();
      } else {
        toast.showWarning(response.message || 'Failed to create area');
      }
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const onCancel = () => {
    form.resetFields();
    setAreaTypeSelected(null);
    modal.closeModal();
  };

  const handleValuesChange = (changedValues: any, allValues: any) => {
    if (
      changedValues.length ||
      changedValues.width ||
      changedValues.penLength ||
      changedValues.penWidth
    ) {
      const { length, width, penLength, penWidth } = allValues;
      if (length && width && penLength && penWidth) {
        const availableWidthPerSide = (width - 4) / 2;
        const pensPerSide = Math.floor(availableWidthPerSide / penLength); // penLength along width
        const pensPerRow = Math.floor(length / penWidth); // penWidth along length
        const maxPen = pensPerSide * pensPerRow * 2;

        setNumberInRowSuggested(pensPerRow);
        form.setFieldsValue({
          maxPen: maxPen > 0 ? maxPen : 0,
          numberInRow: pensPerRow > 0 ? pensPerRow : 0,
        });
      }
    }
  };

  return (
    <div>
      <ButtonComponent
        onClick={() => {
          modal.openModal();
        }}
        type='primary'
      >
        {t('Create Area')}
      </ButtonComponent>
      <ModalComponent
        open={modal.open}
        onOk={() => {
          form.submit();
        }}
        onCancel={onCancel}
        title={t('Create New Area')}
        loading={isLoading}
        disabledButtonOk={disabledButton}
        width={800}
      >
        <div className='mb-4 text-sm text-gray-700'>
          <p className='font-semibold'>{t('Note')}:</p>
          <p>{t('The minimum dimensions required for each area type are as follows')}:</p>
          <ul className='list-disc pl-5'>
            <li>
              <span className='font-medium'>{t('Cow Housing')}:</span>{' '}
              {t('Minimum length 20m, minimum width 10m')}
            </li>
            <li>
              <span className='font-medium'>{t('Quarantine')}:</span>{' '}
              {t('Minimum length 20m, minimum width 10m')}
            </li>
          </ul>
          <p>
            {t(
              'Ensure that the dimensions you enter meet or exceed the minimum requirements for the selected area type.'
            )}
          </p>
          <p className='mt-2 text-blue-600'>
            <strong>{t('Layout Info')}:</strong>{' '}
            {t('note_info_area', {
              defaultValue:
                'A 4m-wide aisle runs through the center along the length, splitting the area into two sections. Pens are placed on both sides, with pen length along the area width and pen width along the area length. Pen length must be greater than or equal to pen width.',
            })}
          </p>
        </div>
        <Divider className='!my-3' />
        <FormComponent form={form} onFinish={onFinish} onValuesChange={handleValuesChange}>
          <FormItemComponent
            rules={[{ required: true }]}
            name='areaType'
            label={<LabelForm>{t('Area Type')}:</LabelForm>}
          >
            <Select options={areaTypes} onChange={(value) => setAreaTypeSelected(value)} />
          </FormItemComponent>
          {areaTypeSelected ? (
            <>
              <div className='flex gap-5'>
                <div className='flex flex-col w-1/2'>
                  <FormItemComponent
                    dependencies={['length', 'width']}
                    rules={[
                      { required: true },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const areaType: AreaType = getFieldValue('areaType');
                          const length = getFieldValue('length');
                          if (
                            !areaType ||
                            !length ||
                            !validateDimensions(areaType, length, value)
                          ) {
                            return Promise.reject(
                              new Error(
                                t(`area_modal.minimun_width_area`, {
                                  width: minDimensions[areaType].width,
                                })
                              )
                            );
                          }
                          if (length < value) {
                            return Promise.reject(
                              new Error(t('Width must be smaller than length'))
                            );
                          }
                          if (length === value) {
                            return Promise.reject(
                              new Error(t('Width must be smaller than length'))
                            );
                          }
                          if (value < 4) {
                            return Promise.reject(
                              new Error(t('Width must be at least 4m to accommodate the aisle'))
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                    name='width'
                    label={<LabelForm>{t('Width (m)')}:</LabelForm>}
                  >
                    <InputComponent.Number min={1} disabled={!areaTypeSelected} />
                  </FormItemComponent>
                  <FormItemComponent
                    rules={[
                      { required: true },
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
                    name='length'
                    label={<LabelForm>{t('Length (m)')}:</LabelForm>}
                  >
                    <InputComponent.Number min={1} disabled={!areaTypeSelected} />
                  </FormItemComponent>
                  <FormItemComponent
                    dependencies={['width', 'penWidth']}
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
                              t('Pen Length must be greater than or equal to the Pen Width')
                            )
                          );
                        },
                      }),
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const availableWidthPerSide = (getFieldValue('width') - 4) / 2;
                          if (!value || value <= availableWidthPerSide) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              t(
                                'Pen length must be smaller than or equal to {{width}}m to fit along the area width',
                                { width: availableWidthPerSide.toFixed(0) }
                              )
                            )
                          );
                        },
                      }),
                    ]}
                    name='penLength'
                    label={<LabelForm>{t('Pen Length (m)')}:</LabelForm>}
                  >
                    <InputComponent.Number min={1} disabled={!areaTypeSelected} />
                  </FormItemComponent>
                  <FormItemComponent
                    dependencies={['length', 'penLength']}
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
                            new Error(t('Pen Width must be less than or equal to the Pen Length'))
                          );
                        },
                      }),
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || value <= getFieldValue('length')) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(t('Pen width must be smaller than or equal to area length'))
                          );
                        },
                      }),
                    ]}
                    name='penWidth'
                    label={<LabelForm>{t('Pen Width (m)')}:</LabelForm>}
                  >
                    <InputComponent.Number min={1} disabled={!areaTypeSelected} />
                  </FormItemComponent>
                </div>
                {formAreaLength > 0 &&
                  formAreaPenLength > 0 &&
                  formAreaPenWidth > 0 &&
                  formAreaWidth > 0 && (
                    <div className='flex flex-col w-1/2'>
                      <FormItemComponent
                        name='maxPen'
                        rules={[{ required: true }]}
                        label={<LabelForm>{t('Max pen')}:</LabelForm>}
                      >
                        <InputComponent.Number min={1} readOnly />
                      </FormItemComponent>
                      <FormItemComponent
                        name='numberInRow'
                        rules={[
                          { required: true },
                          {
                            validator: (_, value) => {
                              if (!numberInRowSuggested) {
                                return Promise.resolve();
                              }
                              if (
                                value === numberInRowSuggested ||
                                value === numberInRowSuggested - 1 ||
                                value === numberInRowSuggested - 2
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(
                                  t(
                                    'Please enter a value equal to suggested number or lower by at most 2'
                                  )
                                )
                              );
                            },
                          },
                        ]}
                        label={
                          <LabelForm>
                            {t('Number in row')}{' '}
                            {numberInRowSuggested > 0 &&
                              t('(Suggested: ~{{number}})', {
                                number: numberInRowSuggested,
                              })}
                            :
                          </LabelForm>
                        }
                      >
                        <InputComponent.Number min={1} />
                      </FormItemComponent>
                      {areaTypeSelected !== 'quarantine' && (
                        <>
                          <FormItemComponent
                            rules={[{ required: true }]}
                            name='cowStatus'
                            label={<LabelForm>{t('Cow Status')}:</LabelForm>}
                          >
                            <Select options={cowStatus()} />
                          </FormItemComponent>
                          <FormItemComponent
                            rules={[{ required: true }]}
                            name='cowTypeId'
                            label={<LabelForm>{t('Cow Type')}:</LabelForm>}
                          >
                            <Select options={cowTypeOptions} />
                          </FormItemComponent>
                        </>
                      )}
                    </div>
                  )}
              </div>
              <FormItemComponent
                rules={[{ required: true }, { validator: validateInput }]}
                name='name'
                label={<LabelForm>{t('Name')}:</LabelForm>}
                hasFeedback
              >
                <Input />
              </FormItemComponent>
              <FormItemComponent
                rules={[{ required: true }]}
                name='description'
                label={<LabelForm>{t('Description')}:</LabelForm>}
              >
                <ReactQuillComponent style={{ height: 80 }} />
              </FormItemComponent>
            </>
          ) : (
            <p className='text-red-600 text-lg mb-5 font-semibold'>
              {t('Please choose area type first')}
            </p>
          )}
        </FormComponent>
      </ModalComponent>
    </div>
  );
};

export default ModalCreateArea;
