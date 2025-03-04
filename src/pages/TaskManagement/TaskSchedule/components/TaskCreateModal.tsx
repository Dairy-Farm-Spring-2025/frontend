import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import InputComponent from '@components/Input/InputComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import SelectComponent from '@components/Select/SelectComponent';
import TagComponents from '@components/UI/TagComponents';
import TextTitle from '@components/UI/TextTitle';
import useFetcher from '@hooks/useFetcher';
import { ModalActionProps } from '@hooks/useModal';
import useToast from '@hooks/useToast';
import { Area } from '@model/Area';
import { TaskPayload } from '@model/Task/Task';
import { TaskType } from '@model/Task/task-type';
import { UserProfileData } from '@model/User';
import { PRIORITY_DATA } from '@service/data/priority';
import { SHIFT_TASK } from '@service/data/shiftData';
import { formatStatusWithCamel } from '@utils/format';
import { getAvatar } from '@utils/getImage';
import { Avatar, Divider, Form } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { LiaChartAreaSolid } from 'react-icons/lia';

interface TaskCreateModalProps {
  modal: ModalActionProps;
  mutate?: any;
}

const TaskCreateModal = ({ modal, mutate }: TaskCreateModalProps) => {
  const { data: dataTaskTypes } = useFetcher<TaskType[]>('task_types', 'GET');
  const { data: dataAreas } = useFetcher<Area[]>('areas', 'GET');
  const [optionsAreas, setOptionsArea] = useState<any[]>([]);
  const [optionsDataTaskTypes, setOptionDataTaskTypes] = useState<any[]>([]);
  const { trigger, isLoading } = useFetcher('tasks/create', 'POST');
  const toast = useToast();
  const { data: dataWorker } = useFetcher<UserProfileData[]>(
    'users/workers',
    'GET'
  );
  const { data: dataVeterinarians } = useFetcher<UserProfileData[]>(
    'users/veterinarians',
    'GET'
  );
  const [assignees, setAssignees] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<
    'Veterinarians' | 'Worker' | undefined
  >(undefined);
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);
  const fromDate = Form.useWatch('fromDate', form); // Watch the fromDate field
  const [disabledButton, setDisabledButton] = useState(true);
  const [isToDateDisabled, setIsToDateDisabled] = useState(true); // State to control To Date DatePicker

  // Effect to enable/disable To Date DatePicker based on fromDate
  useEffect(() => {
    if (fromDate) {
      setIsToDateDisabled(false); // Enable To Date if fromDate is selected
    } else {
      setIsToDateDisabled(true); // Disable To Date if fromDate is not selected
      form.setFieldsValue({ toDate: undefined }); // Reset toDate when fromDate is cleared
    }
  }, [fromDate, form]);

  useEffect(() => {
    if (selectedRole === 'Worker') {
      form.setFieldsValue({
        assineeIds: [],
      });
      setAssignees(
        (dataWorker || []).map((element) => ({
          label: element.name,
          value: element.id,
          desc: element,
          searchLabel: element.name,
        }))
      );
    } else {
      form.setFieldsValue({
        assineeIds: [],
      });
      setAssignees(
        (dataVeterinarians || []).map((element) => ({
          label: element.name,
          value: element.id,
          desc: element,
          searchLabel: element.name,
        }))
      );
    }
  }, [dataVeterinarians, dataWorker, form, selectedRole]);

  useEffect(() => {
    if (dataAreas && dataTaskTypes) {
      setOptionDataTaskTypes(
        dataTaskTypes.map((element) => ({
          label: element.name,
          value: element.taskTypeId,
          desc: element,
          searchLabel: element.name,
        }))
      );
      setOptionsArea(
        dataAreas.map((element) => ({
          label: element.name,
          value: element.areaId,
          desc: element,
          searchLabel: element.name,
        }))
      );
    }
  }, [dataAreas, dataTaskTypes]);

  useEffect(() => {
    if (modal.open) {
      const isButtonDisabled =
        !formValues || Object.values(formValues).some((value) => !value);
      setDisabledButton(isButtonDisabled);
    }
  }, [formValues, modal.open]);

  const disabledFromDate = (current: dayjs.Dayjs) => {
    return current && current.isBefore(dayjs().startOf('day'));
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

  const handleCancel = () => {
    form.resetFields();
    setSelectedRole(undefined);
    setIsToDateDisabled(true); // Reset To Date disabled state on cancel
    modal.closeModal();
  };

  const onFinish = async (values: TaskPayload) => {
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
      };
      const response = await trigger({ body: payload });
      toast.showSuccess(response.message);
      handleCancel();
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  return (
    <ModalComponent
      open={modal.open}
      title={t('Add Task')}
      onCancel={handleCancel}
      disabledButtonOk={disabledButton}
      width={700}
      onOk={() => form.submit()}
      loading={isLoading}
    >
      <FormComponent form={form} onFinish={onFinish}>
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
              <SelectComponent options={PRIORITY_DATA} />
            </FormItemComponent>
          </div>
          <div className="flex flex-col gap-2 w-1/2">
            <FormItemComponent
              name="taskTypeId"
              label={<LabelForm>{t('Task Type')}</LabelForm>}
              rules={[{ required: true }]}
            >
              <SelectComponent
                options={optionsDataTaskTypes}
                onChange={(_, option: any) => {
                  setSelectedRole(option?.desc?.roleId?.name);
                }}
                optionRender={(option) => {
                  const taskType: TaskType = option?.data?.desc;
                  return (
                    <div>
                      <p>
                        {taskType.name} - {taskType.roleId.name}
                      </p>
                    </div>
                  );
                }}
              />
            </FormItemComponent>
            <FormItemComponent
              rules={[{ required: true }]}
              name="assigneeIds"
              label={<LabelForm>{t('Assignee')}</LabelForm>}
            >
              <SelectComponent
                disabled={selectedRole === undefined}
                mode="multiple"
                options={assignees}
                optionRender={(option) => {
                  const user: UserProfileData = option?.data?.desc;
                  return (
                    <div className="flex gap-2 items-center">
                      <Avatar src={getAvatar(user?.profilePhoto)} />
                      <p>
                        {user?.name} ({user?.employeeNumber})
                      </p>
                    </div>
                  );
                }}
              />
            </FormItemComponent>
            <FormItemComponent
              rules={[{ required: true }]}
              name="shift"
              label={<LabelForm>{t('Shift')}</LabelForm>}
            >
              <SelectComponent options={SHIFT_TASK} />
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
                return (
                  <div className="py-5">
                    <div className="flex gap-3 items-center">
                      <LiaChartAreaSolid size={20} />
                      <p className="font-bold text-base">{area.name}</p>
                      <TagComponents color="blue" className="!text-sm">
                        {formatStatusWithCamel(area.areaType)}
                      </TagComponents>
                    </div>
                    <Divider className="my-1" />
                    <div className="grid grid-cols-3">
                      <TextTitle
                        title={t('Pen size')}
                        description={`${area.penLength}(m) x ${area.penWidth}(m)`}
                      />
                      <TextTitle
                        title={t('Dimension')}
                        description={`${area.length}(m) x ${area.width}(m)`}
                      />
                    </div>
                    <div className="grid grid-cols-3 mt-2 ">
                      <TextTitle
                        title={t('Occupied')}
                        description={`${area.occupiedPens} pen`}
                      />
                      <TextTitle
                        title={t('Empty')}
                        description={`${area.emptyPens} pen`}
                      />
                      <TextTitle
                        title={t('Damaged')}
                        description={`${area.damagedPens} pen`}
                      />
                    </div>
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
        </div>
      </FormComponent>
    </ModalComponent>
  );
};

export default TaskCreateModal;
