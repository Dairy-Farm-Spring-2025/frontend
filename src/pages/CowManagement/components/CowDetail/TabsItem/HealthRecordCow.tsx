import CardComponent from '@components/Card/CardComponent';
import { Flex, Form, Splitter, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
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
import { HealthRecord } from '@model/Cow/HealthRecord';
import { IllnessCow } from '@model/Cow/Illness';
import { formatDateHour, formatToTitleCase } from '@utils/format';
import HealthRecordForm from './components/SplitterSide/HealthRecordForm';
import IllnessRecordForm from './components/SplitterSide/IllnessRecordForm';
import { HEALTH_RECORD_PATH } from '@service/api/HealthRecord/healthRecordApi';

interface HealthRecordCowProps {
  data: HealthResponse[];
  mutate: any;
  cowId: string;
}

const SIZE_ICON = 20;

const HealthRecordCow = ({ cowId, data, mutate }: HealthRecordCowProps) => {
  const [form] = Form.useForm();
  const [formIllness] = Form.useForm();
  const toast = useToast();
  const [type, setType] = useState<'HEALTH_RECORD' | 'ILLNESS' | null>();
  const [illness, setIllness] = useState<IllnessCow>();
  const { trigger: triggerUpdateHealthRecord, isLoading: loadingUpdateHealth } =
    useFetcher('update/health-record', 'PUT');
  const { trigger: triggerUpdateIllness, isLoading: isLoadingUpdateIllness } =
    useFetcher('update/illness', 'PUT');
  const { isLoading: isLoadingHealthRecord, trigger: triggerHealthRecord } =
    useFetcher(HEALTH_RECORD_PATH.CREATE_HEALTH_RECORD, 'POST');
  const handleOpenLeftSide = (
    type: 'HEALTH_RECORD' | 'ILLNESS' | any,
    data: HealthRecord & IllnessCow
  ) => {
    setType(type);
    if (type === 'HEALTH_RECORD') {
      form.setFieldsValue({
        status: data.status,
        period: data.period,
        weight: data.weight,
        size: data.size,
        cowId: data?.cowEntity?.cowId,
        healthId: data?.healthRecordId,
      });
    }
    if (type === 'ILLNESS') {
      setIllness(data);
      formIllness.setFieldsValue({
        severity: data?.severity,
        startDate: data?.startDate ? dayjs(data.startDate) : null,
        endDate: data?.endDate ? dayjs(data.endDate) : null,
        symptoms: data?.symptoms,
        prognosis: data?.prognosis,
        cowId: data?.cowEntity?.cowId,
        illnessId: data?.illnessId,
      });
    }
  };

  const onFinishUpdateHealthRecord = async (values: any) => {
    const payload = {
      status: values.status,
      period: values.period,
      weight: values.weight,
      size: values.size,
      cowId: values?.cowId,
    };
    try {
      const response = await triggerUpdateHealthRecord({
        url: HEALTH_RECORD_PATH.UPDATE_HEALTH_RECORD(values.healthId),
        body: payload,
      });
      toast.showSuccess(response.message);
      mutate();
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
        weight: values.weight,
        size: values.size,
        cowId: cowId,
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

  const items: TimelineItems[] = data.map((element) => ({
    children: (
      <div
        className="ml-10 w-3/4 cursor-pointer hover:!opacity-55 duration-200"
        onClick={() => handleOpenLeftSide(element?.type, element?.health)}
      >
        <CardComponent title={formatToTitleCase(element?.type)}>
          {(element.type === 'HEALTH_RECORD' && (
            <>
              <Tooltip title="Status">
                <p>{formatToTitleCase(element?.health?.status)}</p>
              </Tooltip>
            </>
          )) ||
            (element.type === 'ILLNESS' && (
              <div className="flex gap-2">
                <Tooltip title="Severity">
                  <p>{formatToTitleCase(element?.health?.severity)}</p>
                </Tooltip>
                <p>-</p>
                <Tooltip title="Veterinarian">
                  <p>
                    {element?.health?.veterinarian
                      ? element?.health?.veterinarian?.name
                      : 'No veterinarian'}
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
            ((element?.health?.severity === 'mild' && (
              <Tooltip title={'Mild'}>
                <HiOutlineEmojiHappy size={SIZE_ICON} color="green" />
              </Tooltip>
            )) ||
              (element?.health?.severity === 'moderate' && (
                <Tooltip title={'Moderate'}>
                  <RiEmotionNormalLine size={SIZE_ICON} color="purple" />
                </Tooltip>
              )) ||
              (element?.health?.severity === 'severe' && (
                <Tooltip title={'Severe'}>
                  <CgSmileSad size={SIZE_ICON} color="orange" />
                </Tooltip>
              )) ||
              (element?.health?.severity === 'critical' && (
                <Tooltip title={'Critical'}>
                  <BsEmojiDizzy size={SIZE_ICON} color="red" />
                </Tooltip>
              ))))}
        <p>{formatDateHour(element.date)}</p>
      </div>
    ),
  }));

  const DescLeft: React.FC<Readonly<{ text?: string | number }>> = () => (
    <Flex justify="center" align="start">
      <TimelineComponent className="ml-10 mt-10" items={items} reverse={true} />
    </Flex>
  );
  return (
    <div className="min-h-full">
      {items.length === 0 ? (
        <FormComponent form={form} onFinish={onCreateHealth} className="w-2/3">
          <HealthRecordForm loading={isLoadingHealthRecord} />
        </FormComponent>
      ) : (
        <Splitter className="flex w-full !min-h-[500px]">
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
                  className="w-2/3"
                >
                  <HealthRecordForm loading={loadingUpdateHealth} />
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
            </div>
          </Splitter.Panel>
        </Splitter>
      )}
    </div>
  );
};

export default HealthRecordCow;
