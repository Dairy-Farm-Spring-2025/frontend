import ButtonComponent from '@components/Button/ButtonComponent';
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
import { TaskType } from '@model/Task/task-type';
import { UserProfileData } from '@model/User';
import { APPLICATION_PATH } from '@service/api/Application/applicationApi';
import { TASK_PATH } from '@service/api/Task/taskApi';
import { USER_PATH } from '@service/api/User/userApi';
import { PRIORITY_DATA } from '@service/data/priority';
import {
  formatDate,
  formatDateHour,
  formatStatusWithCamel,
} from '@utils/format';
import { Divider, Form, Skeleton } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';

interface FreeUserInterface {
  isLoading?: any;
  data?: UserProfileData[];
  triggerFetchingFreeUser: any;
}

interface UpdateTaskModalProps {
  modal: ModalActionProps;
  taskId: number;
  mutate: any;
  setRefetch: any;
  optionsArea: any[];
  day: string;
  dataFreeUser: FreeUserInterface;
  dataNightUser: FreeUserInterface;
  dataVetAvailable: FreeUserInterface;
}

const statusColor = {
  processing: 'orange',
  complete: 'green',
  cancel: 'pink',
  reject: 'red',
};

const validateTaskType = (selectedTaskType: TaskType) => {
  if (
    selectedTaskType.name === 'Khám bệnh' ||
    selectedTaskType.name === 'Trực ca đêm'
  ) {
    return true;
  }
  return false;
};

