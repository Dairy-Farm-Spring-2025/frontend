import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Divider, Form } from 'antd';
import { useEffect, useState } from 'react';
import ButtonComponent from '../../../../../components/Button/ButtonComponent';
import FormComponent from '../../../../../components/Form/FormComponent';
import FormItemComponent from '../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../components/Input/InputComponent';
import LabelForm from '../../../../../components/LabelForm/LabelForm';
import ModalComponent from '../../../../../components/Modal/ModalComponent';
import SelectComponent from '../../../../../components/Select/SelectComponent';
import StepsComponent, {
  StepItem,
} from '../../../../../components/Steps/StepsComponent';
import useFetcher from '../../../../../hooks/useFetcher';
import { CowType } from '../../../../../model/Cow/CowType';
import { unitOptions } from '../../../../../service/data/item';
import {
  injectionSiteOptions,
  unitPeriodic,
  vaccineType,
} from '../../../../../service/data/vaccine';
import { Item } from '../../../../../model/Warehouse/items';
import { VaccineCyclePayload } from '../../../../../model/Vaccine/VaccineCycle/vaccineCycle';
import useToast from '../../../../../hooks/useToast';
import ReactQuillComponent from '../../../../../components/ReactQuill/ReactQuillComponent';
import { useTranslation } from 'react-i18next';

interface CreateVaccineCycleModalProps {
  modal: any;
  mutate: any;
}

