import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
import DescriptionComponent from '@components/Description/DescriptionComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import CardSelectArea from '@components/Select/components/CardSelectArea';
import SelectComponent from '@components/Select/SelectComponent';
import TagComponents from '@components/UI/TagComponents';
import Title from '@components/UI/Title';
import useFetcher from '@hooks/useFetcher';
import { ModalActionProps } from '@hooks/useModal';
import useToast from '@hooks/useToast';
import { Application } from '@model/ApplicationType/application';
import { Area } from '@model/Area';
import { Task } from '@model/Task/Task';
import { APPLICATION_PATH } from '@service/api/Application/applicationApi';
import { TASK_PATH } from '@service/api/Task/taskApi';
import { PRIORITY_DATA } from '@service/data/priority';
import { formatDateHour, formatStatusWithCamel } from '@utils/format';
import { Divider, Form, Skeleton } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useEffect, useState } from 'react';

interface UpdateTaskModalProps {
  modal: ModalActionProps;
  taskId: number;
  mutate: any;
  setRefetch: any;
  optionsArea: any[];
  day: string;
}

const statusColor = {
  processing: 'orange',
  complete: 'green',
  cancel: 'pink',
  reject: 'red',
};

const UpdateTaskModal = ({
  modal,
  taskId,
  optionsArea,
  setRefetch,
  day,
}: UpdateTaskModalProps) => {
  const toast = useToast();
  const [form] = Form.useForm();
  const [fromDate, setFromDate] = useState<dayjs.Dayjs | null>(null);
  const {
    data: dataTaskDetail,
    isLoading: isLoadingTask,
    trigger,
  } = useFetcher<Task>(TASK_PATH.TASK_DETAIL(taskId), 'GET');
  const { trigger: triggerUpdate, isLoading } = useFetcher(
    'update-task',
    'PUT'
  );
  const {
    data: dataApplication,
    trigger: triggerApplication,
    isLoading: isLoadingApplication,
  } = useFetcher<Application>(
    APPLICATION_PATH.APPLICATION_FIND_APPLICATION({
      userId: dataTaskDetail ? dataTaskDetail?.assignee?.id : 0,
      fromDate: day,
      toDate: dataTaskDetail ? dataTaskDetail?.toDate : '',
    }),
    'GET'
  );

  const disabledOffDateStart = (current: dayjs.Dayjs) => {
    if (!dataTaskDetail?.fromDate || !dataTaskDetail?.toDate) return true;
    const minDate = dayjs(day ? day : new Date()).startOf('day');
    const maxDate = dayjs(dataTaskDetail.toDate).endOf('day');
    return current.isBefore(minDate) || current.isAfter(maxDate);
  };

  const disabledOffDateEnd = (current: dayjs.Dayjs) => {
    if (!fromDate || !dataTaskDetail?.toDate) return true;
    const minDate = fromDate.startOf('day');
    const maxDate = dayjs(dataTaskDetail.toDate).endOf('day');
    return current.isBefore(minDate) || current.isAfter(maxDate);
  };

  const handleCloseModal = () => {
    modal.closeModal();
    form.resetFields([
      'offDateStart',
      'offDateEnd',
      'areaId',
      'priority',
      'description',
    ]);
    setFromDate(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      await trigger({ url: TASK_PATH.TASK_DETAIL(taskId) });
    };
    const fetchDataApplication = async () => {
      await triggerApplication({
        url: APPLICATION_PATH.APPLICATION_FIND_APPLICATION({
          userId: dataTaskDetail ? dataTaskDetail?.assignee?.id : 0,
          fromDate: day,
          toDate: dataTaskDetail ? dataTaskDetail?.toDate : '',
        }),
      });
    };
    if (modal.open) {
      fetchData();
      fetchDataApplication();
    }
  }, [day, modal.open, taskId]);

  useEffect(() => {
    if (modal.open && dataTaskDetail) {
      form.setFieldsValue({
        areaId: dataTaskDetail?.areaId?.areaId,
        priority: dataTaskDetail?.priority,
        description: dataTaskDetail?.description,
      });
    }
  }, [dataTaskDetail, form, modal.open]);

  const onFinishUpdate = async (values: any) => {
    try {
      const { offDateStart, offDateEnd, ...rest } = values;

      // Generate array of dates between start and end
      const offDates: string[] = [];
      if (offDateStart && offDateEnd) {
        let current = dayjs(offDateStart);
        while (
          current.isBefore(dayjs(offDateEnd)) ||
          current.isSame(dayjs(offDateEnd), 'day')
        ) {
          offDates.push(current.format('YYYY-MM-DD')); // Store as YYYY-MM-DD
          current = current.add(1, 'day');
        }
      }
      const payload = {
        ...rest,
        offDates,
      };
      const response = await triggerUpdate({
        url: TASK_PATH.TASK_UPDATE(taskId),
        body: payload,
      });
      toast.showSuccess(response.message);
      setRefetch(true);
      handleCloseModal();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  return (
    <ModalComponent
      title={`${t('Edit task {{taskName}}', {
        taskName: dataTaskDetail?.taskTypeId?.name,
      })} - ${formatDateHour(day)}`}
      open={modal.open}
      onCancel={handleCloseModal}
      loading={isLoadingTask || isLoadingApplication}
      width={700}
      onOk={form.submit}
    >
      <Skeleton loading={isLoading}>
        <p className="text-base my-2">
          <strong>{t('Assignee')}</strong>: {dataTaskDetail?.assignee?.name}
        </p>
        <FormComponent
          form={form}
          onFinish={onFinishUpdate}
          className="flex flex-col gap-3"
        >
          <FormItemComponent
            name="areaId"
            label={<LabelForm>{t('Area')}</LabelForm>}
            rules={[{ required: true }]}
          >
            <SelectComponent
              options={optionsArea}
              listHeight={400}
              search
              optionRender={(option) => {
                const area: Area = option?.data?.desc;
                return <CardSelectArea area={area} />;
              }}
            />
          </FormItemComponent>
          <FormItemComponent
            name="priority"
            label={<LabelForm>{t('Priority')}</LabelForm>}
            rules={[{ required: true }]}
          >
            <SelectComponent options={PRIORITY_DATA()} />
          </FormItemComponent>
          <FormItemComponent
            name="description"
            label={<LabelForm>{t('Description')}</LabelForm>}
            rules={[{ required: true }]}
          >
            <InputComponent.TextArea />
          </FormItemComponent>
          {dataApplication !== undefined && (
            <>
              <Divider />
              <div className="flex flex-col gap-2">
                <Title>{t('Off date request')}</Title>
                <div className="flex gap-5">
                  <FormItemComponent
                    name="offDateStart"
                    label={<LabelForm>{t('From')}</LabelForm>}
                    className="!w-full"
                  >
                    <DatePickerComponent
                      disabledDate={disabledOffDateStart}
                      disabled={dataApplication?.status !== 'complete' && true}
                      defaultPickerValue={day ? dayjs(day) : undefined}
                      onChange={(date) => {
                        form.resetFields(['offDateEnd']);
                        setFromDate(date);
                      }}
                    />
                  </FormItemComponent>
                  <FormItemComponent
                    name="offDateEnd"
                    label={<LabelForm>{t('To')}</LabelForm>}
                    className="!w-full"
                  >
                    <DatePickerComponent
                      disabledDate={disabledOffDateEnd}
                      defaultPickerValue={day ? dayjs(day) : undefined}
                      disabled={!fromDate}
                    />
                  </FormItemComponent>
                </div>
                <Title className="!my-4">
                  {t('Application of {{userName}}', {
                    userName: dataTaskDetail?.assignee?.name,
                  })}
                </Title>
                <DescriptionComponent
                  layout={'horizontal'}
                  items={[
                    {
                      label: t('Title'),
                      children: dataApplication?.title,
                      span: 3,
                    },
                    {
                      label: t('Status'),
                      children: (
                        <TagComponents
                          color={
                            statusColor[
                              dataApplication?.status as keyof typeof statusColor
                            ] || 'default'
                          }
                        >
                          {t(
                            formatStatusWithCamel(
                              dataApplication?.status as any
                            )
                          )}
                        </TagComponents>
                      ),
                      span: 3,
                    },
                    {
                      label: t('Content'),
                      children: (
                        <div className="p-2 rounded-md border-[1px] border-solid">
                          {dataApplication?.content ? (
                            dataApplication.content
                              .split('\n')
                              .map((line, index) => <p key={index}>{line}</p>)
                          ) : (
                            <p>{t('No content')}</p>
                          )}
                        </div>
                      ),
                      span: 3,
                    },
                    {
                      label: t('From date'),
                      children: formatDateHour(dataApplication?.fromDate),
                      span: 2,
                    },
                    {
                      label: t('To date'),
                      children: formatDateHour(dataApplication?.toDate),
                      span: 2,
                    },
                  ]}
                />
              </div>
            </>
          )}
        </FormComponent>
      </Skeleton>
    </ModalComponent>
  );
};

export default UpdateTaskModal;
