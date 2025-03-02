import { Form, Steps } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import ButtonComponent from '@components/Button/ButtonComponent';
import FormComponent from '@components/Form/FormComponent';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { Cow } from '@model/Cow/Cow';
import CreateCowInformation from './CreateCowInformation/CreateCowInformation';
import AnimationAppear from '@components/UI/AnimationAppear';
import HealthRecordInformation from './CreateCowInformation/HealthRecordInformation';
import { useTranslation } from 'react-i18next';

const CreateCow = () => {
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);
  const [disabledButton, setDisabledButton] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [inforData, setInforData] = useState<Cow>();
  const { trigger, isLoading } = useFetcher('cows/create', 'POST');
  const { t } = useTranslation();
  const { isLoading: isLoadingHealthRecord, trigger: triggerHealthRecord } =
    useFetcher('health-record', 'POST');
  const toast = useToast();

  useEffect(() => {
    const isButtonDisabled =
      !formValues || Object.values(formValues).some((value) => !value);
    setDisabledButton(isButtonDisabled);
  }, [formValues]);

  const steps = [
    {
      title: t('General Information'),
      content: <CreateCowInformation />,
    },
    {
      title: t('Health Information'),
      content: <HealthRecordInformation />,
    },
  ];

  const handleClear = () => {
    form.resetFields();
  };

  const handleFinish = async (values: any) => {
    if (currentStep < steps.length - 1) {
      if (currentStep === 0) {
        const data = {
          cowStatus: values.cowStatus,
          dateOfBirth: dayjs(values.dateOfBirth).format('YYYY-MM-DD'),
          dateOfEnter: dayjs(values.dateOfEnter).format('YYYY-MM-DD'),
          cowOrigin: values.cowOrigin,
          gender: values.gender,
          cowTypeId: values.cowTypeId,
          description: values.description,
        };
        try {
          const response = await trigger({ body: data });
          setInforData(response.data);
          toast.showSuccess(response.message);
          handleClear();
          setCurrentStep((prev) => prev + 1);
        } catch (error: any) {
          toast.showError(error.message);
        }
      }
    }
    if (currentStep === 1) {
      try {
        const payload = {
          status: values.status,
          period: values.period,
          weight: values.weight,
          size: values.size,
          cowId: inforData?.cowId,
          reportTime: '2025-02-15T02:46:21.358Z',
        };
        const response = await triggerHealthRecord({ body: payload });
        toast.showSuccess(response.message);
        setCurrentStep(0);
        handleClear();
      } catch (error: any) {
        toast.showError(error.message);
      }
    }
  };

  return (
    <AnimationAppear>
      <WhiteBackground>
        <Steps current={currentStep}>
          {steps.map((element, index) => (
            <Steps.Step key={index} title={element.title} />
          ))}
        </Steps>
        <FormComponent
          onFinish={handleFinish}
          form={form}
          className="p-2 flex flex-col gap-5"
        >
          {steps[currentStep].content}
          <div className="flex justify-end gap-5">
            {currentStep === 0 && (
              <ButtonComponent
                onClick={handleClear}
                type="primary"
                className="!bg-orange-500"
              >
                {t('Clear All')}
              </ButtonComponent>
            )}
            {currentStep === 0 && (
              <ButtonComponent
                type="primary"
                htmlType="submit"
                loading={isLoading}
                disabled={disabledButton}
              >
                {t('Next')}
              </ButtonComponent>
            )}
            {currentStep === 1 && (
              <ButtonComponent
                type="primary"
                disabled={disabledButton}
                htmlType="submit"
                loading={isLoadingHealthRecord}
              >
                {t('Done')}
              </ButtonComponent>
            )}
          </div>
        </FormComponent>
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default CreateCow;
