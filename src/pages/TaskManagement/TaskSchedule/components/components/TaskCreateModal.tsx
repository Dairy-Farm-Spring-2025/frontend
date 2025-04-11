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
import { Role } from '@model/Role';
import { TaskPayload, TaskValuesPayload } from '@model/Task/Task';
import { TaskType } from '@model/Task/task-type';
import { UserProfileData } from '@model/User';
import { USER_PATH } from '@service/api/User/userApi';
import { PRIORITY_DATA } from '@service/data/priority';
import { SHIFT_TASK } from '@service/data/shiftData';
import {
  formatDate,
  formatDateHour,
  formatStatusWithCamel,
} from '@utils/format';
import { getAvatar } from '@utils/getImage';
import { getColorByRole } from '@utils/statusRender/roleRender';
import { Avatar, Divider, Form } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { memo, useCallback, useEffect, useState } from 'react';
import RulesCreateTask from './RulesCreateTask';
import { useSelector } from 'react-redux';
import { RootState } from '@core/store/store';
import { useDispatch } from 'react-redux';
import { setModalCreate } from '@core/store/slice/taskModalSlice';

interface FreeUserInterface {
  isLoading?: any;
  data?: UserProfileData[];
  triggerFetchingFreeUser: any;
}

interface TaskCreateModalProps {
  modal: ModalActionProps;
  mutate?: any;
  setRefetch: any;
  dataFreeUser: FreeUserInterface;
  dataNightUser: FreeUserInterface;
  dataVetAvailable: FreeUserInterface;
  optionsDataTaskTypes: any[];
  optionsAreas: any[];
  optionsIllness: any[];
}

const validateTaskType = (selectedTaskType: TaskType) => {
  if (
    selectedTaskType.name === 'Khám bệnh' ||
    selectedTaskType.name === 'Trực ca đêm'
  ) {
    return true;
  }
  return false;
};

