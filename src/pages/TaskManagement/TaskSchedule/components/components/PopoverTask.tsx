import TagComponents from '@components/UI/TagComponents';
import {
  statusColors,
  statusTaskBorder,
} from '@utils/statusRender/taskStatusRender';
import { Popover, Tooltip } from 'antd';
import React from 'react';
import PopoverTaskContent from '../components/PopoverTaskContent';

interface PopoverTaskProps {
  uniqueTag: string;
  open: boolean;
  setOpen: (openState: Record<string, boolean>) => void;
  task: any;
  day: string;
  setOpenViewMore: (state: Record<string, boolean>) => void;
  setRefetch: (value: boolean) => void;
  mutate: () => void;
  handleOpenReportModal: any;
  tagColor: string;
  handleOpenPopover: any;
  taskIndex: number;
  setDate: any;
}

const PopoverTask: React.FC<PopoverTaskProps> = ({
  open,
  setOpen,
  task,
  day,
  setOpenViewMore,
  setRefetch,
  mutate,
  handleOpenReportModal,
  handleOpenPopover,
  taskIndex,
  setDate,
}) => {
  return (
    <Popover
      open={open}
      onOpenChange={handleOpenPopover}
      trigger={'click'}
      className="cursor-pointer"
      placement="topLeft"
      color="white"
      content={
        <PopoverTaskContent
          setDate={setDate}
          day={day}
          disabledUpdateButton={task.reportTask !== null}
          setOpenViewMore={setOpenViewMore}
          setOpen={setOpen}
          setRefetch={setRefetch}
          mutate={mutate}
          task={task}
          openReportTask={handleOpenReportModal}
        />
      }
    >
      <div
        className={`border-[1px] rounded-lg`}
        style={{
          position: 'relative',
          width: 'auto',
          backgroundColor: task.reportTask
            ? statusColors[task.reportTask.status]
            : '#DEDEDE',
          padding: '0px 8px',
          fontWeight: 'bold',
          zIndex: 1 + taskIndex,
          fontSize: 12,
          borderColor: task.reportTask
            ? statusTaskBorder[task.reportTask.status]
            : '#808080',
        }}
      >
        <div className="overflow-y-auto text-clip max-w-full">
          <p className="truncate">
            {task?.taskTypeId ? task?.taskTypeId?.name : 'N/A'}
          </p>
        </div>
        <Tooltip title={task.assigneeName ? task.assigneeName : 'N/A'}>
          <TagComponents
            className="text-xs !font-bold overflow-y-auto text-clip max-w-full !py-[2px] rounded-lg !px-2"
            color="cyan"
          >
            <p className="truncate">
              🧑‍🦱 {task.assigneeName ? task.assigneeName : 'N/A'}
            </p>
          </TagComponents>
        </Tooltip>
      </div>
    </Popover>
  );
};

export default PopoverTask;
