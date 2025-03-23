import {
  LeftOutlined,
  PlusCircleFilled,
  RightOutlined,
} from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import SelectComponent from '@components/Select/SelectComponent';
import TagComponents from '@components/UI/TagComponents';
import Title from '@components/UI/Title';
import useFetcher from '@hooks/useFetcher';
import useModal, { ModalActionProps } from '@hooks/useModal';
import { TaskDateRange } from '@model/Task/Task';
import { TaskType } from '@model/Task/task-type';
import ShiftTitle from '@pages/TaskManagement/components/ShiftTitle';
import StatusTask from '@pages/TaskManagement/components/StatusTask';
import WeekSelectorDropdown from '@pages/TaskManagement/components/WeekSelectorDropdown';
import { TASK_PATH } from '@service/api/Task/taskApi';
import { Popover, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { t } from 'i18next';
import React, { useEffect, useMemo, useState } from 'react';
import PopoverTaskContent from '../components/PopoverTaskContent';
import ReportTaskManagerModal from '../components/ReportTaskManagerModal';
import TaskCreateModal from '../components/TaskCreateModal';
import './index.scss';

const { Option } = Select;

const shifts = ['dayShift', 'nightShift'];

const statusColors: Record<any, string> = {
  pending: '#FEF9C3',
  inProgress: '#DBEAFE',
  completed: '#D1FAE5',
  reviewed: '#E9D5FF',
  processing: '#DBEAFE',
  closed: '#D1FAE5',
};
const stringToDarkColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360; // Hue value between 0 and 359
  return `hsl(${hue}, 80%, 30%)`; // Dark colors: high saturation (80%), low lightness (30%)
};
const TaskScheduleCalendar: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const [refetch, setRefetch] = useState(false);
  const [rawData, setRawData] = useState<any[]>([]);
  const [optionsTaskType, setOptionsTaskTypes] = useState<any[]>([]);
  const [selectedTaskType, setSelectedTaskTypes] = useState<
    string | undefined
  >();
  const [open, setOpen] = useState<Record<any, boolean>>({});
  const [openViewMore, setOpenViewMore] = useState<Record<any, boolean>>({});
  const modalReportTask = useModal<ModalActionProps>();
  const [id, setId] = useState<number>(0);
  const [date, setDate] = useState<string>('');
  const [currentWeekStart, setCurrentWeekStart] = useState(
    selectedYear === dayjs().year()
      ? dayjs().startOf('week')
      : dayjs(`${selectedYear}-01-01`).startOf('week')
  );
  const fromDate = currentWeekStart.startOf('day').format('YYYY-MM-DD');
  const toDate = currentWeekStart
    .add(6, 'day')
    .endOf('day')
    .format('YYYY-MM-DD');
  const { isLoading, mutate, trigger } = useFetcher<{
    [key: string]: TaskDateRange[] | null;
  }>(TASK_PATH.TASK_MANAGER_DATE_RANGE, 'POST');
  const { data: dataTaskTypes } = useFetcher<TaskType[]>(
    TASK_PATH.TASKS_TYPE,
    'GET'
  );
  const modal = useModal();

  useEffect(() => {
    if (dataTaskTypes) {
      setOptionsTaskTypes(
        dataTaskTypes.map((element) => {
          const searchLabel = `${element?.name} ${element.roleId?.name}`;
          return {
            label: element?.name,
            value: element?.taskTypeId,
            desc: (
              <div>
                <p>
                  {element?.name} - {element?.roleId?.name}
                </p>
              </div>
            ),
            searchLabel: searchLabel,
          };
        })
      );
    }
  }, [dataTaskTypes]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await trigger({ body: { fromDate, toDate } });
      setRawData(response.data);
    };
    if (refetch) {
      fetchData();
      setRefetch(false);
    }
    fetchData();
  }, [fromDate, toDate, refetch]);

  useEffect(() => {
    setOpenViewMore({}); // Reset khi tuần thay đổi
  }, [currentWeekStart]);

  const handleOpenPopover = (index: any, newOpen: boolean) => {
    setOpen((prev) => ({ ...prev, [index]: newOpen }));
  };

  const handleOpenReportModal = (id: number, date: string) => {
    modalReportTask.openModal();
    setId(id);
    const formatDate = dayjs(date).format('YYYY-MM-DD');
    setDate(formatDate);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setCurrentWeekStart(
      year === dayjs().year()
        ? dayjs().startOf('week')
        : dayjs(`${year}-01-01`).startOf('week')
    );
  };

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => currentWeekStart.add(i, 'day')),
    [currentWeekStart]
  );

  const jumpToToday = () => {
    setSelectedYear(dayjs().year());
    setCurrentWeekStart(dayjs().startOf('week'));
  };

  const tableData = shifts.map((shift) => {
    const row: any = { shift, key: `shift-${shift}` };

    const dayContents: { [key: string]: React.ReactNode[] } = {};
    weekDays.forEach((day) => {
      dayContents[day.format('dddd')] = [];
      row[day.format('dddd')] = (
        <div
          style={{ position: 'relative', minHeight: 'auto', height: 'auto' }}
        ></div>
      );
    });

    // Populate tasks based on rawData date keys
    if (rawData) {
      Object.entries(rawData).forEach(([date, tasks]) => {
        if (tasks && tasks.length > 0) {
          const day = dayjs(date);
          const dayKey = day.format('dddd');
          // Check if the date falls within the current week
          const isTaskExpired = day.isAfter(dayjs(), 'day'); // Check if the task date is in the past
          if (weekDays.some((d) => d.isSame(day, 'day'))) {
            const tasksForShift = tasks.filter(
              (task: TaskDateRange) => task.shift === shift
            );
            const filteredTask = tasksForShift?.filter(
              (element: TaskDateRange) =>
                !selectedTaskType ||
                element?.taskTypeId?.taskTypeId === selectedTaskType
            );
            const visibleTasks = filteredTask.slice(0, 5);
            const hiddenTasks = filteredTask.slice(5);
            visibleTasks
              .filter((task: TaskDateRange) => task.shift === shift)
              .forEach((task: TaskDateRange, taskIndex: number) => {
                const uniqueTag = `${task.taskId}-${date}`;
                const tagColor = stringToDarkColor(uniqueTag); // Generate color based on uniqueTag
                const content = (
                  <Popover
                    open={!!open[uniqueTag]}
                    onOpenChange={(newOpen) =>
                      handleOpenPopover(uniqueTag, newOpen)
                    }
                    key={uniqueTag}
                    trigger={'click'}
                    className="cursor-pointer"
                    placement="topLeft"
                    color="white"
                    content={
                      <PopoverTaskContent
                        day={dayjs(day).format('YYYY-MM-DD')}
                        disabledReportButton={isTaskExpired}
                        setOpenViewMore={setOpenViewMore}
                        setOpen={setOpen}
                        setRefetch={setRefetch}
                        mutate={mutate}
                        task={task}
                        openReportTask={() =>
                          handleOpenReportModal(task.taskId, day as any)
                        }
                      />
                    }
                  >
                    <div
                      className={'border-2 rounded-lg border-none'}
                      style={{
                        position: 'relative', // Always relative, no spanning
                        width: 'auto', // Fixed width, no stretching
                        backgroundColor: task.reportTask
                          ? statusColors[task.reportTask.status]
                          : '#DEDEDE',
                        padding: '0px 8px',
                        fontWeight: 'bold',
                        zIndex: 1 + taskIndex, // Stack tasks vertically
                        fontSize: 12,
                      }}
                    >
                      <div className="overflow-y-auto text-clip max-w-full">
                        <p className="truncate">{task?.taskTypeId?.name}</p>
                      </div>
                      <TagComponents
                        className="text-xs !font-bold overflow-y-auto text-clip max-w-full !py-[2px] rounded-lg !px-2"
                        style={{ backgroundColor: tagColor }}
                      >
                        <p className="truncate text-white">
                          🧑‍🦱 {task?.assigneeName}
                        </p>
                      </TagComponents>
                    </div>
                  </Popover>
                );
                dayContents[dayKey].push(content);
              });
            if (hiddenTasks.length > 0) {
              const keyDayViewMore = dayjs(day).format('dddd');
              const viewMoreButton = (
                <p
                  key={keyDayViewMore}
                  className="text-blue-500 text-sm cursor-pointer mt-2 text-center font-bold"
                  onClick={() =>
                    setOpenViewMore((prev) => ({
                      ...prev,
                      [keyDayViewMore]: !prev[keyDayViewMore], // Toggle trạng thái
                    }))
                  }
                >
                  {openViewMore[keyDayViewMore]
                    ? t('Hide')
                    : `${t('task_schedule.task_view_more', {
                        hiddenTask: hiddenTasks.length,
                      })}`}
                </p>
              );
              if (openViewMore[keyDayViewMore]) {
                hiddenTasks.forEach(
                  (task: TaskDateRange, taskIndex: number) => {
                    const uniqueTag = `${task.taskId}-${date}`;
                    const tagColor = stringToDarkColor(uniqueTag);
                    dayContents[dayKey].push(
                      <Popover
                        open={!!open[uniqueTag]}
                        onOpenChange={(newOpen) =>
                          handleOpenPopover(uniqueTag, newOpen)
                        }
                        key={uniqueTag}
                        trigger={'click'}
                        className="cursor-pointer"
                        placement="topLeft"
                        color="white"
                        content={
                          <PopoverTaskContent
                            day={dayjs(day).format('YYYY-MM-DD')}
                            disabledReportButton={isTaskExpired}
                            setOpenViewMore={setOpenViewMore}
                            setOpen={setOpen}
                            setRefetch={setRefetch}
                            mutate={mutate}
                            task={task}
                            openReportTask={() =>
                              handleOpenReportModal(task.taskId, day as any)
                            }
                          />
                        }
                      >
                        <div
                          className="border-2 rounded-lg border-primary"
                          style={{
                            position: 'relative', // Always relative, no spanning
                            width: 'auto', // Fixed width, no stretching
                            backgroundColor: task.reportTask
                              ? statusColors[task.reportTask.status]
                              : '#DEDEDE',
                            padding: '0px 8px',
                            fontWeight: 'bold',
                            zIndex: 1 + taskIndex, // Stack tasks vertically
                            fontSize: 12,
                          }}
                        >
                          <div className="overflow-y-auto text-clip max-w-full">
                            <p className="truncate">{task?.taskTypeId?.name}</p>
                          </div>
                          <TagComponents
                            className="text-xs !font-bold overflow-y-auto text-clip max-w-full !py-[2px] rounded-lg !px-2"
                            style={{ backgroundColor: tagColor }}
                          >
                            <p className="truncate text-white">
                              🧑‍🦱 {task.assigneeName}
                            </p>
                          </TagComponents>
                        </div>
                      </Popover>
                    );
                  }
                );
              }
              dayContents[dayKey].push(viewMoreButton);
            }
          }
        }
      });
    }

    weekDays.forEach((day) => {
      const dayKey = day.format('dddd');
      if (dayContents[dayKey].length > 0) {
        row[dayKey] = (
          <div
            style={{
              minHeight: 40 + (dayContents[dayKey].length - 1) * 65,
            }}
            className="h-full"
          >
            {dayContents[dayKey].map((taskContent, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  top: `${index * 60}px`,
                  left: 0,
                  width: '100%',
                  padding: 10,
                }}
              >
                {taskContent}
              </div>
            ))}
          </div>
        );
      }
    });

    return row;
  });

  const columns: ColumnsType<any> = [
    {
      title: t('Shift'),
      dataIndex: 'shift',
      key: 'shift',
      align: 'center',
      width: 80,
      render: (data) => <ShiftTitle data={data} />,
    },
    ...weekDays.map((day) => ({
      title: (
        <div
          style={{ padding: '5px', borderRadius: '5px' }}
          className={`${
            day.isSame(dayjs(), 'day')
              ? 'font-bold bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white'
              : 'font-normal'
          } flex flex-col !py-2 !text-center`}
        >
          <p className="font-bold">{t(day.format('dddd'))}</p>
          <p>{day.format('DD / MM')}</p>
        </div>
      ),
      dataIndex: day.format('dddd'),
      key: day.format('dddd'),
      width: 100,
    })),
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-5">
        <div className="flex gap-2 items-center">
          <p className="text-base font-bold">{t('Select task type')}:</p>
          <SelectComponent
            search={true}
            className="!w-[240px]"
            options={optionsTaskType}
            optionRender={(option) => option.data.desc}
            value={selectedTaskType}
            onChange={setSelectedTaskTypes}
            allowClear
          />
        </div>{' '}
        <ButtonComponent
          type="primary"
          icon={<PlusCircleFilled />}
          onClick={modal.openModal}
        >
          {t('Add Task')}
        </ButtonComponent>
      </div>
      <div className="flex gap-5">
        <Select
          value={selectedYear}
          className="!w-[120px]"
          onChange={handleYearChange}
        >
          {Array.from({ length: 5 }, (_, i) => dayjs().year() - 2 + i).map(
            (year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            )
          )}
        </Select>

        <WeekSelectorDropdown
          selectedYear={selectedYear}
          currentWeekStart={currentWeekStart}
          setCurrentWeekStart={setCurrentWeekStart}
        />

        <ButtonComponent className="shadow-md" onClick={jumpToToday}>
          {t('Today')}
        </ButtonComponent>
      </div>
      <StatusTask />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <ButtonComponent
          shape="round"
          icon={<LeftOutlined />}
          onClick={() =>
            setCurrentWeekStart(currentWeekStart.subtract(1, 'week'))
          }
        />

        <Title>
          {selectedYear} | {currentWeekStart.format('DD / MM')} -{' '}
          {weekDays[6].format('DD / MM')}
        </Title>

        <ButtonComponent
          shape="round"
          icon={<RightOutlined />}
          onClick={() => setCurrentWeekStart(currentWeekStart.add(1, 'week'))}
        />
      </div>
      <Table
        className="shadow-xl schedule-table"
        bordered
        loading={isLoading}
        columns={columns}
        dataSource={tableData}
        pagination={false}
        rowKey="key"
      />

      <TaskCreateModal
        setRefetch={setRefetch}
        modal={modal as any}
        mutate={mutate}
      />
      <ReportTaskManagerModal
        day={date}
        modal={modalReportTask}
        mutate={mutate}
        taskId={id}
      />
    </div>
  );
};

export default TaskScheduleCalendar;
