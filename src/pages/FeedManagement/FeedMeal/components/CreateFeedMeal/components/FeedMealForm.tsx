import { Divider, Form, SelectProps, Spin, Splitter } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ButtonComponent from '../../../../../../components/Button/ButtonComponent';
import FormItemComponent from '../../../../../../components/Form/Item/FormItemComponent';
import InputComponent from '../../../../../../components/Input/InputComponent';
import LabelForm from '../../../../../../components/LabelForm/LabelForm';
import ReactQuillComponent from '../../../../../../components/ReactQuill/ReactQuillComponent';
import SelectComponent from '../../../../../../components/Select/SelectComponent';
import Title from '../../../../../../components/UI/Title';
import useFetcher from '../../../../../../hooks/useFetcher';
import useToast from '../../../../../../hooks/useToast';
import { Item } from '../../../../../../model/Warehouse/items';
import { cowStatus } from '../../../../../../service/data/cowStatus';
import HayFieldFormList from './FormListFeedMeal/HayFieldFormList';
import MineralFieldFormList from './FormListFeedMeal/MineralFieldFormList';
import RefinedFieldFormList from './FormListFeedMeal/RefinedFieldFormList';
import SilageFieldFormList from './FormListFeedMeal/SilageFieldFormList';

interface FeedMealFormProps {
  dry: number;
  cowType: any[];
  cowTypeSelected: number;
  cowStatusSelected: string;
}

