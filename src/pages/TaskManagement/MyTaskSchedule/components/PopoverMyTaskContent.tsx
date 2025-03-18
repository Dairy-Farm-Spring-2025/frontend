import {
  AppstoreFilled,
  FormOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import TagComponents from '@components/UI/TagComponents';
import { Priority, StatusTask, TaskDateRange } from '@model/Task/Task';
import { formatDateHour, formatStatusWithCamel } from '@utils/format';
import { Divider, Tooltip } from 'antd';
import { t } from 'i18next';

interface PopoverMyTaskContent {
  task: TaskDateRange;
  onOpenModal: () => void;
  setOpen?: any;
  onJoinTask: () => void;
  loading: boolean;
  disabledJoinTask?: boolean;
  onOpenCreateReportModal: () => void;
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

const PopoverMyTaskContent = ({
  task,
  onOpenModal,
  setOpen,
  loading,
  onJoinTask,
  onOpenCreateReportModal,
  disabledJoinTask,
}: PopoverMyTaskContent) => {
  const handleOpenModal = () => {
    onOpenModal();
    setOpen(false);
  };
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
        <Tooltip title={t('View report')}>
          <ButtonComponent
            shape="circle"
            type="primary"
            icon={<AppstoreFilled />}
            onClick={handleOpenModal}
          />
        </Tooltip>
        <Tooltip
          title={disabledJoinTask ? t('Task is expired') : t('Join task')}
        >
          <ButtonComponent
            shape="circle"
            type="primary"
            buttonType="secondary"
            icon={<ImportOutlined />}
            onClick={onJoinTask}
            loading={loading}
            disabled={disabledJoinTask}
          />
        </Tooltip>
        <Tooltip title={t('Report task')}>
          <ButtonComponent
            shape="circle"
            type="primary"
            buttonType="warning"
            icon={<FormOutlined />}
            onClick={handleOpenCreateReportModal}
            disabled={disabledJoinTask}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default PopoverMyTaskContent;
