import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import CardSelectArea from '@components/Select/components/CardSelectArea';
import SelectComponent from '@components/Select/SelectComponent';
import Title from '@components/UI/Title';
import useFetcher from '@hooks/useFetcher';
import { ModalActionProps } from '@hooks/useModal';
import useToast from '@hooks/useToast';
import { Area } from '@model/Area';
import { Task } from '@model/Task/Task';
import { TASK_PATH } from '@service/api/Task/taskApi';
import { PRIORITY_DATA } from '@service/data/priority';
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
    if (modal.open) {
      fetchData();
    }
  }, [modal.open, taskId]);

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
      title={t('Edit task')}
      open={modal.open}
      onCancel={handleCloseModal}
      loading={isLoadingTask}
      width={700}
      onOk={form.submit}
    >
      <Skeleton loading={isLoading}>
        <FormComponent form={form} onFinish={onFinishUpdate}>
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
                  defaultPickerValue={day ? dayjs(day) : undefined} // Chuyển đổi string thành dayjs
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
          </div>
        </FormComponent>
      </Skeleton>
    </ModalComponent>
  );
};

export default UpdateTaskModal;