const CreateVaccineCycleModal = ({
  modal,
  mutate,
}: CreateVaccineCycleModalProps) => {
  const [current, setCurrent] = useState(0); // Manage current step
  const [generalForm] = Form.useForm();
  const [detailForm] = Form.useForm();
  const [optionsCowType, setOptionsCowType] = useState<any[]>([]);
  const [optionsItem, setOptionsItem] = useState<any[]>([]);
  const [apiBody, setApiBody] = useState<any>(null);
  const { data } = useFetcher<CowType[]>('cow-types', 'GET');
  const { data: itemData } = useFetcher<Item[]>('items', 'GET');
  const { trigger, isLoading } = useFetcher('vaccinecycles/create', 'POST');
  const toast = useToast();
  const { t } = useTranslation();
  useEffect(() => {
    if (data && modal.open && itemData) {
      setOptionsCowType(
        data.map((element: CowType) => ({
          label: element.name,
          value: element.cowTypeId,
          searchLabel: element.name,
        }))
      );
      setOptionsItem(
        itemData.map((element: Item) => ({
          label: element.name,
          value: element.itemId,
          searchLabel: element.name,
        }))
      );
    }
  }, [data, itemData, modal.open]);

  const handleNextGeneral = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const generalValues = await generalForm.validateFields();
      setApiBody((prevState: any) => ({
        ...prevState,
        ...generalValues,
      }));
    } catch (error) {
      throw error; // Prevent advancing to the next step
    }
  };

  const handleCancel = () => {
    generalForm.resetFields();
    detailForm.resetFields();
    setApiBody(null);
    setCurrent(0);
    modal.closeModal();
  };

  const handleDone = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
      const generalValues = await detailForm.validateFields();
      const payload: VaccineCyclePayload = {
        ...apiBody,
        ...generalValues,
      };
      try {
        const response = await trigger({ body: payload });
        toast.showSuccess(response.message);
        mutate();
        handleCancel();
      } catch (error: any) {
        toast.showError(error.message);
      }
      console.log(payload);
    } catch (error) {
      throw error; // Prevent advancing to the next step
    }
  };

  const steps: StepItem[] = [
    {
      title: t('General Information'),
      content: (
        <FormComponent form={generalForm}>
          <FormItemComponent
            rules={[{ required: true }]}
            name="name"
            label={<LabelForm>{t('Name')}</LabelForm>}
          >
            <InputComponent />
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true }]}
            name="cowTypeId"
            label={<LabelForm>{t('Cow Type')}</LabelForm>}
          >
            <SelectComponent options={optionsCowType} search={true} />
          </FormItemComponent>
          <FormItemComponent
            rules={[{ required: true }]}
            name="description"
            label={<LabelForm>{t('Description')}</LabelForm>}
          >
            <ReactQuillComponent />
          </FormItemComponent>
        </FormComponent>
      ),
      onNext: handleNextGeneral,
    },
    {
      title: t('Detail Information'),
      content: (
        <Form
          form={detailForm}
          name="dynamic_form_nest_item"
          autoComplete="off"
          labelCol={{ span: 24 }}
          initialValues={{
            details: [
              {
                name: '',
                itemId: '',
                vaccineIngredients: '',
                vaccineType: '',
                numberPeriodic: '',
                unitPeriodic: '',
                dosage: '',
                dosageUnit: '',
                injectionSite: '',
                firstInjectionMonth: '',
                description: '',
              },
            ], // Initial field
          }}
        >
          <Form.List name="details">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div key={key}>
                    <div className="flex items-center w-full gap-4">
                      <div className="w-[90%] grid grid-cols-4 gap-4">
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          label={<LabelForm>{t('Name')}</LabelForm>}
                          rules={[
                            {
                              required: true,
                              message: 'This field is required!',
                            },
                          ]}
                          className="col-span-2"
                        >
                          <InputComponent />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label={<LabelForm>{t('Item')}</LabelForm>}
                          name={[name, 'itemId']}
                          rules={[
                            {
                              required: true,
                              message: 'This field is required!',
                            },
                          ]}
                          className="col-span-2"
                        >
                          <SelectComponent options={optionsItem} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label={
                            <LabelForm>{t('Vaccine Ingredients')}</LabelForm>
                          }
                          name={[name, 'vaccineIngredients']}
                          rules={[
                            {
                              required: true,
                              message: 'This field is required!',
                            },
                          ]}
                        >
                          <InputComponent />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label={<LabelForm>{t('Vaccine Type')}</LabelForm>}
                          name={[name, 'vaccineType']}
                          rules={[
                            {
                              required: true,
                              message: 'This field is required!',
                            },
                          ]}
                        >
                          <SelectComponent options={vaccineType()} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label={<LabelForm>{t('Number Periodic ')}</LabelForm>}
                          name={[name, 'numberPeriodic']}
                          rules={[
                            {
                              required: true,
                              message: 'This field is required!',
                            },
                          ]}
                        >
                          <InputComponent.Number />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label={<LabelForm>{t('Unit Periodic ')}</LabelForm>}
                          name={[name, 'unitPeriodic']}
                          rules={[
                            {
                              required: true,
                              message: 'This field is required!',
                            },
                          ]}
                        >
                          <SelectComponent options={unitPeriodic()} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label={<LabelForm>{t('Dosage')}</LabelForm>}
                          name={[name, 'dosage']}
                          rules={[
                            {
                              required: true,
                              message: 'This field is required!',
                            },
                          ]}
                        >
                          <InputComponent.Number />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label={<LabelForm>{t('Dosage Unit')}</LabelForm>}
                          name={[name, 'dosageUnit']}
                          rules={[
                            {
                              required: true,
                              message: 'This field is required!',
                            },
                          ]}
                        >
                          <SelectComponent options={unitOptions()} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label={<LabelForm>{t('Injection Site')}</LabelForm>}
                          name={[name, 'injectionSite']}
                          rules={[
                            {
                              required: true,
                              message: 'This field is required!',
                            },
                          ]}
                        >
                          <SelectComponent options={injectionSiteOptions()} />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label={
                            <LabelForm>{t('First Injection Month')}</LabelForm>
                          }
                          name={[name, 'firstInjectionMonth']}
                          rules={[
                            {
                              required: true,
                              message: 'This field is required!',
                            },
                          ]}
                        >
                          <InputComponent.Number />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label={<LabelForm>{t('Description')}</LabelForm>}
                          className="col-span-4"
                          name={[name, 'description']}
                          rules={[
                            {
                              required: true,
                              message: 'This field is required!',
                            },
                          ]}
                        >
                          <ReactQuillComponent />
                        </Form.Item>
                      </div>
                      <div className="flex justify-center w-[10%]">
                        {/* Disable remove icon for the first field */}
                        {index > 0 && (
                          <MinusCircleOutlined
                            onClick={() => remove(name)}
                            className="!text-2xl"
                          />
                        )}
                      </div>
                    </div>
                    <Divider />
                  </div>
                ))}
                <Form.Item>
                  <ButtonComponent
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    {t('Add more field')}
                  </ButtonComponent>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      ),
      onDone: handleDone,
    },
  ];

  return (
    <ModalComponent
      title="Create Vaccine Cycle"
      open={modal.open}
      onCancel={handleCancel}
      width={1000}
      styles={{
        body: { height: '78vh', padding: 40, overflowY: 'auto' }, // Set a taller height for the modal body
      }}
      footer={[]}
      loading={isLoading}
    >
      <div className="mt-5">
        <StepsComponent
          steps={steps}
          current={current}
          setCurrent={setCurrent}
        />
      </div>
    </ModalComponent>
  );
};

export default CreateVaccineCycleModal;
