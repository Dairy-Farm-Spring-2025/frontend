import {
  AppstoreFilled,
  FormOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import TagComponents from '@components/UI/TagComponents';
import { TaskDateRange } from '@model/Task/Task';
import { formatDateHour, formatStatusWithCamel } from '@utils/format';
import {
  priorityColors,
  statusColors,
} from '@utils/statusRender/taskStatusRender';
import { Divider, Tooltip } from 'antd';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

interface PopoverMyTaskContent {
  task: TaskDateRange;
  setOpen?: any;
  onJoinTask: () => void;
  loading: boolean;
  disabledJoinTask?: boolean;
  onOpenCreateReportModal: () => void;
  day: string;
}

const PopoverMyTaskContent = ({
  day,
  task,
  setOpen,
  loading,
  onJoinTask,
  onOpenCreateReportModal,
  disabledJoinTask,
}: PopoverMyTaskContent) => {
  const navigate = useNavigate();
  const handleOpenCreateReportModal = () => {
    onOpenCreateReportModal();
    setOpen(false);
  };
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
                ? statusColors[task.reportTask.status]
                : '#DEDEDE',
            }}
          ></span>
          {t(
            task.reportTask
              ? formatStatusWithCamel(task?.reportTask.status)
              : 'Not start'
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
        <Tooltip title={t('View report')}>
          <ButtonComponent
            shape="circle"
            type="primary"
            icon={<AppstoreFilled />}
            onClick={() => navigate(`${task.taskId}/${day}`)}
          />
        </Tooltip>
        <Tooltip
          title={
            disabledJoinTask
              ? t('Task is not available to join')
              : task.reportTask
              ? t('Task is reported')
              : t('Join task')
          }
        >
          <ButtonComponent
            shape="circle"
            type="primary"
            buttonType="secondary"
            icon={<ImportOutlined />}
            onClick={onJoinTask}
            loading={loading}
            disabled={disabledJoinTask || !!task.reportTask}
          />
        </Tooltip>
        <Tooltip title={t('Report task')}>
          <ButtonComponent
            shape="circle"
            type="primary"
            buttonType="warning"
            icon={<FormOutlined />}
            onClick={handleOpenCreateReportModal}
            disabled={
              disabledJoinTask ||
              task.reportTask === null ||
              task.reportTask?.description !== null
            }
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default PopoverMyTaskContent;
