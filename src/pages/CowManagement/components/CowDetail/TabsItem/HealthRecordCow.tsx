import CardComponent from '@components/Card/CardComponent';
import { Flex, Form, Splitter, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { BsClipboard2, BsEmojiDizzy } from 'react-icons/bs';
import { CgSmileSad } from 'react-icons/cg';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { RiEmotionNormalLine } from 'react-icons/ri';
import FormComponent from '@components/Form/FormComponent';
import TimelineComponent, {
  TimelineItems,
} from '@components/Timeline/TimelineComponent';
import Title from '@components/UI/Title';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { HealthResponse } from '@model/Cow/Cow';
import {
  HealthRecord,
  HealthRecordPayload,
  Injections,
} from '@model/Cow/HealthRecord';
import { IllnessCow } from '@model/Cow/Illness';
import { formatDateHour, formatToTitleCase } from '@utils/format';
import HealthRecordForm from './components/SplitterSide/HealthRecordForm';
import IllnessRecordForm from './components/SplitterSide/IllnessRecordForm';
import InjectionForm from './components/SplitterSide/InjectionForm';
import { HEALTH_RECORD_PATH } from '@service/api/HealthRecord/healthRecordApi';
import { useEditToggle } from '@hooks/useEditToggle';

interface HealthRecordCowProps {
  data: HealthResponse[];
  mutate: any;
  cowId: string;
}

const SIZE_ICON = 20;

const HealthRecordCow = ({ cowId, data, mutate }: HealthRecordCowProps) => {
  const [form] = Form.useForm();
  const [formIllness] = Form.useForm();
  const { edited: editedHealthRecord, toggleEdit: toggleEditHealthRecord } =
    useEditToggle();
  const toast = useToast();
  const [type, setType] = useState<
    'HEALTH_RECORD' | 'ILLNESS' | 'INJECTIONS' | null
  >(null);
  const [day, setDay] = useState('');
  const [dataHealthResponse, setDataHealthResponse] = useState<any>();
  const [illness, setIllness] = useState<IllnessCow>();

  const { trigger: triggerUpdateHealthRecord, isLoading: loadingUpdateHealth } =
    useFetcher('update/health-record', 'PUT');
  const { trigger: triggerUpdateIllness, isLoading: isLoadingUpdateIllness } =
    useFetcher('update/illness', 'PUT');
  const { isLoading: isLoadingHealthRecord, trigger: triggerHealthRecord } =
    useFetcher(HEALTH_RECORD_PATH.CREATE_HEALTH_RECORD, 'POST');

  // Define handleOpenLeftSide outside useMemo for reusability
  const handleOpenLeftSide = (
    type: 'HEALTH_RECORD' | 'ILLNESS' | 'INJECTIONS',
    data: HealthRecord | IllnessCow | Injections,
    day: string
  ) => {
    setType(type);
    setDay(day);
    setDataHealthResponse(data);

    if (type === 'HEALTH_RECORD') {
      const healthData = data as HealthRecord;
      form.setFieldsValue({
        status: healthData.status,
        period: healthData.period,
        weight: healthData.weight,
        size: healthData.size,
        cowId: healthData?.cowEntity?.cowId || Number(cowId),
        healthId: healthData?.healthRecordId,
        bodyTemperature: healthData?.bodyTemperature,
        heartRate: healthData?.heartRate,
        respiratoryRate: healthData?.respiratoryRate,
        ruminateActivity: healthData?.ruminateActivity,
        description: healthData?.description,
        chestCircumference: healthData?.chestCircumference,
        bodyLength: healthData?.bodyLength,
      });
    }
    if (type === 'ILLNESS') {
      const illnessData = data as IllnessCow;
      setIllness(illnessData);
      formIllness.setFieldsValue({
        severity: illnessData?.severity,
        startDate: illnessData?.startDate ? dayjs(illnessData.startDate) : null,
        endDate: illnessData?.endDate ? dayjs(illnessData.endDate) : null,
        symptoms: illnessData?.symptoms,
        prognosis: illnessData?.prognosis,
        cowId: illnessData?.cowEntity?.cowId,
        illnessId: illnessData?.illnessId,
      });
    }
    if (type === 'INJECTIONS') {
      const injectionData = data as Injections;
      form.setFieldsValue({
        vaccineName: injectionData.vaccineCycleDetail?.name,
        date: injectionData.injectionDate
          ? dayjs(injectionData.injectionDate)
          : null,
        administeredBy: injectionData.administeredBy?.name,
        dosage: `${injectionData.vaccineCycleDetail?.dosage} ${injectionData.vaccineCycleDetail?.dosageUnit}`,
        injectionSite: injectionData.vaccineCycleDetail?.injectionSite,
        cowId: injectionData?.cowEntity?.cowId,
        healthId: injectionData?.id,
      });
    }
  };

  // Type guard for Injections
  function isInjection(data: any): data is Injections {
    return (
      data &&
      typeof data === 'object' &&
      'vaccineCycleDetail' in data &&
      'injectionDate' in data
    );
  }

  const onFinishUpdateHealthRecord = async (values: any) => {
    const payload: HealthRecordPayload = {
      status: values.status,
      period: values.period,
      size: values.size,
      cowId: values.cowId,
      bodyLength: values.bodyLength,
      bodyTemperature: values.bodyTemperature,
      chestCircumference: values.chestCircumference,
      description: values.description,
      heartRate: values.heartRate,
      respiratoryRate: values.respiratoryRate,
      ruminateActivity: values.ruminateActivity,
    };
    try {
      const response = await triggerUpdateHealthRecord({
        url: HEALTH_RECORD_PATH.UPDATE_HEALTH_RECORD(values.healthId),
        body: payload,
      });
      toggleEditHealthRecord();
      toast.showSuccess(response.message);
      await mutate();
      setType('HEALTH_RECORD');
      setDay(day); // Preserve the current day
      setDataHealthResponse({ ...dataHealthResponse, ...payload }); // Update local state
      form.setFieldsValue({ ...values, ...payload });
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const onFinishIllnessRecord = async (values: any) => {
    try {
      const payload = {
        symptoms: values?.symptoms,
        severity: values?.severity,
        startDate: values?.startDate.format('YYYY-MM-DD'),
        endDate: values?.endDate.format('YYYY-MM-DD'),
        prognosis: values?.prognosis,
        cowId: values?.cowId,
      };
      const response = await triggerUpdateIllness({
        url: HEALTH_RECORD_PATH.UPDATE_ILLNESS(values.illnessId),
        body: payload,
      });
      toast.showSuccess(response.message);
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const onCreateHealth = async (values: any) => {
    try {
      const payload = {
        status: values.status,
        period: values.period,
        size: values.size,
        cowId: Number(cowId),
        bodyLength: values.bodyLength,
        bodyTemperature: values.bodyTemperature,
        chestCircumference: values.chestCircumference,
        description: values.description,
        heartRate: values.heartRate,
        respiratoryRate: values.respiratoryRate,
        ruminateActivity: values.ruminateActivity,
      };
      const response = await triggerHealthRecord({
        body: payload,
      });
      toast.showSuccess(response.message);
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const items: TimelineItems[] = useMemo(() => {
    return data.map((element) => ({
      children: (
        <div
          className="ml-10 w-3/4 cursor-pointer hover:!opacity-55 duration-200"
          onClick={() =>
            handleOpenLeftSide(element?.type, element?.health, element?.date)
          }
        >
          <CardComponent title={formatToTitleCase(element?.type)}>
            {(element.type === 'HEALTH_RECORD' && (
              <>
                <Tooltip title="Status">
                  <p>
                    {formatToTitleCase(
                      (element.health as HealthRecord)?.status
                    )}
                  </p>
                </Tooltip>
              </>
            )) ||
              (element.type === 'ILLNESS' && (
                <div className="flex gap-2">
                  <Tooltip title="Severity">
                    <p>
                      {formatToTitleCase(
                        (element.health as IllnessCow)?.severity
                      )}
                    </p>
                  </Tooltip>
                  <p>-</p>
                  <Tooltip title="Veterinarian">
                    <p>
                      {(element.health as IllnessCow)?.veterinarian
                        ? (element.health as IllnessCow)?.veterinarian?.name
                        : 'No veterinarian'}
                    </p>
                  </Tooltip>
                </div>
              )) ||
              (element.type === 'INJECTIONS' && (
                <div className="flex gap-2">
                  <Tooltip title="Vaccine">
                    <p>
                      {(element.health as Injections)?.vaccineCycleDetail?.name}
                    </p>
                  </Tooltip>
                  <p>-</p>
                  <Tooltip title="Administered By">
                    <p>
                      {(element.health as Injections)?.administeredBy?.name}
                    </p>
                  </Tooltip>
                </div>
              ))}
          </CardComponent>
        </div>
      ),
      dot: (
        <div className="flex flex-col justify-center items-center !w-full gap-2 !h-fit">
          {(element.type === 'HEALTH_RECORD' && (
            <BsClipboard2 size={SIZE_ICON} color="blue" />
          )) ||
            (element.type === 'ILLNESS' &&
              (((element.health as IllnessCow)?.severity === 'mild' && (
                <Tooltip title={'Mild'}>
                  <HiOutlineEmojiHappy size={SIZE_ICON} color="green" />
                </Tooltip>
              )) ||
                ((element.health as IllnessCow)?.severity === 'moderate' && (
                  <Tooltip title={'Moderate'}>
                    <RiEmotionNormalLine size={SIZE_ICON} color="purple" />
                  </Tooltip>
                )) ||
                ((element.health as IllnessCow)?.severity === 'severe' && (
                  <Tooltip title={'Severe'}>
                    <CgSmileSad size={SIZE_ICON} color="orange" />
                  </Tooltip>
                )) ||
                ((element.health as IllnessCow)?.severity === 'critical' && (
                  <Tooltip title={'Critical'}>
                    <BsEmojiDizzy size={SIZE_ICON} color="red" />
                  </Tooltip>
                )))) ||
            (element.type === 'INJECTIONS' && (
              <Tooltip title="Injection">
                <BsClipboard2 size={SIZE_ICON} color="teal" />
              </Tooltip>
            ))}
          <p>{formatDateHour(element.date)}</p>
        </div>
      ),
    }));
  }, [cowId, data, form, formIllness]);

  const DescLeft: React.FC<Readonly<{ text?: string | number }>> = () => (
    <Flex justify="center" align="start">
      <TimelineComponent className="ml-10 mt-10" items={items} reverse={true} />
    </Flex>
  );

  return (
    <div className="min-h-full">
      {items.length === 0 ? (
        <FormComponent
          form={form}
          onFinish={onCreateHealth}
          className="!w-full"
        >
          <HealthRecordForm
            loading={isLoadingHealthRecord}
            cowId={cowId}
            edited={editedHealthRecord}
            toggleEdit={toggleEditHealthRecord}
          />
        </FormComponent>
      ) : (
        <Splitter className="flex w-full h-[70vh] !min-h-[500px]">
          <Splitter.Panel
            className="w-fit"
            defaultSize={'40%'}
            min="40%"
            max="40%"
          >
            <div className="pt-5">
              <Title className="!text-2xl mb-5">Record Timeline</Title>
            </div>
            <DescLeft />
          </Splitter.Panel>
          <Splitter.Panel defaultSize="60%" min="60%" max="60%">
            <div className="p-5">
              {type === 'HEALTH_RECORD' && (
                <FormComponent
                  form={form}
                  onFinish={onFinishUpdateHealthRecord}
                  className="!w-full"
                >
                  <HealthRecordForm
                    edited={editedHealthRecord}
                    toggleEdit={toggleEditHealthRecord}
                    loading={loadingUpdateHealth}
                    day={day}
                    data={dataHealthResponse as HealthRecord}
                    cowId={cowId}
                  />
                </FormComponent>
              )}
              {type === 'ILLNESS' && (
                <FormComponent
                  form={formIllness}
                  onFinish={onFinishIllnessRecord}
                  className="w-full"
                >
                  <IllnessRecordForm
                    loading={isLoadingUpdateIllness}
                    data={illness as IllnessCow}
                  />
                </FormComponent>
              )}
              {type === 'INJECTIONS' && (
                <div className="w-2/3">
                  <InjectionForm form={form} onBack={() => setType(null)} />
                </div>
              )}
            </div>
          </Splitter.Panel>
        </Splitter>
      )}
    </div>
  );
};

export default HealthRecordCow;