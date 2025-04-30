import ButtonComponent from '@components/Button/ButtonComponent';
import FormComponent from '@components/Form/FormComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { COW_PATH } from '@service/api/Cow/cowApi';
import { Form, Steps } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CreateCowInformation from './CreateCowInformation/CreateCowInformation';
import HealthRecordInformation from './CreateCowInformation/HealthRecordInformation';

// Utility to strip HTML tags from a string
const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').trim();
};

const CreateCow = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [generalInfo, setGeneralInfo] = useState<any>(null); // Store General Information data
  const { trigger, isLoading } = useFetcher(COW_PATH.COW_CREATE_SINGLE, 'POST'); // Use the import-single endpoint
  const { t } = useTranslation();
  const toast = useToast();
  const navigate = useNavigate(); // Initialize useNavigate

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

  const handleBack = () => {
    setCurrentStep(0); // Go back to Step 1
  };

  const handleFinish = async (values: any) => {
    if (currentStep < steps.length - 1) {
      // Step 1: Store General Information and proceed to the next step
      const generalData = {
        cowStatus: values.cowStatus,
        dateOfBirth: dayjs(values.dateOfBirth).format('YYYY-MM-DD'),
        dateOfEnter: dayjs(values.dateOfEnter).format('YYYY-MM-DD'),
        cowOrigin: values.cowOrigin,
        gender: values.gender,
        cowTypeId: parseInt(values.cowTypeId, 10), // Ensure cowTypeId is a number
        description: stripHtml(values.description), // Strip HTML from description
      };
      setGeneralInfo(generalData); // Store the data from the first step
      setCurrentStep((prev) => prev + 1); // Move to the next step
    } else {
      // Step 2: Combine General Information and Health Information, then call the API
      try {
        const healthData = {
          status: values.status,
          description: stripHtml(values.description), // Strip HTML from description
          size: parseFloat(values.size) || 0, // Ensure number
          bodyLength: parseFloat(values.bodyLength) || 0, // Ensure number
          bodyTemperature: parseFloat(values.bodyTemperature) || 0, // Ensure number
          chestCircumference: parseFloat(values.chestCircumference) || 0, // Ensure number
          heartRate: parseFloat(values.heartRate) || 0, // Ensure number
          respiratoryRate: parseFloat(values.respiratoryRate) || 0, // Ensure number
          ruminateActivity: parseFloat(values.ruminateActivity) || 0, // Ensure number
        };

        // Combine the data into the payload expected by the API
        const payload = {
          cow: {
            cowStatus: generalInfo.cowStatus,
            dateOfBirth: generalInfo.dateOfBirth,
            dateOfEnter: generalInfo.dateOfEnter,
            cowOrigin: generalInfo.cowOrigin,
            gender: generalInfo.gender,
            cowTypeId: generalInfo.cowTypeId,
            description: generalInfo.description,
          },
          healthRecord: healthData,
        };

        // Call the import-single API
        const response = await trigger({ body: payload });
        toast.showSuccess(response.message);

        // Extract cowId from the response
        const cowId = response.data?.cowId; // Adjust based on actual response structure
        console.log("check cow id:", cowId); // For debugging
        if (cowId) {
          navigate(`/dairy/cow-management/${cowId}`); // Redirect to CowDetail page
        } else {
          navigate('/dairy/cow-management'); // Fallback to ListCow page
        }

        setCurrentStep(0); // Reset to the first step
        setGeneralInfo(null); // Clear stored General Information
        handleClear(); // Clear the form
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
                disabled={isLoading}
              >
                {t('Next')}
              </ButtonComponent>
            )}
            {currentStep === 1 && (
              <>
                <ButtonComponent
                  onClick={handleBack}
                  type="default"
                >
                  {t('Back')}
                </ButtonComponent>
                <ButtonComponent
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                >
                  {t('Done')}
                </ButtonComponent>
              </>
            )}
          </div>
        </FormComponent>
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default CreateCow;