import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import CardSelectArea from '@components/Select/components/CardSelectArea';
import SelectComponent from '@components/Select/SelectComponent';
import TagComponents from '@components/UI/TagComponents';
import useFetcher from '@hooks/useFetcher';
import { ModalActionProps } from '@hooks/useModal';
import useRequiredForm from '@hooks/useRequiredForm';
import useToast from '@hooks/useToast';
import { Area } from '@model/Area';
import { IllnessCow } from '@model/Cow/Illness';
import { TaskPayload } from '@model/Task/Task';
import { TaskType } from '@model/Task/task-type';
import { UserProfileData } from '@model/User';
import { PRIORITY_DATA } from '@service/data/priority';
import { SHIFT_TASK } from '@service/data/shiftData';
import { formatDateHour, formatStatusWithCamel } from '@utils/format';
import { getAvatar } from '@utils/getImage';
import { getColorByRole } from '@utils/statusRender/roleRender';
import { Avatar, Divider, Form } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

interface TaskCreateModalProps {
  modal: ModalActionProps;
  mutate?: any;
  setRefetch: any;
  dataVeterinarians: UserProfileData[];
  dataWorker: UserProfileData[];
  optionsDataTaskTypes: any[];
  optionsAreas: any[];
  optionsIllness: any[];
}

