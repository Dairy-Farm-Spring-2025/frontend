import ButtonComponent from '@components/Button/ButtonComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import SelectComponent from '@components/Select/SelectComponent';
import { StepItem } from '@components/Steps/StepsComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import TagComponents from '@components/UI/TagComponents';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { CowType } from '@model/Cow/CowType';
import { COW_TYPE_PATH } from '@service/api/CowType/cowType';
import { FEED_PATH } from '@service/api/Feed/feedApi';
import { COW_STATUS_DRY_MATTER } from '@service/data/cowStatus';
import { Form, SelectProps, Spin, Steps } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdArrowRoundBack } from 'react-icons/io';
import FeedMealForm from './components/FeedMealForm';
import FeedMealReview from './components/FeedMealReview';
import useRequiredForm from '@hooks/useRequiredForm';
import { CowStatus } from '@model/Cow/Cow';

const CreateFeedMeal = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [formFeedMeal] = Form.useForm();
  const { t } = useTranslation();
  const toast = useToast();
  const [cowTypes, setCowTypes] = useState<SelectProps['options']>([]);
  const [checkDryMatter, setCheckDryMatter] = useState<boolean>(false);
  const [cowTypesSelected, setCowTypesSelected] = useState(0);
  const [cowStatusSelected, setCowStatusSelected] = useState('');
  const [dataReview, setDataReview] = useState([]);
  const [dry, setDry] = useState<number>(0);
  const { data: cowType, isLoading: isLoadingCowType } = useFetcher<CowType[]>(
    COW_TYPE_PATH.COW_TYPES,
    'GET'
  );
  const buttonDisabled = useRequiredForm(form, ['cowTypeId', 'cowStatus']);
  const [messageCheckExist, setMessageCheckExist] = useState('');

  const { trigger: triggerDryMatter, isLoading: loadingDryMatter } = useFetcher(
    FEED_PATH.FEED_MEAL_DRY_MATTER,
    'POST'
  );

  const { isLoading: isLoadingCheckExist, trigger: triggerCheckExists } =
    useFetcher('check-exists', 'GET', 'application/json', false);

  useEffect(() => {
    if (cowType) {
      setCowTypes(
        cowType.map((element: CowType) => {
          const searchLabel = `${element.name} ${element.maxWeight}`;
          return {
            label: `${element.name} - ${element.maxWeight} (kg)`,
            value: element.cowTypeId,
            searchLabel,
          };
        })
      );
    }
  }, [cowType]);

  useEffect(() => {
    const fetchExist = async (cowTypeId: number, cowStatus: CowStatus) => {
      try {
        await triggerCheckExists({
          url: FEED_PATH.CHECK_EXISTS(cowTypeId, cowStatus),
        });
        setMessageCheckExist('');
      } catch (error: any) {
        setMessageCheckExist(error?.message || 'Something errors');
      }
    };
    if (cowStatusSelected && cowStatusSelected) {
      fetchExist(cowTypesSelected, cowStatusSelected as CowStatus);
    }
  }, [cowStatusSelected, cowTypesSelected]);

  const handleBack = async () => {
    setCurrentStep((prev) => prev - 1);
    form.resetFields();
    setCheckDryMatter(false);
    setDry(0);
  };

  const handleBackFromReview = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onFinishDryMatter = async (values: any) => {
    try {
      const response = await triggerDryMatter({ body: values });
      formFeedMeal.resetFields();
      setDry(response.data.dryMatter);
      setCheckDryMatter(true);
      setCurrentStep((prev) => prev + 1);
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const onReview = async (values: any) => {
    setDataReview(values);
    setCurrentStep((prev) => prev + 1);
  };

  const step: StepItem[] = [
    {
      title: `🧮 ${t('Calculate dry matter')}`,
      description: t('Calculate dry matter base on cow type and cow status'),
      content: (
        <FormComponent form={form} onFinish={onFinishDryMatter}>
          <div className="grid grid-cols-3 gap-10 w-2/3">
            <FormItemComponent
              name="cowTypeId"
              rules={[{ required: true }]}
              label={<LabelForm>{t('Cow Type')}</LabelForm>}
            >
              <SelectComponent
                search
                options={cowTypes}
                loading={isLoadingCowType}
                value={cowTypesSelected}
                onChange={setCowTypesSelected}
              />
            </FormItemComponent>
            <FormItemComponent
              rules={[{ required: true }]}
              name="cowStatus"
              label={<LabelForm>{t('Cow Status')}</LabelForm>}
            >
              <SelectComponent
                options={COW_STATUS_DRY_MATTER()}
                value={cowStatusSelected}
                onChange={setCowStatusSelected}
              />
            </FormItemComponent>
            <ButtonComponent
              disabled={buttonDisabled || messageCheckExist !== ''}
              loading={loadingDryMatter || isLoadingCheckExist}
              className="mt-10"
              htmlType="submit"
              type="primary"
            >
              {t('Watch dry matter')}
            </ButtonComponent>
          </div>
          <p className="!text-base text-red-500 font-semibold ml-1">
            {messageCheckExist}
          </p>
        </FormComponent>
      ),
    },
    {
      title: `🍽️ ${t('Enter the feed meal details')}`,
      description: t('Enter feed meal information base on dry matter result'),
      content: (
        <div className="flex flex-col gap-2">
          {loadingDryMatter ? (
            <div className="w-full flex flex-col items-center">
              <Spin />
              <p className="text-xl font-medium">
                {t('Calculating dry matter')}
              </p>
            </div>
          ) : dry > 0 ? (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-5">
                <ButtonComponent
                  className="!shadow-md"
                  icon={<IoMdArrowRoundBack size={20} />}
                  onClick={handleBack}
                  type="default"
                  buttonType="volcano"
                >
                  {t('Back')}
                </ButtonComponent>
                <div className="flex gap-2">
                  <p className="font-semibold text-lg">{t('Dry matter')}:</p>
                  <TagComponents color="green-inverse" className="text-xl">
                    <span className="font-bold">{dry}</span> ({t('kilogram')})
                  </TagComponents>
                </div>
              </div>
              {checkDryMatter && (
                <div>
                  <FeedMealForm
                    form={formFeedMeal}
                    onReview={onReview as any}
                    cowStatusSelected={cowStatusSelected}
                    cowTypeSelected={cowTypesSelected}
                    cowType={cowTypes as any[]}
                    dry={dry}
                  />
                </div>
              )}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      ),
    },
    {
      title: `📄 ${t('review', { defaultValue: 'Review' })}`,
      description: t('Review information that is entered before creating new'),
      content: (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-10">
            <ButtonComponent
              className="!shadow-md"
              icon={<IoMdArrowRoundBack size={20} />}
              onClick={handleBackFromReview}
              type="default"
              buttonType="volcano"
            >
              {t('Back')}
            </ButtonComponent>
            <div className="flex gap-2">
              <p className="font-semibold text-lg">{t('Dry matter')}:</p>
              <TagComponents color="green-inverse" className="text-lg">
                <span className="font-bold">{dry}</span> (kilogram)
              </TagComponents>
            </div>
          </div>
          <FeedMealReview
            cowType={cowTypes as any[]}
            dataReview={dataReview}
            dry={dry}
          />
        </div>
      ),
    },
  ];

  return (
    <AnimationAppear>
      <WhiteBackground>
        <Steps current={currentStep} items={step}>
          {/* {step.map((element, index) => (
            <Steps.Step key={index} title={element.title} />
          ))} */}
        </Steps>
        <div className="mt-10">{step[currentStep].content}</div>
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default CreateFeedMeal;
