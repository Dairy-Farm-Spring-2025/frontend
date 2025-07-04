import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import TagComponents from '@components/UI/TagComponents';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import useModal, { ModalActionProps } from '@hooks/useModal';
import useToast from '@hooks/useToast';
import { TaskDateRange } from '@model/Task/Task';
import { REPORT_TASK_PATH } from '@service/api/Task/reportTaskApi';
import { TASK_PATH } from '@service/api/Task/taskApi';
import { Popover, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { t } from 'i18next';
import React, { useEffect, useMemo, useState } from 'react';
import ShiftTitle from '../components/ShiftTitle';
import StatusTask from '../components/StatusTask';
import WeekSelectorDropdown from '../components/WeekSelectorDropdown';
import '../index.scss';
import CreateReportModal from './components/CreateReportModal/CreateReportModal';
import PopoverMyTaskContent from './components/PopoverMyTaskContent';

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
const MyTaskSchedule: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const [refetch, setRefetch] = useState(false);
  const [rawData, setRawData] = useState<any[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    selectedYear === dayjs().year()
      ? dayjs().startOf('week')
      : dayjs(`${selectedYear}-01-01`).startOf('week')
  );
  const toast = useToast();
  const modalCreateReport = useModal<ModalActionProps>();
  const [id, setId] = useState<number>(0);
  const [open, setOpen] = useState<Record<any, boolean>>({});
  const fromDate = currentWeekStart.startOf('day').format('YYYY-MM-DD');
  const toDate = currentWeekStart
    .add(6, 'day')
    .endOf('day')
    .format('YYYY-MM-DD');

  const { isLoading, mutate, trigger } = useFetcher<{
    [key: string]: TaskDateRange[] | null;
  }>(TASK_PATH.TASK_DATE_RANGE, 'POST');
  const { isLoading: loadingJoinTask, trigger: triggerJoinTask } = useFetcher(
    'join-report',
    'POST'
  );
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

  const handleJoinTask = async (id: number) => {
    try {
      const response = await triggerJoinTask({
        url: REPORT_TASK_PATH.JOIN_TASK(id),
      });
      toast.showSuccess(response.message);
      setRefetch(true);
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const handleOpenCreateReport = (id: number) => {
    setId(id);
    modalCreateReport.openModal();
  };

  const handleOpenPopover = (index: any, newOpen: boolean) => {
    setOpen((prev) => ({ ...prev, [index]: newOpen }));
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
            tasks
              .filter((task: TaskDateRange) => task.shift === shift)
              .forEach((task: TaskDateRange, taskIndex: number) => {
                const uniqueTag = `${task.taskId}-${date}`;
                const tagColor = stringToDarkColor(uniqueTag); // Generate color based on uniqueTag
                const isTaskExpired = !day.isSame(dayjs(), 'day'); // Check if the task date is in the past
                const content = (
                  <Popover
                    key={uniqueTag}
                    trigger={'click'}
                    className="cursor-pointer"
                    open={!!open[uniqueTag]}
                    onOpenChange={(newOpen) =>
                      handleOpenPopover(uniqueTag, newOpen)
                    }
                    placement="topLeft"
                    color="white"
                    content={
                      <PopoverMyTaskContent
                        day={dayjs(day).format('YYYY-MM-DD')}
                        task={task}
                        setOpen={() => handleOpenPopover(uniqueTag, false)}
                        onJoinTask={() => handleJoinTask(task.taskId)}
                        loading={loadingJoinTask}
                        disabledJoinTask={isTaskExpired}
                        onOpenCreateReportModal={() =>
                          handleOpenCreateReport(task.reportTask.reportTaskId)
                        }
                      />
                    }
                  >
                    <div
                      className="rounded-lg"
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
                        <p className="truncate">{task.taskTypeId.name}</p>
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
                dayContents[dayKey].push(content);
              });
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
      width: 80,
      render: (data) => <ShiftTitle data={data} />,
      align: 'center',
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
    <AnimationAppear>
      <WhiteBackground>
        <div>
          <StatusTask />
          <div
            style={{
              display: 'flex',
              marginTop: 10,
              marginBottom: 10,
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <div className="flex gap-3">
              <Select
                value={selectedYear}
                className="!w-[120px]"
                onChange={handleYearChange}
              >
                {Array.from(
                  { length: 5 },
                  (_, i) => dayjs().year() - 2 + i
                ).map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
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
                onClick={() =>
                  setCurrentWeekStart(currentWeekStart.add(1, 'week'))
                }
              />
            </div>
          </div>
          <Table
            className="shadow-xl schedule-table"
            bordered
            loading={isLoading}
            columns={columns}
            dataSource={tableData}
            pagination={false}
            rowKey="key"
            rowClassName={(_, index) =>
              index === 0 ? 'first-row' : index === 1 ? 'second-row' : ''
            }
          />
        </div>
        <CreateReportModal
          modal={modalCreateReport}
          mutate={mutate}
          taskId={id}
          setRefetch={setRefetch}
        />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default MyTaskSchedule;
