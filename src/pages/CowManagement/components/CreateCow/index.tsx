import { Form, Steps } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import ButtonComponent from "../../../../components/Button/ButtonComponent";
import FormComponent from "../../../../components/Form/FormComponent";
import WhiteBackground from "../../../../components/UI/WhiteBackground";
import useFetcher from "../../../../hooks/useFetcher";
import useToast from "../../../../hooks/useToast";
import { Cow } from "../../../../model/Cow/Cow";
import CreateCowInformation from "./CreateCowInformation/CreateCowInformation";

const CreateCow = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [inforData, setInforData] = useState<Cow>();
  const { trigger, isLoading } = useFetcher("cows/create", "POST");
  const toast = useToast();

  const steps = [
    {
      title: "General Information",
      content: <CreateCowInformation />,
    },
    {
      title: "Health Information",
      content: <div>{inforData?.cowId} </div>,
    },
  ];

  const handleClear = () => {
    form.resetFields();
  };

  const handleFinish = async (values: any) => {
    if (currentStep < steps.length - 1) {
      if (currentStep === 0) {
        const data = {
          name: values.name,
          cowStatus: values.cowStatus,
          dateOfBirth: dayjs(values.dateOfBirth).format("YYYY-MM-DD"),
          dateOfEnter: dayjs(values.dateOfEnter).format("YYYY-MM-DD"),
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
      setCurrentStep(0);
      handleClear();
    }
  };

  return (
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
              Clear All
            </ButtonComponent>
          )}
          <ButtonComponent type="primary" htmlType="submit" loading={isLoading}>
            {currentStep === steps.length - 1 ? "Done" : "Next"}
          </ButtonComponent>
        </div>
      </FormComponent>
    </WhiteBackground>
  );
};

export default CreateCow;
