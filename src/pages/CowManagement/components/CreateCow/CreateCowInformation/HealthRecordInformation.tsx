import { useTranslation } from 'react-i18next';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import SelectComponent from '@components/Select/SelectComponent';
import Title from '@components/UI/Title';
import { cowStatus } from '@service/data/cowStatus';
import { HEALTH_RECORD_STATUS } from '@service/data/healthRecordStatus';

const HealthRecordInformation = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-8 ">
      <div className="flex flex-col gap-5 w-1/3">
        <Title className="!text-2xl">{t('Health Status')}</Title>
        <div className="flex flex-col gap-8">
          <FormItemComponent
            name="status"
            label={<LabelForm>{t('Status')}:</LabelForm>}
          >
            <SelectComponent options={HEALTH_RECORD_STATUS()} />
          </FormItemComponent>
          <FormItemComponent
            name="period"
            label={<LabelForm>{t('Period')}:</LabelForm>}
          >
            <SelectComponent options={cowStatus()} />
          </FormItemComponent>
        </div>
      </div>
      <div className="flex flex-col gap-5 w-1/3">
        <Title className="!text-2xl">{t('Health Physical')}</Title>
        <div className="flex flex-col gap-8 ">
          {/* <FormItemComponent
            name="weight"
            label={<LabelForm>{t('Weight')}:</LabelForm>}
          >
            <div className="flex items-center gap-2">
              <InputComponent.Number />
              <p>(kilogram)</p>
            </div>
          </FormItemComponent> */}
          <FormItemComponent
            name="size"
            label={<LabelForm>{t('Size')}:</LabelForm>}
          >
            <div className="flex items-center gap-2">
              <InputComponent.Number />
              <p>(meter)</p>
            </div>
          </FormItemComponent>
        </div>
      </div>
    </div>
  );
};

export default HealthRecordInformation;
