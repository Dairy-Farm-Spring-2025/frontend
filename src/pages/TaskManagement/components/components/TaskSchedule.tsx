import {
  LeftOutlined,
  PlusCircleFilled,
  RightOutlined,
} from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import Title from '@components/UI/Title';
import useModal from '@hooks/useModal';
import { Select, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import TaskCreateModal from './TaskCreateModal';
import { formatDateHour, formatStatusWithCamel } from '@utils/format';

const { Option } = Select;

interface Task {
  key: string;
  name: string;
  worker: string;
  priority: number;
  shift: 'dayShift' | 'nightShift';
  fromDate: string;
  toDate: string;
}

const shifts = ['dayShift', 'nightShift'];

const templateData: Task[] = [
  {
    key: '1',
    name: 'Inventory Check',
    worker: 'John Doe',
    priority: 1,
    shift: 'dayShift',
    fromDate: '2025-03-03',
    toDate: '2025-03-03',
  },
  {
    key: '2',
    name: 'Inventory Check',
    worker: 'John Doe',
    priority: 1,
    shift: 'dayShift',
    fromDate: '2025-03-03',
    toDate: '2025-03-05',
  },
  {
    key: '3',
    name: 'Inventory Check',
    worker: 'John Doe',
    priority: 1,
    shift: 'dayShift',
    fromDate: '2025-03-05',
    toDate: '2025-03-08',
  },
  {
    key: '3',
    name: 'Inventory Check',
    worker: 'John Doe',
    priority: 1,
    shift: 'dayShift',
    fromDate: '2025-03-05',
    toDate: '2025-03-08',
  },
  // ... giữ nguyên các data mẫu khác
];

const TaskSchedule: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(templateData);
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

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    currentWeekStart.add(i, 'day')
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

    tasks
      .filter((task) => task.shift === shift)
      .forEach((task) => {
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

          const isRange = actualEndIndex > actualStartIndex;
          const width = (actualEndIndex - actualStartIndex + 1) * 200;

          const content = (
            <Tooltip
              title={
                <div>
                  {task.fromDate === task.toDate ? (
                    <>
                      <p>{formatDateHour(task.fromDate)}</p>
                    </>
                  ) : (
                    <>
                      <p>From: {formatDateHour(task.fromDate)}</p>
                      <p>To: {formatDateHour(task.toDate)}</p>
                    </>
                  )}
                </div>
              }
            >
              <div
                key={task.key}
                style={{
                  position: isRange ? 'absolute' : 'static',
                  width: isRange ? `${width}px` : 'auto',
                  backgroundColor: isRange ? '#dbeafe' : 'transparent',
                  padding: '4px 8px',
                  margin: '2px 0',
                  fontWeight: 'bold',
                  border: '1px solid #93c5fd',
                  borderRadius: '4px',
                  zIndex: 1,
                  fontSize: 12,
                }}
              >
                <div className="overflow-y-auto text-clip max-w-full">
                  <p className="truncate">
                    {task.name}{' '}
                    <span className="font-bold text-yellow-500">
                      {task.fromDate === task.toDate
                        ? ''
                        : `(${formatDateHour(task.fromDate)} - ${formatDateHour(
                            task.toDate
                          )})`}
                    </span>
                  </p>
                </div>
                <p>({task.worker})</p>
              </div>
            </Tooltip>
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
      title: 'Shift',
      dataIndex: 'shift',
      key: 'shift',
      width: 80,
      render: (data) => formatStatusWithCamel(data),
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
              ? 'font-bold bg-blue-600 text-white'
              : 'font-normal'
          } flex flex-col`}
        >
          <p className="font-bold">{day.format('dddd')}</p>
          <p>{day.format('DD / MM')}</p>
        </div>
      ),
      dataIndex: day.format('dddd'),
      key: day.format('dddd'),
      width: 100,
    })),
  ];

  return (
    <div>
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

        <ButtonComponent onClick={jumpToToday}>Today</ButtonComponent>

        <ButtonComponent
          type="primary"
          icon={<PlusCircleFilled />}
          onClick={modal.openModal}
          style={{ marginBottom: 16 }}
        >
          Add Task
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
          onClick={() => setCurrentWeekStart(currentWeekStart.add(1, 'week'))}
        />
      </div>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        rowKey="key"
      />

      <TaskCreateModal modal={modal as any} />
    </div>
  );
};

export default TaskSchedule;
