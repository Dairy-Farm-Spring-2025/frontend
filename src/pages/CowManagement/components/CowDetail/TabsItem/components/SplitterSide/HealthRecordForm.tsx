import { WarningFilled } from '@ant-design/icons';
import CardComponent from '@components/Card/CardComponent';
import DescriptionComponent from '@components/Description/DescriptionComponent';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import QuillRender from '@components/UI/QuillRender';
import useFetcher from '@hooks/useFetcher';
import { Cow } from '@model/Cow/Cow';
import { HealthRecord } from '@model/Cow/HealthRecord';
import { COW_PATH } from '@service/api/Cow/cowApi';
import { formatDateHour, formatStatusWithCamel } from '@utils/format';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import ButtonComponent from '@components/Button/ButtonComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import SelectComponent from '@components/Select/SelectComponent';
import Title from '@components/UI/Title';
import { cowStatus } from '@service/data/cowStatus';
import { HEALTH_RECORD_STATUS } from '@service/data/healthRecordStatus';
import { useEffect } from 'react';

interface HealthRecordFormProps {
  loading: boolean;
  day?: string;
  data?: HealthRecord;
  cowId?: string;
  edited?: boolean;
  toggleEdit?: any;
}

const LabelDescription = ({ children }: any) => {
  return <p>{children}</p>;
};

interface WarningIconProps {
  tooltip: string;
}

const WarningIcon = ({ tooltip }: WarningIconProps) => {
  return (
    <Tooltip title={tooltip}>
      <WarningFilled className="!text-orange-500 !text-lg" />
    </Tooltip>
  );
};

