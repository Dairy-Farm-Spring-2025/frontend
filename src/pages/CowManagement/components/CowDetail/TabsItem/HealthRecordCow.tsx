import { Flex, Form, Splitter, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { BsClipboard2, BsEmojiDizzy } from 'react-icons/bs';
import { CgSmileSad } from 'react-icons/cg';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { RiEmotionNormalLine } from 'react-icons/ri';
import FormComponent from '../../../../../components/Form/FormComponent';
import TimelineComponent, {
  TimelineItems,
} from '../../../../../components/Timeline/TimelineComponent';
import useFetcher from '../../../../../hooks/useFetcher';
import useToast from '../../../../../hooks/useToast';
import { HealthResponse } from '../../../../../model/Cow/Cow';
import { HealthRecord } from '../../../../../model/Cow/HealthRecord';
import { IllnessCow } from '../../../../../model/Cow/Illness';
import HealthRecordForm from './components/SplitterSide/HealthRecordForm';
import IllnessRecordForm from './components/SplitterSide/IllnessRecordForm';
import { formatToTitleCase } from '../../../../../utils/format';

interface HealthRecordCowProps {
  data: HealthResponse[];
  mutate: any;
}

const SIZE_ICON = 20;

const HealthRecordCow = ({ data, mutate }: HealthRecordCowProps) => {
  const [form] = Form.useForm();
  const [formIllness] = Form.useForm();
  const toast = useToast();
  const [type, setType] = useState<'HEALTH_RECORD' | 'ILLNESS' | null>();
  const { trigger: triggerUpdateHealthRecord, isLoading: loadingUpdateHealth } =
    useFetcher('update/health-record', 'PUT');
  const { trigger: triggerUpdateIllness, isLoading: isLoadingUpdateIllness } =
    useFetcher(`illness`, 'PUT');
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
        url: `health-record/${values.healthId}`,
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
        url: `illness/${values?.illnessId}`,
        body: payload,
      });
      toast.showSuccess(response.message);
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  console.log(data);

  const items: TimelineItems[] = data.map((element) => ({
    children: (
      <div
        className="ml-10 w-fit cursor-pointer hover:!opacity-55 duration-200"
        onClick={() => handleOpenLeftSide(element?.type, element?.health)}
      >
        <div className="flex gap-2 text-base">
          <p>{formatToTitleCase(element?.type)}</p>
          <p>-</p>
          {(element.type === 'HEALTH_RECORD' && (
            <>
              <Tooltip title="Status">
                <p>{formatToTitleCase(element?.health?.status)}</p>
              </Tooltip>
              <p>-</p>
              <Tooltip title="Weight">
                <p>{element?.health?.weight}(kg)</p>
              </Tooltip>
              <p>-</p>
              <Tooltip title="Size">
                <p>{element?.health?.size}(m)</p>
              </Tooltip>
            </>
          )) ||
            (element.type === 'ILLNESS' && (
              <>
                <Tooltip title="Seveiry">
                  <p>{formatToTitleCase(element?.health?.severity)}</p>
                </Tooltip>
                <p>-</p>
                <Tooltip title="User">
                  <p>{element?.health?.userEntity?.name}</p>
                </Tooltip>
                <p>-</p>
                <Tooltip title="Veterinarian">
                  <p>
                    {element?.health?.veterinarian
                      ? element?.health?.veterinarian?.name
                      : 'No veterinarian'}
                  </p>
                </Tooltip>
              </>
            ))}
        </div>
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
        <p>{element.date}</p>
      </div>
    ),
  }));

  const DescLeft: React.FC<Readonly<{ text?: string | number }>> = () => (
    <Flex justify="center" align="start" style={{ height: '100%' }}>
      <TimelineComponent className="ml-10 mt-10" items={items} reverse={true} />
    </Flex>
  );
  return (
    <Splitter className="flex w-full">
      <Splitter.Panel className="w-fit" defaultSize="50%" min="40%" max="70%">
        <DescLeft />
      </Splitter.Panel>
      <Splitter.Panel defaultSize="50%" min="40%" max="70%">
        <div className="p-5">
          {type === 'HEALTH_RECORD' && (
            <FormComponent
              form={form}
              onFinish={onFinishUpdateHealthRecord}
              className="w-full"
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
              <IllnessRecordForm loading={isLoadingUpdateIllness} />
            </FormComponent>
          )}
        </div>
      </Splitter.Panel>
    </Splitter>
  );
};

export default HealthRecordCow;
