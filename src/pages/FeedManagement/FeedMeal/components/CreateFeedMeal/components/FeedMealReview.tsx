import ButtonComponent from '@components/Button/ButtonComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import SelectComponent from '@components/Select/SelectComponent';
import QuillRender from '@components/UI/QuillRender';
import Title from '@components/UI/Title';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { Item } from '@model/Warehouse/items';
import { FEED_PATH } from '@service/api/Feed/feedApi';
import { cowStatus } from '@service/data/cowStatus';
import { Divider, Form, SelectProps, Spin, Splitter } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import HayFieldFormList from './FormListFeedMeal/HayFieldFormList';
import MineralFieldFormList from './FormListFeedMeal/MineralFieldFormList';
import RefinedFieldFormList from './FormListFeedMeal/RefinedFieldFormList';
import SilageFieldFormList from './FormListFeedMeal/SilageFieldFormList';

interface FeedMealReviewProps {
  dry: number;
  cowType: any[];
  dataReview: any;
}

const FeedMealReview = ({ dry, cowType, dataReview }: FeedMealReviewProps) => {
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
    FEED_PATH.CREATE_FEED_MEALS,
    'POST'
  );
  const isFormValid = (values: any): boolean => {
    if (!values) return false; // If form values are empty, disable the button

    return Object.values(values).every((value) => {
      if (Array.isArray(value)) {
        return value.length > 0 && value.every((item) => isFormValid(item)); // Recursively check nested fields
      } else if (typeof value === 'object' && value !== null) {
        return isFormValid(value); // Recursively check objects
      } else {
        return Boolean(value); // Ensure value is not empty
      }
    });
  };
  const formValues = Form.useWatch([], form);
  const isButtonDisabled = !isFormValid(formValues);

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
      cowStatus: values.cowStatus,
      details: [
        ...transformDetails(values.detailsHay),
        ...transformDetails(values.detailsRefined),
        ...transformDetails(values.detailsSilage),
        ...transformDetails(values.detailsMineral),
      ],
    };
    try {
      const response = await triggerFeedMeal({ body: payload });
      toast.showSuccess(response.message);
      navigate('../list');
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  return (
    <div>
      <FormComponent
        form={form}
        name="dynamic_form_nest_item"
        autoComplete="off"
        labelCol={{ span: 24 }}
        initialValues={{
          name: dataReview?.name,
          description: dataReview.description,
          cowTypeId: dataReview.cowTypeId,
          cowStatus: dataReview.cowStatus,
          detailsHay: dataReview.detailsHay,
          detailsRefined: dataReview.detailsRefined,
          detailsSilage: dataReview.detailsSilage,
          detailsMineral: dataReview.detailsMineral,
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
                  name="name"
                  label={<LabelForm>{t('Name')}</LabelForm>}
                  className="col-span-1"
                >
                  <InputComponent disabled />
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
                    disabled={true}
                  />
                </FormItemComponent>
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="cowStatus"
                  label={<LabelForm>{t('Cow Status')}</LabelForm>}
                >
                  <SelectComponent
                    options={cowStatus()}
                    open={false}
                    className="!cursor-default"
                    disabled={true}
                  />
                </FormItemComponent>
              </div>
              <div className="w-2/3 min-h-full">
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="description"
                  label={<LabelForm>{t('Description')}</LabelForm>}
                  className="!h-full"
                >
                  <QuillRender
                    description={dataReview.description}
                    className="!h-[320px]"
                  />
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
                  hay={hay}
                  hayTotal={hayTotal}
                  disabled={true}
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
                  refinedFood={refinedFood}
                  refinedTotal={refinedTotal}
                  disabled={true}
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
                  silage={silage}
                  silageTotal={silageTotal}
                  disabled={true}
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
                  mineralTotal={mineralsTotal}
                  minerals={minerals}
                  disabled={true}
                />
              </Splitter.Panel>
            </Splitter>
            <Form.Item className="!w-full flex justify-center">
              <ButtonComponent
                className="!w-[500px]"
                type="primary"
                htmlType="submit"
                disabled={isButtonDisabled}
              >
                {t('Submit')}
              </ButtonComponent>
            </Form.Item>
          </>
        )}
      </FormComponent>
    </div>
  );
};

export default FeedMealReview;
