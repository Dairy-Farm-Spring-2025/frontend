import { StepProps, Steps } from 'antd';
import { useState } from 'react';
import ButtonComponent from '../Button/ButtonComponent';
import { useTranslation } from 'react-i18next';

export interface StepItem {
  title: string;
  content: string | React.ReactNode;
  description?: string;
  subTitle?: string;
  icon?: React.ReactNode;
  onNext?: () => Promise<void> | void;
  onDone?: () => Promise<void> | void;
  onPrevious?: () => Promise<void> | void;
  disabledAction?: boolean;
}

interface StepsComponentProps extends StepProps {
  steps: StepItem[];
  current: number;
  setCurrent: any;
}

const StepsComponent = ({
  steps,
  current,
  setCurrent,
}: StepsComponentProps) => {
  const [loading, setLoading] = useState(false); // Loading state for buttons
  const currentStep = steps[current];

  const prev = () => {
    setCurrent(current - 1);
    if (currentStep.onPrevious) {
      currentStep.onPrevious();
    }
  };
  const { t } = useTranslation();
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const next = async () => {
    if (currentStep.onNext) {
      try {
        setLoading(true);
        await currentStep.onNext();
        setCurrent((prev: number) => prev + 1);
      } catch (error: any) {
        console.error('Error in onNext:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setCurrent((prev: number) => prev + 1);
    }
  };

  const done = async () => {
    const currentStep = steps[current];
    if (currentStep.onDone) {
      try {
        setLoading(true);
        await currentStep.onDone();
        setCurrent(0);
      } catch (error: any) {
        console.error('Error in onNext:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <Steps current={current} items={items} />
      <div className="mt-5">{steps[current]?.content}</div>
      <div className="flex justify-end gap-5" style={{ marginTop: 24 }}>
        {current > 0 && (
          <ButtonComponent
            onClick={() => prev()}
            disabled={loading} // Disable while loading
          >
            {t('Previous')}
          </ButtonComponent>
        )}
        {current < steps.length - 1 && (
          <ButtonComponent
            type="primary"
            disabled={currentStep.disabledAction}
            onClick={() => next()}
            loading={loading}
          >
            {t('Next')}
          </ButtonComponent>
        )}
        {current === steps.length - 1 && (
          <ButtonComponent
            type="primary"
            onClick={() => done()}
            loading={loading}
          >
            {t('Confirm')}
          </ButtonComponent>
        )}
      </div>
    </div>
  );
};

export default StepsComponent;
