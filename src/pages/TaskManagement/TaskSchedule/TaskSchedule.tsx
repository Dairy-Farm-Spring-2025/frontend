import {
  LeftOutlined,
  PlusCircleFilled,
  RightOutlined,
} from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import Title from '@components/UI/Title';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import useModal from '@hooks/useModal';
import { StatusTask, Task } from '@model/Task/Task';
import { formatDateHour, formatStatusWithCamel } from '@utils/format';
import { Popover, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import PopoverTaskContent from './components/PopoverTaskContent';
import TaskCreateModal from './components/TaskCreateModal';
import { t } from 'i18next';
import './index.scss';
import Text from '@components/UI/Text';

const { Option } = Select;

const shifts = ['dayShift', 'nightShift'];

const statusColors: Record<StatusTask, string> = {
  pending: '#FEF9C3', // Light Yellow
  inProgress: '#DBEAFE', // Light Blue
  completed: '#D1FAE5', // Light Green
  reviewed: '#E9D5FF', // Light Purple
};

const TaskSchedule: React.FC = () => {
  const {
    data: dataTasks,
    isLoading,
    mutate,
  } = useFetcher<Task[]>('tasks', 'GET');
  const modal = useModal();
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year());
  const [currentWeekStart, setCurrentWeekStart] = useState(
    selectedYear === dayjs().year()
      ? dayjs().startOf('week')
      : dayjs(`${selectedYear}-01-01`).startOf('week')
  );

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

    dataTasks
      ?.filter((task) => task.shift === shift)
      .sort((a, b) => {
        const aIsSingleDay = dayjs(a.fromDate).isSame(a.toDate, 'day');
        const bIsSingleDay = dayjs(b.fromDate).isSame(b.toDate, 'day');

        if (aIsSingleDay && !bIsSingleDay) return -1; // Single-day tasks first
        if (!aIsSingleDay && bIsSingleDay) return 1; // Multi-day tasks last

        // If both are multi-day, sort by start date
        return dayjs(a.fromDate).isBefore(b.fromDate) ? -1 : 1;
      })
      .forEach((task, taskIndex) => {
        const fromDate = dayjs(task.fromDate).startOf('day');
        const toDate = dayjs(task.toDate).startOf('day');
        const weekStart = weekDays[0].startOf('day');
        const weekEnd = weekDays[6].startOf('day');

        const startIndex = Math.max(
          0,
          weekDays.findIndex((d) => d.startOf('day').isSame(fromDate, 'day'))
        );
        const endIndex = Math.min(
          6,
          weekDays.findIndex((d) => d.startOf('day').isSame(toDate, 'day'))
        );

        if (
          fromDate.isBefore(weekEnd.add(1, 'day')) &&
          toDate.isAfter(weekStart.subtract(1, 'day'))
        ) {
          const actualStartIndex = fromDate.isBefore(weekStart)
            ? 0
            : startIndex === -1
            ? 0
            : startIndex;
          const actualEndIndex = toDate.isAfter(weekEnd)
            ? 6
            : endIndex === -1
            ? 6
            : endIndex;

          const isSingleDay = fromDate.isSame(toDate, 'day');
          const isRange = actualEndIndex > actualStartIndex;
          const width = (actualEndIndex - actualStartIndex + 1) * 195;

          const content = (
            <Popover
              trigger={'click'}
              className="cursor-pointer"
              placement="topLeft"
              color="white"
              content={<PopoverTaskContent mutate={mutate} task={task} />}
            >
              <div
                key={task.taskId}
                className="border-2 rounded-lg border-primary"
                style={{
                  position: isSingleDay ? 'relative' : 'absolute', // Single-day tasks should be relative
                  width: isRange ? `${width}px` : 'auto',
                  backgroundColor: statusColors[task.status],
                  padding: '4px 8px',
                  margin: '2px 0',
                  fontWeight: 'bold',
                  zIndex:
                    isSingleDay || startIndex !== actualStartIndex
                      ? 1 + taskIndex // Ensure single-day tasks are on top
                      : 1,
                  fontSize: 12,
                }}
              >
                <div className="overflow-y-auto text-clip max-w-full">
                  <p className="truncate">
                    {task?.taskTypeId?.name}{' '}
                    <span className="font-bold text-rose-600">
                      {task.fromDate === task.toDate
                        ? ''
                        : `(${formatDateHour(task.fromDate)} - ${formatDateHour(
                            task.toDate
                          )})`}
                    </span>
                  </p>
                </div>
                <p>👤 ({task?.assignee?.name})</p>
              </div>
            </Popover>
          );

          const startDay = weekDays[actualStartIndex].format('dddd');
          dayContents[startDay].push(content);
        }
      });

    weekDays.forEach((day) => {
      const dayKey = day.format('dddd');
      if (dayContents[dayKey].length > 0) {
        row[dayKey] = (
          <div
            style={{
              position: 'relative',
              minHeight: 40 + (dayContents[dayKey].length - 1) * 65,
            }}
            className="h-full"
          >
            {dayContents[dayKey].map((taskContent, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  top: `${index * 55}px`,
                  left: 0,
                  width: '100%',
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
      render: (data) => (
        <p
          className={`!px-2 !py-5 !h-full font-black text-base rounded-lg  ${
            data === 'dayShift'
              ? 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 '
              : 'bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white'
          }`}
        >
          {data === 'dayShift' ? '☀️ ' : '🌙 '}
          {t(formatStatusWithCamel(data))}
        </p>
      ),
    },
    ...weekDays.map((day) => ({
      title: (
        <div
          style={{
            padding: '5px',
            borderRadius: '5px',
          }}
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
          <div className="flex gap-10 mb-5">
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 border-[1px] border-yellow-400 rounded-xl bg-[#FEF9C3]"></div>
              <Text>{t('Pending')}</Text>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 border-[1px] border-blue-400 rounded-xl bg-[#DBEAFE]"></div>
              <Text>{t('In progress')}</Text>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 border-[1px] border-green-400 rounded-xl bg-[#D1FAE5]"></div>
              <Text>{t('Completed')}</Text>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 border-[1px] border-purple-400 rounded-xl bg-[#E9D5FF]"></div>
              <Text>{t('Reviewed')}</Text>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: 16 }}>
            <Select
              value={selectedYear}
              onChange={handleYearChange}
              style={{ width: 120 }}
            >
              {Array.from({ length: 5 }, (_, i) => dayjs().year() - 2 + i).map(
                (year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                )
              )}
            </Select>

            <ButtonComponent onClick={jumpToToday}>
              {t('Today')}
            </ButtonComponent>

            <ButtonComponent
              type="primary"
              icon={<PlusCircleFilled />}
              onClick={modal.openModal}
              style={{ marginBottom: 16 }}
            >
              {t('Add Task')}
            </ButtonComponent>
          </div>
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
              onClick={() =>
                setCurrentWeekStart(currentWeekStart.add(1, 'week'))
              }
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

          <TaskCreateModal modal={modal as any} mutate={mutate} />
        </div>
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default TaskSchedule;