const FeedMealForm = ({
  dry,
  cowType,
  cowTypeSelected,
  cowStatusSelected,
}: FeedMealFormProps) => {
  const [form] = Form.useForm();
  const [hay, setHay] = useState<SelectProps['options']>([]);
  const [refinedFood, setRefinedFood] = useState<SelectProps['options']>([]);
  const [silage, setSilage] = useState<SelectProps['options']>([]);
  const [minerals, setMinerals] = useState<SelectProps['options']>([]);
  const navigate = useNavigate();
  // const [selectedHay, setSelectedHay] = useState<string[]>([]);
  // const [selectedRefined, setSelectedRefined] = useState<string[]>([]);
  const { t } = useTranslation();
  const [hayTotal, setHayTotal] = useState<number>(0);
  const [refinedTotal, setRefinedTotal] = useState<number>(0);
  const [mineralsTotal, setMineralsTotal] = useState<number>(0);
  const [silageTotal, setSilageTotal] = useState<number>(0);
  const { data: itemsData } = useFetcher<Item[]>('items', 'GET');
  const toast = useToast();
  const { trigger: triggerFeedMeal, isLoading: isLoadingFeedMeal } = useFetcher(
    'feedmeals',
    'POST'
  );

  useEffect(() => {
    if (itemsData) {
      setHay(
        itemsData
          .filter((element: Item) => element?.categoryEntity?.name === 'Cỏ Khô')
          .map((e: Item) => ({
            label: e.name,
            value: e.itemId.toString(),
            searchLabel: e.name,
          }))
      );
      setRefinedFood(
        itemsData
          .filter(
            (element: Item) => element?.categoryEntity?.name === 'Thức ăn tinh'
          )
          .map((e: Item) => ({
            label: e.name,
            value: e.itemId.toString(),
            searchLabel: e.name,
          }))
      );
      setSilage(
        itemsData
          .filter(
            (element: Item) =>
              element?.categoryEntity?.name === 'Thức ăn ủ chua'
          )
          .map((e: Item) => ({
            label: e.name,
            value: e.itemId.toString(),
            searchLabel: e.name,
          }))
      );
      setMinerals(
        itemsData
          .filter(
            (element: Item) => element?.categoryEntity?.name === 'Khoáng chất'
          )
          .map((e: Item) => ({
            label: e.name,
            value: e.itemId.toString(),
            searchLabel: e.name,
          }))
      );
    }
  }, [itemsData]);

  useEffect(() => {
    if (dry) {
      const totalOfHay = (dry * 0.35) / 0.85;
      const roundTotalOfHay = parseFloat(totalOfHay.toFixed(2));
      setHayTotal(roundTotalOfHay);
      const totalOfRefined = (dry * 0.25) / 0.35;
      const roundTotalOfRefined = parseFloat(totalOfRefined.toFixed(2));
      setRefinedTotal(roundTotalOfRefined);
      const totalOfSilage = (dry * 0.3) / 0.9;
      const roundTotalOfSilage = parseFloat(totalOfSilage.toFixed(2));
      setSilageTotal(roundTotalOfSilage);
      const totalOfMinerals = (dry * 0.1) / 0.75;
      const roundTotalOfMinerals = parseFloat(totalOfMinerals.toFixed(2));
      setMineralsTotal(roundTotalOfMinerals);
    }
  }, [dry]);

  // const handleSelectChange = (
  //   value: string,
  //   fieldIndex: number,
  //   fieldName: string
  // ) => {
  //   if (fieldName === 'detailsHay') {
  //     const updatedHay = [...selectedHay];
  //     updatedHay[fieldIndex] = value; // Update selected option at the correct index
  //     setSelectedHay(updatedHay.filter(Boolean)); // Filter out any falsy values
  //   }
  //   if (fieldName === 'detailsRefined') {
  //     const updatedRefined = [...selectedRefined];
  //     updatedRefined[fieldIndex] = value;
  //     setSelectedRefined(updatedRefined.filter(Boolean));
  //   }
  // };

  const handleValidatorQuantity = async (fieldName: string, total: number) => {
    const totalQuantity = (form.getFieldValue(fieldName) || []).reduce(
      (sum: number, field: any) => sum + (parseFloat(field?.quantity) || 0),
      0
    );
    const minAcceptable = (total * 0.8).toFixed(2);
    if (minAcceptable >= totalQuantity || totalQuantity >= total) {
      throw new Error(
        t(
          `The total quantity of hay must be between ${minAcceptable} kg and ${total} kg.`
        )
      );
    } else {
      return Promise.resolve();
    }
  };

  // const handleRemoveField = (name: number, fieldName: string) => {
  //   if (fieldName === 'detailsHay') {
  //     const currentValues = form.getFieldValue(fieldName) || [];
  //     const removedItem = currentValues[name]?.itemId; // Capture the removed item
  //     currentValues.splice(name, 1);
  //     form.setFieldsValue({ detailsHay: currentValues });
  //     const updatedSelectedHay = selectedHay.filter(
  //       (item) => item !== removedItem
  //     ); // Remove the item from selectedHay
  //     setSelectedHay(updatedSelectedHay);
  //   }
  //   if (fieldName === 'detailsRefined') {
  //     const currentValues = form.getFieldValue(fieldName) || [];
  //     const removedItem = currentValues[name]?.itemId; // Capture the removed item
  //     currentValues.splice(name, 1);
  //     form.setFieldsValue({ detailsRefined: currentValues });
  //     const updatedSelectedRefined = selectedRefined.filter(
  //       (item) => item !== removedItem
  //     ); // Remove the item from selectedRefined
  //     setSelectedRefined(updatedSelectedRefined);
  //   }
  // };

  const handleFinish = async (values: any) => {
    const transformDetails = (array: any[]) =>
      array.map((item: { itemId: string; quantity: number }) => ({
        itemId: item.itemId,
        quantity: item.quantity,
      }));
    const payload = {
      name: values.name,
      description: values.description,
      cowTypeId: values.cowTypeId,
      shift: values.shift,
      cowStatus: values.cowStatus,
      details: [
        ...transformDetails(values.detailsHay),
        ...transformDetails(values.detailsRefined),
        ...transformDetails(values.detailsSilage),
        ...transformDetails(values.detailsMineral),
      ],
    };
    try {
      await triggerFeedMeal({ body: payload });
      toast.showSuccess('Create success');
      navigate('../list');
    } catch (error: any) {
      toast.showError(error.message);
    }
    console.log(payload);
  };

  return (
    <div>
      <Form
        form={form}
        name="dynamic_form_nest_item"
        autoComplete="off"
        labelCol={{ span: 24 }}
        initialValues={{
          name: '',
          description: '',
          cowTypeId: cowTypeSelected,
          shift: 'morningShift',
          cowStatus: cowStatusSelected,
          detailsHay: [
            {
              quantity: 0,
              itemId: null,
            },
          ],
          detailsRefined: [
            {
              quantity: 0,
              itemId: null,
            },
          ],
          detailsSilage: [
            {
              quantity: 0,
              itemId: null,
            },
          ],
          detailsMineral: [
            {
              quantity: 0,
              itemId: null,
            },
          ],
        }}
        onFinish={handleFinish} // Trigger validation on submit
      >
        {isLoadingFeedMeal ? (
          <Spin />
        ) : (
          <>
            <Title className="my-4 text-xl">
              {t('Feed meal information')}:
            </Title>
            <div className="flex justify-between mb-5 gap-5">
              <div className=" w-1/3 h-fit">
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="name"
                  label={<LabelForm>{t('Name')}</LabelForm>}
                  className="col-span-1"
                >
                  <InputComponent />
                </FormItemComponent>
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="cowTypeId"
                  label={<LabelForm>{t('Cow Type')}</LabelForm>}
                >
                  <SelectComponent
                    options={cowType}
                    open={false}
                    className="!cursor-default"
                  />
                </FormItemComponent>
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="cowStatus"
                  label={<LabelForm>{t('Cow Status')}</LabelForm>}
                >
                  <SelectComponent
                    options={cowStatus}
                    open={false}
                    className="!cursor-default"
                  />
                </FormItemComponent>
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="shift"
                  label={<LabelForm>{t('Shift')}</LabelForm>}
                >
                  <SelectComponent
                    options={[
                      {
                        value: 'morningShift',
                        label: 'Morning Shift',
                      },
                    ]}
                  />
                </FormItemComponent>
              </div>
              <div className="w-2/3">
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="description"
                  label={<LabelForm>{t('Description')}</LabelForm>}
                >
                  <ReactQuillComponent />
                </FormItemComponent>
              </div>
            </div>
            <Divider className="my-2" />
            <Title className="mb-4 text-xl">{t('Feed meal details')}:</Title>
            <Splitter>
              {/*Hay */}
              <Splitter.Panel
                defaultSize={'25%'}
                max={'25%'}
                min={'25%'}
                size={'25%'}
                className="flex flex-col gap-2 !py-5 !pr-5"
              >
                <HayFieldFormList
                  handleValidatorQuantity={handleValidatorQuantity}
                  hay={hay}
                  hayTotal={hayTotal}
                />
              </Splitter.Panel>

              {/*Refined */}
              <Splitter.Panel
                defaultSize={'25%'}
                max={'25%'}
                min={'25%'}
                size={'25%'}
                className="flex flex-col gap-2 !p-5"
              >
                <RefinedFieldFormList
                  handleValidatorQuantity={handleValidatorQuantity}
                  refinedFood={refinedFood}
                  refinedTotal={refinedTotal}
                />
              </Splitter.Panel>
              <Splitter.Panel
                defaultSize={'25%'}
                max={'25%'}
                min={'25%'}
                size={'25%'}
                className="flex flex-col gap-2 !p-5"
              >
                <SilageFieldFormList
                  handleValidatorQuantity={handleValidatorQuantity}
                  silage={silage}
                  silageTotal={silageTotal}
                />
              </Splitter.Panel>
              <Splitter.Panel
                defaultSize={'25%'}
                max={'25%'}
                min={'25%'}
                size={'25%'}
                className="flex flex-col gap-2 !p-5"
              >
                <MineralFieldFormList
                  handleValidatorQuantity={handleValidatorQuantity}
                  mineralTotal={mineralsTotal}
                  minerals={minerals}
                />
              </Splitter.Panel>
            </Splitter>
            <Form.Item className="!w-full flex justify-center">
              <ButtonComponent
                className="!w-[500px]"
                type="primary"
                htmlType="submit"
              >
                {t('Submit')}
              </ButtonComponent>
            </Form.Item>
          </>
        )}
      </Form>
    </div>
  );
};

export default FeedMealForm;
