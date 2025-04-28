import DescriptionComponent from '@components/Description/DescriptionComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import SelectComponent from '@components/Select/SelectComponent';
import Title from '@components/UI/Title';
import { HEALTH_RECORD_STATUS } from '@service/data/healthRecordStatus';
import { useTranslation } from 'react-i18next';

const LabelDescription = ({ children }: any) => {
  return (
    <p>
      {children} <span className="text-red-500">*</span>
    </p>
  );
};

const HealthRecordInformation = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2 px-[10%]">
      <div className="mt-5">
        <Title className="!text-xl mb-2">{t('Health Information')}</Title>
        <DescriptionComponent
          layout="horizontal"
          labelStyle={{
            fontSize: 15,
            fontWeight: 'bold',
            width: 230,
          }}
          items={[
            {
              label: (
                <div>
                  <LabelDescription>🐄 {t('Health Status')}</LabelDescription>
                </div>
              ),
              children: (
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="status"
                  className=" !mb-0"
                >
                  <SelectComponent options={HEALTH_RECORD_STATUS()} />
                </FormItemComponent>
              ),
              span: 2,
            },
            {
              label: (
                <div>
                  <LabelDescription>📐 {t('Size')}</LabelDescription>
                </div>
              ),
              children: (
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="size"
                  className=" !mb-0"
                >
                  <InputComponent.Number addonAfter={'m'} />
                </FormItemComponent>
              ),
              span: 2,
            },
            {
              label: (
                <div className="flex gap-2 items-center">
                  <LabelDescription>❤️ {t('Heart Rate')}</LabelDescription>
                </div>
              ),
              children: (
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="heartRate"
                  className=" !mb-0"
                >
                  <InputComponent.Number addonAfter={'BPM'} />
                </FormItemComponent>
              ),
              span: 2,
            },
            {
              label: (
                <div>
                  <LabelDescription>
                    🎯 {t('Chest Circumference')}
                  </LabelDescription>
                </div>
              ),
              children: (
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="chestCircumference"
                  className=" !mb-0"
                >
                  <InputComponent.Number addonAfter={`m`} />
                </FormItemComponent>
              ),
              span: 2,
            },
            {
              label: (
                <div className="flex gap-2 items-center">
                  <LabelDescription>
                    🐮 {t('Ruminate Activity')}
                  </LabelDescription>
                </div>
              ),
              children: (
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="ruminateActivity"
                  className=" !mb-0"
                >
                  <InputComponent.Number
                    addonAfter={`${t('minutes')} / ${t('day')}`}
                  />
                </FormItemComponent>
              ),
              span: 2,
            },
            {
              label: (
                <div>
                  <LabelDescription>📐 {t('Body Length')}</LabelDescription>
                </div>
              ),
              children: (
                <FormItemComponent
                  name="bodyLength"
                  className=" !mb-0"
                  rules={[{ required: true }]}
                >
                  <InputComponent.Number addonAfter={`m`} />
                </FormItemComponent>
              ),
              span: 3,
            },
            {
              label: (
                <div className="flex gap-2 items-center">
                  <LabelDescription>
                    🫁 {t('Respiratory Rate')}
                  </LabelDescription>
                </div>
              ),
              children: (
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="respiratoryRate"
                  className=" !mb-0"
                >
                  <InputComponent.Number addonAfter={` / ${t('minutes')}`} />
                </FormItemComponent>
              ),
              span: 2,
            },
            {
              label: (
                <div className="flex items-center gap-2">
                  <LabelDescription>
                    🌡️ {t('Body Temperature')}
                  </LabelDescription>
                </div>
              ),
              children: (
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="bodyTemperature"
                  className=" !mb-0"
                >
                  <InputComponent.Number addonAfter={`°C`} />
                </FormItemComponent>
              ),
              span: 2,
            },
          ]}
        />
      </div>
      <div className="my-5">
        <FormItemComponent
          name="description"
          label={<LabelForm>{t('Description')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <ReactQuillComponent />
        </FormItemComponent>
      </div>
      <FormItemComponent name="cowId" hidden>
        <InputComponent />
      </FormItemComponent>
      <FormItemComponent name="healthId" hidden>
        <InputComponent />
      </FormItemComponent>
    </div>
  );
};

export default HealthRecordInformation;