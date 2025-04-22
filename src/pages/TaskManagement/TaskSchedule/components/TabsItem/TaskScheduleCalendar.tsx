import {
  LeftOutlined,
  PlusCircleFilled,
  RightOutlined,
} from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import SelectComponent from '@components/Select/SelectComponent';
import TagComponents from '@components/UI/TagComponents';
import useFetcher from '@hooks/useFetcher';
import useModal, { ModalActionProps } from '@hooks/useModal';
import { Area } from '@model/Area';
import { IllnessCow } from '@model/Cow/Illness';
import { TaskDateRange } from '@model/Task/Task';
import { TaskType } from '@model/Task/task-type';
import { UserProfileData } from '@model/User';
import ShiftTitle from '@pages/TaskManagement/components/ShiftTitle';
import StatusTask from '@pages/TaskManagement/components/StatusTask';
import WeekSelectorDropdown from '@pages/TaskManagement/components/WeekSelectorDropdown';
import { AREA_PATH } from '@service/api/Area/areaApi';
import { HEALTH_RECORD_PATH } from '@service/api/HealthRecord/healthRecordApi';
import { TASK_PATH } from '@service/api/Task/taskApi';
import { getColorByRole } from '@utils/statusRender/roleRender';
import { Divider, Select, Skeleton, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { t } from 'i18next';
import React, { useEffect, useMemo, useState } from 'react';
import PopoverTask from '../components/PopoverTask';
import TaskCreateModal from '../components/TaskCreateModal';
import UpdateTaskModal from '../components/UpdateTaskModal';
import './index.scss';

const { Option } = Select;

const shifts = ['dayShift', 'nightShift'];

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
  const [date, setDate] = useState();
  const modalUpdateTask = useModal<ModalActionProps>();
  const [id, setId] = useState<number>(0);
  const modalCreate = useModal();
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
  const { data: dataAreas } = useFetcher<Area[]>(AREA_PATH.AREAS, 'GET');
  const {
    data: dataUserFree,
    trigger: triggerFetchingFreeUser,
    isLoading: isLoadingTriggerFetchingFreeUser,
  } = useFetcher<UserProfileData[]>(
    'free-users',
    'GET',
    'application/json',
    modalCreate.open
  );
  const {
    data: dataUserNightShift,
    trigger: triggerFetchingUserNightShift,
    isLoading: isLoadingTriggerUserNightShift,
  } = useFetcher<UserProfileData[]>(
    'night-shift',
    'GET',
    'application/json',
    modalCreate.open
  );
  const {
    data: dataVetAvailable,
    trigger: triggerDataVetAivailable,
    isLoading: isLoadingTriggerVetAvailable,
  } = useFetcher<UserProfileData[]>(
    'get-vet-availabel',
    'GET',
    'application/json',
    modalCreate.open
  );
  const { data: dataIllness } = useFetcher<IllnessCow[]>(
    HEALTH_RECORD_PATH.ILLNESS,
    'GET'
  );

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
                  {element?.name} -{' '}
                  <TagComponents
                    color={getColorByRole(element?.roleId?.name as any)}
                  >
                    {t(element?.roleId?.name)}
                  </TagComponents>
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

  const handleOpenReportModal = (id: number) => {
    modalUpdateTask.openModal();
    setId(id);
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
                const tagColor = 'green'; // Generate color based on uniqueTag
                const content = (
                  <PopoverTask
                    day={dayjs(day).format('YYYY-MM-DD')}
                    setDate={setDate}
                    handleOpenPopover={(newOpen: any) =>
                      handleOpenPopover(uniqueTag, newOpen)
                    }
                    handleOpenReportModal={() =>
                      handleOpenReportModal(task.taskId)
                    }
                    mutate={mutate}
                    open={!!open[uniqueTag]}
                    setOpen={setOpen}
                    setOpenViewMore={setOpenViewMore}
                    setRefetch={setRefetch}
                    tagColor={tagColor}
                    task={task}
                    taskIndex={taskIndex}
                    uniqueTag={uniqueTag}
                  />
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
                      <PopoverTask
                        day={dayjs(day).format('YYYY-MM-DD')}
                        setDate={setDate}
                        handleOpenPopover={(newOpen: any) =>
                          handleOpenPopover(uniqueTag, newOpen)
                        }
                        handleOpenReportModal={() =>
                          handleOpenReportModal(task.taskId)
                        }
                        mutate={mutate}
                        open={!!open[uniqueTag]}
                        setOpen={setOpen}
                        setOpenViewMore={setOpenViewMore}
                        setRefetch={setRefetch}
                        tagColor={tagColor}
                        task={task}
                        taskIndex={taskIndex}
                        uniqueTag={uniqueTag}
                      />
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
              maxHeight: 500, // Set maximum height
              overflowY: 'auto', // Enable vertical scrolling
              minHeight: 40 + (dayContents[dayKey].length - 1) * 60,
              height: 140,
            }}
            className="h-full custom-scrollbar"
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

  const optionsDataTaskTypes = useMemo(
    () =>
      (dataTaskTypes || []).map((element) => ({
        label: element?.name,
        value: element.taskTypeId,
        desc: element,
        searchLabel: element?.name,
      })),
    [dataTaskTypes]
  );

  const optionsAreas = useMemo(
    () =>
      (dataAreas || []).map((element) => ({
        label: element.name,
        value: element.areaId,
        desc: element,
        searchLabel: element.name,
      })),
    [dataAreas]
  );

  const optionsIllness = useMemo(
    () =>
      (dataIllness || [])
        .filter((element) => element.illnessStatus === 'pending')
        .map((element) => ({
          searchLabel: `${element?.cowEntity.name}`,
          label: element?.cowEntity ? element?.cowEntity?.name : 'N/A',
          value: element?.illnessId,
          desc: element,
        })),
    [dataIllness]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-5 items-center">
        <div className="flex gap-2 items-center">
          <p className="text-base font-bold">{t('Select task type')}:</p>
          <SelectComponent
            search={true}
            className="!w-[400px]"
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
          onClick={modalCreate.openModal}
        >
          {t('Add Task')}
        </ButtonComponent>
        <StatusTask />
      </div>
      <Divider className="!my-2" />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative', // 👈 container có position
        }}
      >
        <div className="flex gap-3">
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

          <ButtonComponent
            className="shadow-md"
            type="primary"
            buttonType="amber"
            onClick={jumpToToday}
          >
            {t('Today')}
          </ButtonComponent>
        </div>

        <p
          className="text-primary font-bold text-xl"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
          }}
        >
          {selectedYear} | {currentWeekStart.format('DD / MM')} -{' '}
          {weekDays[6].format('DD / MM')}
        </p>

        <div className="flex gap-2">
          <ButtonComponent
            shape="round"
            icon={<LeftOutlined />}
            className="!shadow-none"
            onClick={() =>
              setCurrentWeekStart(currentWeekStart.subtract(1, 'week'))
            }
            type="primary"
            buttonType="geekblue"
          />
          <ButtonComponent
            shape="round"
            icon={<RightOutlined />}
            className="!shadow-none"
            type="primary"
            buttonType="geekblue"
            onClick={() => setCurrentWeekStart(currentWeekStart.add(1, 'week'))}
          />
        </div>
      </div>
      <Skeleton loading={isLoading}>
        <Table
          className="schedule-table"
          bordered
          columns={columns}
          dataSource={tableData}
          pagination={false}
          rowKey="key"
          scroll={{ x: 'max-content', y: 550 }} // Enable scrolling
          rowClassName={(_, index) =>
            index === 0 ? 'first-row' : index === 1 ? 'second-row' : ''
          }
        />
      </Skeleton>
      <TaskCreateModal
        dataFreeUser={{
          isLoading: isLoadingTriggerFetchingFreeUser,
          data: dataUserFree,
          triggerFetchingFreeUser: triggerFetchingFreeUser,
        }}
        dataNightUser={{
          isLoading: isLoadingTriggerUserNightShift,
          data: dataUserNightShift,
          triggerFetchingFreeUser: triggerFetchingUserNightShift,
        }}
        dataVetAvailable={{
          isLoading: isLoadingTriggerVetAvailable,
          triggerFetchingFreeUser: triggerDataVetAivailable,
          data: dataVetAvailable,
        }}
        optionsAreas={optionsAreas}
        optionsDataTaskTypes={optionsDataTaskTypes}
        optionsIllness={optionsIllness}
        setRefetch={setRefetch}
        modal={modalCreate as any}
        mutate={mutate}
      />
      <UpdateTaskModal
        day={date as any}
        modal={modalUpdateTask}
        mutate={mutate}
        taskId={id}
        optionsArea={optionsAreas}
        setRefetch={setRefetch}
        dataFreeUser={{
          isLoading: isLoadingTriggerFetchingFreeUser,
          data: dataUserFree,
          triggerFetchingFreeUser: triggerFetchingFreeUser,
        }}
        dataNightUser={{
          isLoading: isLoadingTriggerUserNightShift,
          data: dataUserNightShift,
          triggerFetchingFreeUser: triggerFetchingUserNightShift,
        }}
        dataVetAvailable={{
          isLoading: isLoadingTriggerVetAvailable,
          triggerFetchingFreeUser: triggerDataVetAivailable,
          data: dataVetAvailable,
        }}
      />
    </div>
  );
};

export default TaskScheduleCalendar;