const UpdateTaskModal = ({
  modal,
  taskId,
  optionsArea,
  setRefetch,
  day,
  dataFreeUser,
  dataNightUser,
  dataVetAvailable,
}: UpdateTaskModalProps) => {
  const toast = useToast();
  const [form] = Form.useForm();
  const [formUpdateAssignee] = Form.useForm();
  const [assignees, setAssignees] = useState<any[]>([]);
  const {
    data: dataTaskDetail,
    isLoading: isLoadingTask,
    trigger,
    mutate,
  } = useFetcher<Task>(
    TASK_PATH.TASK_DETAIL(taskId),
    'GET',
    'application/json',
    modal.open
  );
  const { trigger: triggerUpdate, isLoading } = useFetcher(
    'update-task',
    'PUT'
  );
  // const { data: dataVetAvailable } = useFetcher<UserProfileData[]>(
  //   USER_PATH.VETERINARIANS_AVAILABLE(day),
  //   'GET',
  //   'application/json',
  //   modal.open
  // );
  const { trigger: triggerReAssign, isLoading: isLoadingReassign } = useFetcher(
    'reassign',
    'PUT'
  );
  const {
    data: dataApplication,
    isLoading: isLoadingApplication,
    mutate: mutateApplication,
  } = useFetcher<Application>(
    APPLICATION_PATH.APPLICATION_FIND_APPLICATION({
      userId: dataTaskDetail ? dataTaskDetail?.assignee?.id : 0,
      fromDate: day,
      toDate: dataTaskDetail ? dataTaskDetail?.toDate : '',
    }),
    'GET',
    'application/json',
    modal.open
  );
  const { trigger: approvalRequest, isLoading: isLoadingConfirm } = useFetcher(
    'approve-request',
    'PUT'
  );
  useEffect(() => {
    const fetchFreeUsers = async () => {
      const body = {
        roleId: dataTaskDetail?.taskTypeId?.roleId?.id,
        fromDate: validateTaskType(
          dataTaskDetail?.taskTypeId ?? ({} as TaskType)
        )
          ? formatDate({ data: day, type: 'params' })
          : formatDate({ data: day, type: 'params' }),
        toDate: validateTaskType(dataTaskDetail?.taskTypeId ?? ({} as TaskType))
          ? formatDate({ data: day, type: 'params' })
          : formatDate({ data: day, type: 'params' }),
        ...(dataTaskDetail?.taskTypeId?.roleId?.name === 'Worker' &&
          dataTaskDetail?.areaId?.areaId && {
            areaId: dataTaskDetail?.areaId?.areaId,
          }),
      };
      const bodyNightShift = {
        fromDate: validateTaskType(
          dataTaskDetail?.taskTypeId ?? ({} as TaskType)
        )
          ? formatDate({ data: day, type: 'params' })
          : formatDate({ data: day, type: 'params' }),
        toDate: validateTaskType(dataTaskDetail?.taskTypeId ?? ({} as TaskType))
          ? formatDate({ data: day, type: 'params' })
          : formatDate({ data: day, type: 'params' }),
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
                formatDate({ data: day, type: 'params' })
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
              url: USER_PATH.USERS_FREE(body as any),
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
        dataTaskDetail?.taskTypeId?.name || 'default'
      ]?.() ?? fetchHandlers.default());

      setAssignees(response);
    };
    if (modal.open && dataTaskDetail?.assignee === null) {
      fetchFreeUsers();
    }
  }, [
    dataTaskDetail?.areaId?.areaId,
    dataTaskDetail?.assignee,
    dataTaskDetail?.taskTypeId,
    day,
    modal.open,
  ]);

  useEffect(() => {
    if (
      modal.open &&
      dataApplication &&
      dataApplication?.status === 'complete'
    ) {
      form.setFieldsValue({
        offDateStart: dataApplication?.fromDate,
        offDateEnd: dataApplication?.toDate,
      });
    }
  }, [dataApplication, form, modal.open]);

  useEffect(() => {
    const fetchData = async () => {
      await trigger({ url: TASK_PATH.TASK_DETAIL(taskId) });
    };
    if (modal.open) {
      fetchData();
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

  const handleCloseModal = useCallback(() => {
    modal.closeModal();
    form.resetFields([
      'offDateStart',
      'offDateEnd',
      'areaId',
      'priority',
      'description',
    ]);
  }, [form, modal]);

  const handleReject = useCallback(async () => {
    try {
      const response = await approvalRequest({
        url: APPLICATION_PATH.APPLICATION_APPROVE(
          dataApplication ? dataApplication?.applicationId : (0 as any)
        ),
        body: {
          approvalStatus: 'reject',
          commentApprove: `Không cho nhân viên nghỉ việc ${dataApplication?.fromDate}- ${dataApplication?.toDate}`,
        },
      });
      toast.showSuccess(response.message || t('Reject success'));
      mutate();
      mutateApplication();
    } catch (error: any) {
      toast.showError(error.message);
    }
  }, [approvalRequest, dataApplication, mutate, toast]);

  const handleApprove = useCallback(async () => {
    try {
      const response = await approvalRequest({
        url: APPLICATION_PATH.APPLICATION_APPROVE(
          dataApplication ? dataApplication?.applicationId : (0 as any)
        ),
        body: {
          approvalStatus: 'approve',
          commentApprove: `Cho nhân viên nghỉ việc ${dataApplication?.fromDate}- ${dataApplication?.toDate}`,
        },
      });
      const offDates: string[] = [];
      const offDateStart = dataApplication?.fromDate;
      const offDateEnd = dataApplication?.toDate;
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
        offDates,
      };
      await triggerUpdate({
        url: TASK_PATH.TASK_UPDATE(taskId),
        body: payload,
      });
      toast.showSuccess(response.message || t('Approve success'));
      handleCloseModal();
      setRefetch(true);
    } catch (error: any) {
      toast.showError(error.message);
    }
  }, [
    approvalRequest,
    dataApplication,
    handleCloseModal,
    setRefetch,
    taskId,
    toast,
    triggerUpdate,
  ]);

  const onFinishUpdate = useCallback(
    async (values: any) => {
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
    },
    [handleCloseModal, setRefetch, taskId, toast, triggerUpdate]
  );

  const onFinishReAssign = useCallback(
    async (values: any) => {
      try {
        const response = await triggerReAssign({
          url: TASK_PATH.TASK_REASSIGN(taskId, values.assigneeId),
        });
        toast.showSuccess(response?.message);
        formUpdateAssignee.resetFields();
        handleCloseModal();
        setRefetch(true);
      } catch (error: any) {
        toast.showError(error?.message);
      }
    },
    [
      formUpdateAssignee,
      handleCloseModal,
      setRefetch,
      taskId,
      toast,
      triggerReAssign,
    ]
  );
  return (
    <ModalComponent
      title={`${t('Edit task - {{taskName}}', {
        taskName: dataTaskDetail?.taskTypeId?.name,
      })} - ${formatDateHour(day)}`}
      open={modal.open}
      onCancel={handleCloseModal}
      loading={isLoadingTask || isLoadingApplication || isLoadingReassign}
      width={700}
      onOk={
        dataTaskDetail?.assignee === null
          ? formUpdateAssignee.submit
          : form.submit
      }
    >
      <Skeleton loading={isLoading}>
        {dataTaskDetail?.assignee === null ? (
          <>
            <p className="text-base mb-2 !text-red-600">
              {t(
                'This task is currently unassigned and needs to be reassigned to someone else'
              )}
            </p>
            <Divider className="!my-2" />
            <FormComponent
              form={formUpdateAssignee}
              onFinish={onFinishReAssign}
            >
              <FormItemComponent
                label={<LabelForm>{t('Re-assign')}</LabelForm>}
                name="assigneeId"
                rules={[{ required: true }]}
              >
                <SelectComponent options={assignees} search />
              </FormItemComponent>
            </FormComponent>
          </>
        ) : (
          <>
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
                      <Form.Item noStyle shouldUpdate>
                        {() => (
                          <DatePickerComponent
                            disabled
                            value={dayjs(dataApplication?.fromDate)}
                          />
                        )}
                      </Form.Item>
                      <Form.Item noStyle shouldUpdate>
                        {() => (
                          <DatePickerComponent
                            disabled
                            value={dayjs(dataApplication?.toDate)}
                          />
                        )}
                      </Form.Item>
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
                            <div className="flex flex-col gap-5">
                              <TagComponents
                                className="!w-fit"
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
                              {dataApplication?.status !== 'complete' && (
                                <p>
                                  ({' '}
                                  {t(
                                    'Application must be completed to request off date'
                                  )}
                                  )
                                </p>
                              )}
                            </div>
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
                                  .map((line, index) => (
                                    <p key={index}>{line}</p>
                                  ))
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
                    {dataApplication.status !== 'complete' && (
                      <div className="flex gap-2">
                        <ButtonComponent
                          loading={isLoadingConfirm}
                          danger
                          onClick={handleReject}
                        >
                          {t('Reject')}
                        </ButtonComponent>
                        <ButtonComponent
                          loading={isLoadingConfirm}
                          type="primary"
                          buttonType="secondary"
                          onClick={handleApprove}
                        >
                          {t('Approve')}
                        </ButtonComponent>
                      </div>
                    )}
                  </div>
                </>
              )}
            </FormComponent>
          </>
        )}
      </Skeleton>
    </ModalComponent>
  );
};

export default UpdateTaskModal;