const HealthRecordForm = ({
  loading,
  day,
  data,
  cowId,
  edited,
  toggleEdit,
}: HealthRecordFormProps) => {
  const { data: dataCow, isLoading } = useFetcher<Cow>(
    COW_PATH.COW_DETAIL(cowId ? cowId : ''),
    'GET'
  );
  const disabledUpdate = !dayjs(day).isSame(new Date(), 'day');
  useEffect(() => {
    if (data === undefined) {
      toggleEdit();
    }
  }, [data]);
  return (
    <CardComponent
      className="!w-full"
      title={
        <Title className="!text-xl !text-center">
          {t('Health Record')} {day && formatDateHour(day)}
        </Title>
      }
      loading={loading || isLoading}
    >
      <div className="flex flex-col gap-2">
        <Title className="!text-xl">{t('Cow Information')}</Title>
        <DescriptionComponent
          layout="horizontal"
          items={[
            {
              label: t('Name'),
              children: dataCow?.name,
              span: 3,
            },
            {
              label: t('Gender'),
              children: (
                <div className="flex">
                  {dataCow?.gender === 'male' ? (
                    <IoMdMale className="text-blue-600" size={20} />
                  ) : (
                    <IoMdFemale className="text-pink-600" size={20} />
                  )}
                </div>
              ),
            },
            {
              label: t('Cow Type'),
              children: dataCow?.cowType?.name,
              span: 2,
            },
            {
              label: t('Cow Status'),
              children: dataCow
                ? t(formatStatusWithCamel(dataCow?.cowStatus))
                : 'N/A',
            },
            {
              label: t('Cow Origin'),
              children: dataCow
                ? t(formatStatusWithCamel(dataCow?.cowOrigin))
                : 'N/A',
              span: 2,
            },
          ]}
        />
      </div>
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
                  <LabelDescription>🕰️ {t('Period')}</LabelDescription>
                </div>
              ),
              children: !edited ? (
                data ? (
                  t(formatStatusWithCamel(data?.period))
                ) : (
                  'N/A'
                )
              ) : (
                <FormItemComponent rules={[{ required: true }]} name="period">
                  <SelectComponent options={cowStatus()} />
                </FormItemComponent>
              ),
              span: 3,
            },
            {
              label: (
                <div>
                  <LabelDescription>🐄 {t('Status')}</LabelDescription>
                </div>
              ),
              children: !edited ? (
                data ? (
                  t(formatStatusWithCamel(data?.status))
                ) : (
                  'N/A'
                )
              ) : (
                <FormItemComponent rules={[{ required: true }]} name="status">
                  <SelectComponent options={HEALTH_RECORD_STATUS()} />
                </FormItemComponent>
              ),
              span: 3,
            },
            {
              label: (
                <div>
                  <LabelDescription>📐 {t('Size')}</LabelDescription>
                </div>
              ),
              children: !edited ? (
                data?.size ? (
                  `${data?.size} m`
                ) : (
                  'N/A'
                )
              ) : (
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
                <div>
                  <LabelDescription>⚖️ {t('Weight')}</LabelDescription>
                </div>
              ),
              children: data?.weight ? `${data?.weight} kg` : 'N/A',
              span: 2,
            },
            {
              label: (
                <div className="flex gap-2 items-center">
                  <LabelDescription>❤️ {t('Heart Rate')}</LabelDescription>
                  {data && (data?.heartRate < 60 || data?.heartRate > 80) && (
                    <WarningIcon tooltip={t('Heart rate is not stable')} />
                  )}
                </div>
              ),
              children: !edited ? (
                data?.heartRate ? (
                  `${data?.heartRate} BPM`
                ) : (
                  'N/A'
                )
              ) : (
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="heartRate"
                  className=""
                >
                  <InputComponent.Number addonAfter={'BPM'} />
                </FormItemComponent>
              ),
              span: 2,
            },
            {
              label: (
                <div className="flex gap-2 items-center">
                  <LabelDescription>
                    🫁 {t('Respiratory Rate')}
                  </LabelDescription>
                  {data &&
                    (data?.respiratoryRate < 10 ||
                      data?.respiratoryRate > 30) && (
                      <WarningIcon
                        tooltip={t('Respiratory rate is not stable')}
                      />
                    )}
                </div>
              ),
              children: !edited ? (
                data?.respiratoryRate ? (
                  `${data?.respiratoryRate} / ${t('minutes')}`
                ) : (
                  'N/A'
                )
              ) : (
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="respiratoryRate"
                  className=""
                >
                  <InputComponent.Number addonAfter={` / ${t('minutes')}`} />
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
                  {data &&
                    (data?.ruminateActivity < 400 ||
                      data?.ruminateActivity > 600) && (
                      <WarningIcon
                        tooltip={t('Ruminate activity is not stable')}
                      />
                    )}
                </div>
              ),
              children: !edited ? (
                data?.ruminateActivity ? (
                  `${data?.ruminateActivity} ${t('minutes')} / ${t('day')}`
                ) : (
                  'N/A'
                )
              ) : (
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="ruminateActivity"
                  className=""
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
                <div className="flex items-center gap-2">
                  <LabelDescription>
                    🌡️ {t('Body Temperature')}
                  </LabelDescription>
                  {data &&
                    (data?.bodyTemperature < 38 ||
                      data?.bodyTemperature > 39.5) && (
                      <WarningIcon
                        tooltip={t('Body templerature is not stable')}
                      />
                    )}
                </div>
              ),
              children: !edited ? (
                data?.bodyTemperature ? (
                  `${data?.bodyTemperature}°C`
                ) : (
                  'N/A'
                )
              ) : (
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="bodyTemperature"
                  className=""
                >
                  <InputComponent.Number addonAfter={`°C`} />
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
              children: !edited ? (
                data?.chestCircumference ? (
                  `${data?.chestCircumference} m`
                ) : (
                  'N/A'
                )
              ) : (
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="chestCircumference"
                  className=""
                >
                  <InputComponent.Number addonAfter={`m`} />
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
              children: !edited ? (
                data?.bodyLength ? (
                  `${data?.bodyLength} m`
                ) : (
                  'N/A'
                )
              ) : (
                <FormItemComponent
                  name="bodyLength"
                  className=""
                  rules={[{ required: true }]}
                >
                  <InputComponent.Number addonAfter={`m`} />
                </FormItemComponent>
              ),
              span: 3,
            },
          ]}
        />
      </div>
      <div className="my-5">
        {!edited ? (
          <QuillRender
            description={
              data?.description
                ? (data?.description as string)
                : t('No content')
            }
          />
        ) : (
          <FormItemComponent
            name="description"
            label={<LabelForm>{t('Description')}</LabelForm>}
            rules={[{ required: true }]}
          >
            <ReactQuillComponent />
          </FormItemComponent>
        )}
      </div>
      <FormItemComponent name="cowId" hidden>
        <InputComponent />
      </FormItemComponent>
      <FormItemComponent name="healthId" hidden>
        <InputComponent />
      </FormItemComponent>
      {data !== undefined && (
        <div className="flex gap-2 justify-end">
          {!disabledUpdate && (
            <ButtonComponent
              onClick={toggleEdit}
              type="primary"
              buttonType={!edited ? 'secondary' : 'warning'}
            >
              {!edited ? t('Edit health record') : t('Cancel')}
            </ButtonComponent>
          )}
          {edited && (
            <ButtonComponent htmlType="submit" type="primary">
              {t('Confirm')}
            </ButtonComponent>
          )}
        </div>
      )}
      {data === undefined && (
        <div className="flex gap-2 justify-end">
          <ButtonComponent htmlType="submit" type="primary">
            {t('Confirm')}
          </ButtonComponent>
        </div>
      )}
    </CardComponent>
  );
};

export default HealthRecordForm;
