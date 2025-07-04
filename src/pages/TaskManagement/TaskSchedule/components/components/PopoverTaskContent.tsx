import { AppstoreFilled, DeleteOutlined, EditFilled } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import PopconfirmComponent from '@components/Popconfirm/PopconfirmComponent';
import TagComponents from '@components/UI/TagComponents';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { TaskDateRange } from '@model/Task/Task';
import { formatDateHour, formatStatusWithCamel } from '@utils/format';
import {
  priorityColors,
  statusColors,
} from '@utils/statusRender/taskStatusRender';
import { Divider, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface PopoverTaskContent {
  task: TaskDateRange;
  mutate: any;
  setRefetch: any;
  openReportTask: () => void;
  setOpen: any;
  setOpenViewMore: any;
  disabledUpdateButton: boolean;
  day: string;
  setDate: any;
}

const PopoverTaskContent = ({
  task,
  mutate,
  setRefetch,
  setOpen,
  openReportTask,
  day,
  disabledUpdateButton,
  setDate,
}: PopoverTaskContent) => {
  const toast = useToast();
  const navigate = useNavigate();
  const isDeleteDisabled =
    dayjs().isAfter(dayjs(task.fromDate), 'day') ||
    dayjs().isSame(dayjs(task.fromDate), 'day');
  const isEditDisabled =
    dayjs().isAfter(dayjs(day), 'day') || dayjs().isSame(dayjs(day), 'day');
  const { trigger: triggerDelete, isLoading: loadingDelete } = useFetcher(
    `tasks/delete`,
    'DELETE'
  );
  const handleOpenEdit = () => {
    setOpen((prev: any) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => (newState[key] = false));
      return newState;
    });
    openReportTask();
    setDate(day);
  };
  const handleDeleteTasks = useCallback(
    async (id: number) => {
      try {
        const response = await triggerDelete({ url: `tasks/${id}` });
        toast.showSuccess(response.message);
        mutate();
        setRefetch(true);
      } catch (error: any) {
        toast.showError(error.message);
      }
    },
    [mutate, setRefetch, toast, triggerDelete]
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
            style={{
              backgroundColor: task?.reportTask
                ? statusColors[task?.reportTask?.status]
                : '#DEDEDE',
            }}
          ></span>
          {t(
            formatStatusWithCamel(
              task?.reportTask ? task?.reportTask?.status : 'notStart'
            )
          )}
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
        <Tooltip title={t('Delete')}>
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
        </Tooltip>
        <Tooltip title={t('View detail')}>
          <ButtonComponent
            shape="circle"
            type="primary"
            icon={<AppstoreFilled />}
            onClick={() => navigate(`../${task.taskId}/${day}`)}
          />
        </Tooltip>
        <Tooltip title={t('Edit task')}>
          <ButtonComponent
            icon={<EditFilled />}
            shape="circle"
            type="primary"
            buttonType="secondary"
            onClick={handleOpenEdit}
            disabled={
              (disabledUpdateButton || isEditDisabled) &&
              task.assigneeName !== null
            }
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default PopoverTaskContent;