const TaskCreateModal = ({
  modal,
  mutate,
  setRefetch,
  dataFreeUser,
  dataNightUser,
  dataVetAvailable,
  optionsDataTaskTypes,
  optionsAreas,
  optionsIllness,
}: TaskCreateModalProps) => {
  const { trigger, isLoading } = useFetcher('tasks/create', 'POST');
  const toast = useToast();
  const [selectedRole, setSelectedRole] = useState<Role>();
  const [form] = Form.useForm();
  const fromDate = Form.useWatch('fromDate', form); // Watch the fromDate field
  const toDate = Form.useWatch('toDate', form); // Watch the fromDate field
  const areaId = Form.useWatch('areaId', form); // Watch the fromDate field
  const workDate = Form.useWatch('workDate', form);
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<TaskType>();
  const [isToDateDisabled, setIsToDateDisabled] = useState(true); // State to control To Date DatePicker
  const [disabledShift, setDisabledShift] = useState(false);
  const [assignees, setAssignees] = useState<any[]>([]);
  const createModal = useSelector((state: RootState) => state.taskModal);
  const dispatch = useDispatch();

  const requiredFields = [
    'taskTypeId',
    'assigneeIds',
    'priority',
    'shift',
    'description',
    ...(validateTaskType(selectedTaskTypes ?? ({} as TaskType))
      ? ['workDate']
      : ['fromDate', 'toDate']),
    ...(validateTaskType(selectedTaskTypes ?? ({} as TaskType))
      ? []
      : ['areaId']),
    ...(selectedRole?.name === 'Veterinarians' &&
    selectedTaskTypes?.name !== 'Khám định kì'
      ? ['illnessId']
      : []), // Add illnessId if role is Veterinarian
  ];
  const disabledButton = useRequiredForm(form, requiredFields);
  useEffect(() => {
    if (createModal.modalCreate === true) {
      modal.setOpen(createModal.modalCreate);
      dispatch(setModalCreate(null));
    }
  }, []);

  useEffect(() => {
    const fetchFreeUsers = async () => {
      if (
        !selectedRole ||
        (workDate !== undefined ? !workDate : !fromDate && !toDate)
      )
        return;
      const body = {
        roleId: selectedRole.id,
        fromDate: validateTaskType(selectedTaskTypes ?? ({} as TaskType))
          ? formatDate({ data: workDate, type: 'params' })
          : formatDate({ data: fromDate, type: 'params' }),
        toDate: validateTaskType(selectedTaskTypes ?? ({} as TaskType))
          ? formatDate({ data: workDate, type: 'params' })
          : formatDate({ data: toDate, type: 'params' }),
        ...(selectedRole.name === 'Worker' && areaId && { areaId }),
      };
      const bodyNightShift = {
        fromDate: validateTaskType(selectedTaskTypes ?? ({} as TaskType))
          ? formatDate({ data: workDate, type: 'params' })
          : formatDate({ data: fromDate, type: 'params' }),
        toDate: validateTaskType(selectedTaskTypes ?? ({} as TaskType))
          ? formatDate({ data: workDate, type: 'params' })
          : formatDate({ data: toDate, type: 'params' }),
      };
      const fetchHandlers: Record<string, () => Promise<any>> = {
        'Trực ca đêm': async () =>
          dataNightUser
            .triggerFetchingFreeUser({
              url: USER_PATH.NIGHT_USERS_FREE(bodyNightShift),
            })
            .then((response: UserProfileData[]) =>
              (response || []).map((user) => ({
                label: user?.name,
                value: user.id,
                desc: user,
                searchLabel: user?.name,
              }))
            )
            .catch(() => {
              setAssignees([]);
              return [];
            }),
        'Khám bệnh': async () =>
          dataVetAvailable
            .triggerFetchingFreeUser({
              url: USER_PATH.VETERINARIANS_AVAILABLE(
                formatDate({ data: workDate, type: 'params' })
              ),
            })
            .then((response: UserProfileData[]) =>
              (response || []).map((user) => ({
                label: user?.name,
                value: user.id,
                desc: user,
                searchLabel: user?.name,
              }))
            )
            .catch(() => {
              setAssignees([]);
              return [];
            }),
        default: async () =>
          dataFreeUser
            .triggerFetchingFreeUser({
              url: USER_PATH.USERS_FREE(body),
            })
            .then((response: UserProfileData[]) =>
              (response || []).map((user) => ({
                label: user?.name,
                value: user.id,
                desc: user,
                searchLabel: user?.name,
              }))
            )
            .catch(() => {
              setAssignees([]);
              return [];
            }),
      };
      const response = await (fetchHandlers[
        selectedTaskTypes?.name || 'default'
      ]?.() ?? fetchHandlers.default());

      console.log(response);
      setAssignees(response);
    };

    fetchFreeUsers();
  }, [selectedRole, fromDate, toDate, areaId, workDate, selectedTaskTypes]);

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

  const handleTaskTypeChange = (taskType: TaskType | undefined) => {
    const role = taskType?.roleId;
    setSelectedRole(role);
    setSelectedTaskTypes(taskType);

    const shouldSetNightShift = taskType?.name === 'Trực ca đêm';

    form.setFieldsValue({
      assigneeIds: undefined,
      fromDate: undefined,
      toDate: undefined,
      workDate: undefined,
      description: undefined,
      areaId: undefined,
      priority: undefined,
      shift: shouldSetNightShift ? 'nightShift' : undefined,
    });

    setDisabledShift(shouldSetNightShift);
  };

  const onFinish = useCallback(
    async (values: TaskValuesPayload) => {
      try {
        const payload: TaskPayload = {
          areaId: values.areaId,
          assigneeIds: values.assigneeIds,
          description: values.description,
          fromDate: validateTaskType(selectedTaskTypes ?? ({} as TaskType))
            ? dayjs(values.workDate).format('YYYY-MM-DD')
            : dayjs(values.fromDate).format('YYYY-MM-DD'),
          toDate: validateTaskType(selectedTaskTypes ?? ({} as TaskType))
            ? dayjs(values.workDate).format('YYYY-MM-DD')
            : dayjs(values.toDate).format('YYYY-MM-DD'),
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
    [handleCancel, mutate, selectedTaskTypes, setRefetch, toast, trigger]
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
      <div className="mb-2">
        <RulesCreateTask />
      </div>
      <Divider className="!my-2 !border-gray-300" />
      <FormComponent form={form} onFinish={onFinish}>
        <FormItemComponent
          name="taskTypeId"
          label={<LabelForm>{t('Task Type')}</LabelForm>}
          rules={[{ required: true }]}
        >
          <SelectComponent
            options={optionsDataTaskTypes}
            onChange={(_, option: any) => {
              handleTaskTypeChange(option?.desc);
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
            <div className="flex gap-10 justify-center">
              <div className="flex flex-col gap-2 w-1/2">
                {!validateTaskType(selectedTaskTypes ?? ({} as TaskType)) ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <FormItemComponent
                      name="workDate"
                      label={<LabelForm>{t('Work date')}</LabelForm>}
                    >
                      <DatePickerComponent disabledDate={disabledFromDate} />
                    </FormItemComponent>
                  </>
                )}
                <FormItemComponent
                  rules={[{ required: true }]}
                  name="priority"
                  label={<LabelForm>{t('Priority')}</LabelForm>}
                >
                  <SelectComponent options={PRIORITY_DATA()} />
                </FormItemComponent>
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                {selectedRole.name === 'Veterinarians' &&
                  validateTaskType(selectedTaskTypes ?? ({} as TaskType)) && (
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
                  <SelectComponent
                    options={SHIFT_TASK()}
                    open={disabledShift === true ? false : undefined}
                  />
                </FormItemComponent>
              </div>
            </div>
            <div className="flex flex-col">
              {!validateTaskType(selectedTaskTypes ?? ({} as TaskType)) && (
                <FormItemComponent
                  name="areaId"
                  label={<LabelForm>{t('Area')}</LabelForm>}
                  rules={[{ required: true }]}
                  className="!w-full"
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
              )}
              {((fromDate && toDate) || workDate) &&
                selectedRole &&
                (validateTaskType(selectedTaskTypes ?? ({} as TaskType)) ||
                  areaId) && (
                  <>
                    <FormItemComponent
                      rules={[{ required: true }]}
                      name="assigneeIds"
                      label={<LabelForm>{t('Assignee')}</LabelForm>}
                    >
                      <SelectComponent
                        loading={
                          dataFreeUser.isLoading || dataNightUser.isLoading
                        }
                        disabled={selectedRole === undefined}
                        mode="multiple"
                        options={assignees}
                        menuItemSelectedIcon={false}
                        optionRender={(option) => {
                          const user: UserProfileData = option?.data?.desc;
                          return (
                            <div className="flex gap-2 items-center">
                              <Avatar
                                size={20}
                                src={getAvatar(user?.profilePhoto)}
                              />
                              <p>
                                {user?.name} ({user?.employeeNumber})
                              </p>
                            </div>
                          );
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
                  </>
                )}
            </div>
          </>
        )}
      </FormComponent>
    </ModalComponent>
  );
};

export default memo(TaskCreateModal);