const TaskCreateModal = ({
  modal,
  mutate,
  setRefetch,
  dataVeterinarians,
  dataWorker,
  optionsDataTaskTypes,
  optionsAreas,
  optionsIllness,
}: TaskCreateModalProps) => {
  const { trigger, isLoading } = useFetcher('tasks/create', 'POST');
  const toast = useToast();
  const [selectedRole, setSelectedRole] = useState<
    'Veterinarians' | 'Worker' | undefined
  >(undefined);
  const [form] = Form.useForm();
  const fromDate = Form.useWatch('fromDate', form); // Watch the fromDate field
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<TaskType>();
  const [isToDateDisabled, setIsToDateDisabled] = useState(true); // State to control To Date DatePicker
  const requiredFields = [
    'taskTypeId',
    'assigneeIds',
    'fromDate',
    'toDate',
    'priority',
    'shift',
    'areaId',
    'description',
    ...(selectedRole === 'Veterinarians' ? ['illnessId'] : []), // Add illnessId if role is Veterinarian
  ];
  const disabledButton = useRequiredForm(form, requiredFields);

  const assignees = useMemo(() => {
    const data = selectedRole === 'Worker' ? dataWorker : dataVeterinarians;
    return (data || []).map((element) => ({
      label: element?.name,
      value: element.id,
      desc: element,
      searchLabel: element?.name,
    }));
  }, [selectedRole, dataWorker, dataVeterinarians]);

  useEffect(() => {
    if (modal.open) {
      form.resetFields(); // Reset form khi modal mở
    }
  }, [form, modal.open]);

  useEffect(() => {
    if (fromDate) {
      setIsToDateDisabled(false); // Enable To Date if fromDate is selected
    } else {
      setIsToDateDisabled(true); // Disable To Date if fromDate is not selected
      form.setFieldsValue({ toDate: undefined }); // Reset toDate when fromDate is cleared
    }
  }, [fromDate, form]);

  const disabledFromDate = (current: dayjs.Dayjs) => {
    return (
      (current && current.isBefore(dayjs().startOf('day'))) ||
      (selectedTaskTypes?.name !== 'Khám bệnh' &&
        current.isSame(dayjs().startOf('day')))
    );
  };

  const disabledToDate = (current: dayjs.Dayjs) => {
    const fromDate = form.getFieldValue('fromDate');
    if (!fromDate) {
      return false;
    }
    const minDate = dayjs(fromDate).startOf('day');
    const maxDate = dayjs(fromDate).add(5, 'day').endOf('day');
    return current && (current.isBefore(minDate) || current.isAfter(maxDate));
  };

  const handleCancel = useCallback(() => {
    form.resetFields();
    setSelectedRole(undefined);
    setIsToDateDisabled(true);
    modal.closeModal();
  }, [form, modal]);

  const onFinish = useCallback(
    async (values: TaskPayload) => {
      try {
        const payload: TaskPayload = {
          areaId: values.areaId,
          assigneeIds: values.assigneeIds,
          description: values.description,
          fromDate: dayjs(values.fromDate).format('YYYY-MM-DD'),
          toDate: dayjs(values.toDate).format('YYYY-MM-DD'),
          priority: values.priority,
          shift: values.shift,
          taskTypeId: values.taskTypeId,
          illnessId: values.illnessId,
        };
        const response = await trigger({ body: payload });
        toast.showSuccess(response.message);
        handleCancel();
        mutate();
        setRefetch(true);
      } catch (error: any) {
        toast.showError(error.message);
      }
    },
    [handleCancel, mutate, setRefetch, toast, trigger]
  );

  return (
    <ModalComponent
      open={modal.open}
      title={t('Add Task')}
      onCancel={handleCancel}
      disabledButtonOk={disabledButton}
      width={800}
      onOk={() => form.submit()}
      loading={isLoading}
    >
      <FormComponent form={form} onFinish={onFinish}>
        <FormItemComponent
          name="taskTypeId"
          label={<LabelForm>{t('Task Type')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <SelectComponent
            options={optionsDataTaskTypes}
            onChange={(_, option: any) => {
              setSelectedRole(option?.desc?.roleId?.name);
              setSelectedTaskTypes(option?.desc);
              form.setFieldsValue({ assigneeIds: undefined });
            }}
            optionRender={(option) => {
              const taskType: TaskType = option?.data?.desc;
              return (
                <div>
                  <p>
                    {taskType?.name} -{' '}
                    <TagComponents
                      color={getColorByRole(taskType?.roleId?.name as any)}
                    >
                      {t(taskType?.roleId?.name)}
                    </TagComponents>
                  </p>
                </div>
              );
            }}
          />
        </FormItemComponent>
        {selectedRole && (
          <>
            <FormItemComponent
              rules={[{ required: true }]}
              name="assigneeIds"
              label={<LabelForm>{t('Assignee')}</LabelForm>}
            >
              <SelectComponent
                disabled={selectedRole === undefined}
                mode="multiple"
                options={assignees}
                menuItemSelectedIcon={false}
                optionRender={(option) => {
                  const user: UserProfileData = option?.data?.desc;
                  return (
                    <div className="flex gap-2 items-center">
                      <Avatar size={20} src={getAvatar(user?.profilePhoto)} />
                      <p>
                        {user?.name} ({user?.employeeNumber})
                      </p>
                    </div>
                  );
                }}
              />
            </FormItemComponent>
            <div className="flex gap-14 justify-center">
              <div className="flex flex-col gap-2 w-1/2">
                <FormItemComponent
                  name="fromDate"
                  label={<LabelForm>{t('From Date')}</LabelForm>}
                  rules={[{ required: true }]}
                >
                  <DatePickerComponent disabledDate={disabledFromDate} />
                </FormItemComponent>
                <FormItemComponent
                  label={<LabelForm>{t('To Date')}</LabelForm>}
                  name="toDate"
                  rules={[
                    { required: true },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const fromDate = getFieldValue('fromDate');
                        if (!value || !fromDate) {
                          return Promise.resolve();
                        }
                        if (dayjs(value).isBefore(dayjs(fromDate))) {
                          return Promise.reject(
                            new Error('To Date must be after From Date!')
                          );
                        }
                        if (dayjs(value).diff(dayjs(fromDate), 'day') > 7) {
                          return Promise.reject(
                            new Error(
                              'To Date must be within 7 days from From Date!'
                            )
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <DatePickerComponent
                    disabled={isToDateDisabled} // Control the disabled state
                    disabledDate={disabledToDate}
                  />
                </FormItemComponent>
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="priority"
                  label={<LabelForm>{t('Priority')}</LabelForm>}
                >
                  <SelectComponent options={PRIORITY_DATA()} />
                </FormItemComponent>
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                {selectedRole === 'Veterinarians' && (
                  <FormItemComponent
                    rules={[{ required: true }]}
                    name="illnessId"
                    label={<LabelForm>{t('Illness')}</LabelForm>}
                  >
                    <SelectComponent
                      options={optionsIllness}
                      search
                      optionRender={(data) => {
                        const illness: IllnessCow = data.data.desc;
                        return (
                          <div>
                            <div>
                              <p>
                                <strong>{t('Cow')}</strong>:{' '}
                                {illness.cowEntity.name}
                              </p>
                              <p>
                                <strong>{t('Severity')}</strong>:{' '}
                                {t(formatStatusWithCamel(illness.severity))}
                              </p>
                              <p>
                                <strong>{t('Start date')}</strong>:{' '}
                                {formatDateHour(illness.startDate)}
                              </p>
                            </div>
                            <Divider className="!my-1" />
                          </div>
                        );
                      }}
                    />
                  </FormItemComponent>
                )}
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="shift"
                  label={<LabelForm>{t('Shift')}</LabelForm>}
                >
                  <SelectComponent options={SHIFT_TASK()} />
                </FormItemComponent>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <FormItemComponent
                name="areaId"
                label={<LabelForm>{t('Area')}</LabelForm>}
                rules={[{ required: true }]}
                className="w-full"
              >
                <SelectComponent
                  options={optionsAreas}
                  listHeight={400}
                  search
                  optionRender={(option) => {
                    const area: Area = option?.data?.desc;
                    return <CardSelectArea area={area} />;
                  }}
                />
              </FormItemComponent>
              <FormItemComponent
                name="description"
                label={<LabelForm>{t('Description')}</LabelForm>}
                className="w-full"
                rules={[{ required: true }]}
              >
                <InputComponent.TextArea />
              </FormItemComponent>
            </div>
          </>
        )}
      </FormComponent>
    </ModalComponent>
  );
};

export default memo(TaskCreateModal);
