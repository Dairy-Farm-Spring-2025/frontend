import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import SelectComponent from '@components/Select/SelectComponent';
import TagComponents from '@components/UI/TagComponents';
import useFetcher from '@hooks/useFetcher';
import { ModalActionProps } from '@hooks/useModal';
import useToast from '@hooks/useToast';
import { VaccineCycleDetails } from '@model/Vaccine/VaccineCycle/vaccineCycle';
import { Item } from '@model/Warehouse/items';
import { VACCINE_CYCLE_PATH } from '@service/api/VaccineCycle/vaccineCycleApi';
import { unitOptions } from '@service/data/item';
import {
  injectionSiteOptions,
  unitPeriodic,
  vaccineType,
} from '@service/data/vaccine';
import { formatStatusWithCamel } from '@utils/format';
import { getItemStatusColor } from '@utils/statusRender/itemStatusRender';
import { Form } from 'antd';
import { t } from 'i18next';
import { useEffect, useState } from 'react';

interface EditVaccineCycleProps {
  id?: number;
  setId: any;
  modal: ModalActionProps;
  previousInjectionMonth: number;
  setPreviousInjectionMonth: any;
  nextInjectionMonth: number;
  setNextInjectionMonth: any;
  vaccineCycleId: string;
  mutate: any;
}
const EditVaccineCycle = ({
  id,
  modal,
  setId,
  previousInjectionMonth,
  nextInjectionMonth,
  setPreviousInjectionMonth,
  setNextInjectionMonth,
  vaccineCycleId,
  mutate,
}: EditVaccineCycleProps) => {
  const [form] = Form.useForm();
  const { data: dataVaccineDetail, isLoading: isLoadingFetch } =
    useFetcher<VaccineCycleDetails>(
      VACCINE_CYCLE_PATH.GET_VACCINE_CYCLE_DETAIL(id as any),
      'GET',
      'application/json',
      modal.open && id !== null
    );
  const toast = useToast();
  const { trigger: triggerUpdate, isLoading: isLoadingUpdate } = useFetcher(
    'updateVaccineCycle',
    'PUT',
    'application/json',
    modal.open && id !== null
  );
  const { trigger: triggerCreate, isLoading: isLoadingCreate } = useFetcher(
    VACCINE_CYCLE_PATH.CREATE_VACCINE_CYCLE_DETAIL,
    'POST',
    'application/json',
    modal.open && id !== null
  );
  const { data: itemData } = useFetcher<Item[]>(
    'items',
    'GET',
    'application/json',
    modal.open
  );
  const [optionsItem, setOptionsItem] = useState<any[]>([]);
  useEffect(() => {
    if (modal.open && itemData) {
      setOptionsItem(
        itemData
          .filter(
            (element) =>
              element.categoryEntity.name === 'Vắc-xin' ||
              element.categoryEntity.name === 'Vaccine'
          )
          .map((element: Item) => ({
            label: (
              <p>
                <span>{element.name}</span> -{' '}
                <TagComponents
                  color={getItemStatusColor(element.status as any)}
                >
                  {t(formatStatusWithCamel(element.status))}
                </TagComponents>
              </p>
            ),
            value: element.itemId,
            searchLabel: element.name,
          }))
      );
    }
  }, [itemData, modal.open]);
  useEffect(() => {
    if (modal.open && id !== null) {
      form.setFieldsValue({
        name: dataVaccineDetail?.name,
        description: dataVaccineDetail?.description,
        dosageUnit: dataVaccineDetail?.dosageUnit,
        vaccineIngredients: dataVaccineDetail?.vaccineIngredients,
        vaccineType: dataVaccineDetail?.vaccineType,
        dosage: dataVaccineDetail?.dosage,
        injectionSite: dataVaccineDetail?.injectionSite,
        unitPeriodic: dataVaccineDetail?.unitPeriodic,
        numberPeriodic: dataVaccineDetail?.numberPeriodic,
        itemId: dataVaccineDetail?.itemEntity?.itemId,
        firstInjectionMonth: dataVaccineDetail?.firstInjectionMonth,
      });
    }
  }, [
    dataVaccineDetail?.description,
    dataVaccineDetail?.dosage,
    dataVaccineDetail?.dosageUnit,
    dataVaccineDetail?.firstInjectionMonth,
    dataVaccineDetail?.injectionSite,
    dataVaccineDetail?.itemEntity?.itemId,
    dataVaccineDetail?.name,
    dataVaccineDetail?.numberPeriodic,
    dataVaccineDetail?.unitPeriodic,
    dataVaccineDetail?.vaccineIngredients,
    dataVaccineDetail?.vaccineType,
    form,
    id,
    modal.open,
  ]);

  const handleClose = () => {
    if (id) {
      setId(null);
      form.resetFields();
    }
    setPreviousInjectionMonth(null);
    setNextInjectionMonth(null);
    modal.closeModal();
  };
  const validateFirstInjectionMonth = (
    previousInjectionMonth: number,
    nextInjectionMonth: number
  ) => {
    return (_: any, value: number) => {
      if (value === undefined || value === null) return Promise.resolve();

      if (nextInjectionMonth !== null) {
        if (value >= previousInjectionMonth && value <= nextInjectionMonth) {
          return Promise.resolve();
        }
        if (previousInjectionMonth !== nextInjectionMonth) {
          return Promise.reject(
            new Error(
              t(
                `Injection month must be between {{previousInjectionMonth}} and {{nextInjectionMonth}}`,
                {
                  previousInjectionMonth,
                  nextInjectionMonth,
                }
              )
            )
          );
        } else {
          return Promise.reject(
            new Error(
              t(
                `Injection month must be equal or greater than {{previousInjectionMonth}}`,
                {
                  previousInjectionMonth,
                }
              )
            )
          );
        }
      } else {
        if (value >= previousInjectionMonth) {
          return Promise.resolve();
        }
        return Promise.reject(
          new Error(
            t(
              `Injection month must be equal or greater than {{previousInjectionMonth}}`,
              {
                previousInjectionMonth,
              }
            )
          )
        );
      }
    };
  };

  const handleItemChange = (itemId: number) => {
    if (!itemData) return;
    const selectedItem = itemData.find((item) => item.itemId === itemId);
    if (selectedItem && selectedItem.unit) {
      form.setFieldsValue({
        dosageUnit: selectedItem.unit,
      });
    }
  };

  const onFinishCreate = async (values: any) => {
    try {
      const payload = {
        ...values,
        vaccineCycleID: vaccineCycleId,
      };
      const response = await triggerCreate({
        body: payload,
      });
      toast.showSuccess(response.message);
      handleClose();
      mutate();
    } catch (error: any) {
      toast.showError(error?.message);
    }
  };

  const onFinishUpdate = async (values: any) => {
    try {
      const payload = {
        ...values,
      };
      const response = await triggerUpdate({
        url: VACCINE_CYCLE_PATH.UPDATE_VACCINE_CYCLE_DETAIL(id as any),
        body: payload,
      });
      toast.showSuccess(response.message);
      handleClose();
      mutate();
    } catch (error: any) {
      toast.showError(error?.message);
    }
  };

  return (
    <ModalComponent
      loading={isLoadingFetch || isLoadingCreate || isLoadingUpdate}
      open={modal.open}
      onCancel={handleClose}
      width={800}
      onOk={form.submit}
    >
      <FormComponent
        form={form}
        onFinish={id ? onFinishUpdate : onFinishCreate}
      >
        <FormItemComponent
          name="name"
          label={<LabelForm>{t('Name')}</LabelForm>}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <InputComponent />
        </FormItemComponent>
        <div className="grid grid-cols-2 gap-x-4">
          <div className="flex flex-col ">
            <FormItemComponent
              label={<LabelForm>{t('Item')}</LabelForm>}
              name={'itemId'}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <SelectComponent
                options={optionsItem}
                onChange={(value) => handleItemChange(value)}
              />
            </FormItemComponent>
            <FormItemComponent
              label={<LabelForm>{t('Vaccine Type')}</LabelForm>}
              name={'vaccineType'}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <SelectComponent options={vaccineType()} />
            </FormItemComponent>
            <FormItemComponent
              label={<LabelForm>{t('Vaccine Ingredients')}</LabelForm>}
              name={'vaccineIngredients'}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputComponent />
            </FormItemComponent>
            <FormItemComponent
              label={<LabelForm>{t('Injection Site')}</LabelForm>}
              name={'injectionSite'}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <SelectComponent options={injectionSiteOptions()} />
            </FormItemComponent>
          </div>
          <div>
            <div className="flex gap-2">
              <FormItemComponent
                label={<LabelForm>{t('Dosage')}</LabelForm>}
                name={'dosage'}
                rules={[
                  {
                    required: true,
                  },
                ]}
                className="!w-2/5"
              >
                <InputComponent.Number />
              </FormItemComponent>
              <FormItemComponent
                label={<LabelForm>{t('Dosage Unit')}</LabelForm>}
                name={'dosageUnit'}
                rules={[
                  {
                    required: true,
                  },
                ]}
                className="!w-3/5"
              >
                <SelectComponent
                  options={unitOptions()}
                  open={false}
                  disabled={true}
                />
              </FormItemComponent>
            </div>
            <div className="flex gap-2">
              <FormItemComponent
                label={<LabelForm>{t('Number Periodic')}</LabelForm>}
                name={'numberPeriodic'}
                rules={[
                  {
                    required: true,
                  },
                ]}
                className="w-2/5"
              >
                <InputComponent.Number />
              </FormItemComponent>
              <FormItemComponent
                label={<LabelForm>{t('Unit Periodic')}</LabelForm>}
                name={'unitPeriodic'}
                rules={[
                  {
                    required: true,
                  },
                ]}
                className="w-3/5"
              >
                <SelectComponent options={unitPeriodic()} />
              </FormItemComponent>
            </div>
            <FormItemComponent
              label={<LabelForm>{t('First Injection Month')}</LabelForm>}
              name={'firstInjectionMonth'}
              rules={[
                {
                  required: true,
                },
                {
                  validator: validateFirstInjectionMonth(
                    previousInjectionMonth,
                    nextInjectionMonth
                  ),
                },
              ]}
            >
              <InputComponent.Number />
            </FormItemComponent>
          </div>
        </div>
        <FormItemComponent
          label={<LabelForm>{t('Description')}</LabelForm>}
          className="col-span-2 "
          name={'description'}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <ReactQuillComponent />
        </FormItemComponent>
      </FormComponent>
    </ModalComponent>
  );
};

export default EditVaccineCycle;
