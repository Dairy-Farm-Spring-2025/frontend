import { AppstoreFilled, DeleteOutlined } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import PopconfirmComponent from '@components/Popconfirm/PopconfirmComponent';
import TagComponents from '@components/UI/TagComponents';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { Priority, StatusTask, Task } from '@model/Task/Task';
import { formatDateHour, formatStatusWithCamel } from '@utils/format';
import { Divider } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useCallback } from 'react';

interface PopoverTaskContent {
  task: Task;
  mutate: any;
}

const priorityColors: Record<Priority, string> = {
  low: 'green',
  medium: 'yellow',
  high: 'red',
  critical: 'darkred',
};

const statusColors: Record<StatusTask, string> = {
  pending: '#FEF9C3', // Light Yellow
  inProgress: '#DBEAFE', // Light Blue
  completed: '#D1FAE5', // Light Green
  reviewed: '#E9D5FF', // Light Purple
};

const PopoverTaskContent = ({ task, mutate }: PopoverTaskContent) => {
  const toast = useToast();
  const isDeleteDisabled = dayjs().isAfter(dayjs(task.fromDate), 'day');
  const { trigger: triggerDelete, isLoading: loadingDelete } = useFetcher(
    `tasks/delete`,
    'DELETE'
  );
  const handleDeleteTasks = useCallback(
    async (id: number) => {
      try {
        const response = await triggerDelete({ url: `tasks/${id}` });
        toast.showSuccess(response.message);
        mutate();
      } catch (error: any) {
        toast.showError(error.message);
      }
    },
    [mutate, toast, triggerDelete]
  );
  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-3">
        <p>{t('Priority')}: </p>
        <p className="text-black font-bold flex items-center gap-1 col-span-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: priorityColors[task.priority] }}
          ></span>
          {t(formatStatusWithCamel(task?.priority))}
        </p>
      </div>
      <div className="grid grid-cols-3">
        <p>{t('Status')}: </p>
        <p className="text-black font-bold flex items-center gap-1 col-span-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: statusColors[task.status] }}
          ></span>
          {t(formatStatusWithCamel(task?.status))}
        </p>
      </div>
      <TagComponents className="text-sm" color="blue">
        {task.fromDate === task.toDate ? (
          <>
            <p className="text-black">{formatDateHour(task.fromDate)}</p>
          </>
        ) : (
          <div className="text-black">
            <p>
              {formatDateHour(task.fromDate)} - {formatDateHour(task.toDate)}
            </p>
          </div>
        )}
      </TagComponents>
      <Divider className="my-1" />
      <div className="flex gap-2">
        <PopconfirmComponent
          title={undefined}
          onConfirm={() => handleDeleteTasks(task?.taskId)}
        >
          <ButtonComponent
            disabled={isDeleteDisabled}
            loading={loadingDelete}
            danger
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
          />
        </PopconfirmComponent>
        <ButtonComponent
          shape="circle"
          type="primary"
          icon={<AppstoreFilled />}
        />
      </div>
    </div>
  );
};

export default PopoverTaskContent;
