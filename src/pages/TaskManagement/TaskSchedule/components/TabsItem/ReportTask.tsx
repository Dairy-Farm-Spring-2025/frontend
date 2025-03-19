import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
import EmptyComponent from '@components/Error/EmptyComponent';
import TableComponent, { Column } from '@components/Table/TableComponent';
import TagComponents from '@components/UI/TagComponents';
import TextTitle from '@components/UI/TextTitle';
import useFetcher from '@hooks/useFetcher';
import { ReportTaskDate } from '@model/Task/ReportTask';
import { Task } from '@model/Task/Task';
import { REPORT_TASK_PATH } from '@service/api/Task/reportTaskApi';
import { formatStatusWithCamel } from '@utils/format';
import { getReportTaskStatusColor } from '@utils/statusRender/reportStatusRender';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import CommentReport from './components/CommentReport';

const ReportTask = () => {
  const [day, setDay] = useState<any>(dayjs(new Date()));
  const { data, isLoading, mutate } = useFetcher<ReportTaskDate[]>(
    REPORT_TASK_PATH.REPORT_TASK_BY_DATE(dayjs(day).format('YYYY-MM-DD')),
    'GET'
  );
  const [selectedTask, setSelectedTask] = useState<ReportTaskDate | null>(null);

  useEffect(() => {
    if (data && data?.length > 0) {
      setSelectedTask(data[0]);
    }
  }, [data, day]);

  const handleChangeDay = (value: any) => {
    setDay(dayjs(value));
  };

  const handleMutate = async () => {
    await mutate();
    setDay(day);
  };

  const columns: Column[] = [
    {
      title: t('Task'),
      dataIndex: 'taskId',
      key: 'task',
      render: (data: Task) => data.taskTypeId.name,
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      render: (data) => (
        <TagComponents
          className="!text-sm"
          color={getReportTaskStatusColor(data)}
        >
          {formatStatusWithCamel(data)}
        </TagComponents>
      ),
    },
    {
      title: t('Task type'),
      dataIndex: 'taskId',
      key: 'type',
      render: (data: Task) => t(data.taskTypeId.roleId.name),
    },
    {
      title: t('Assignee'),
      dataIndex: 'taskId',
      key: 'assignee',
      render: (data: Task) => data?.assignee?.name,
    },
  ];
  return (
    <div className="flex flex-col gap-5">
      <TextTitle
        title={t('Select date to view report')}
        description={
          <DatePickerComponent
            value={day}
            onChange={handleChangeDay}
            className="!w-1/5"
            allowClear={false}
          />
        }
      />
      <div className="flex gap-10">
        <div className="w-1/2 flex flex-col gap-5">
          <TableComponent
            columns={columns}
            dataSource={data as any}
            loading={isLoading}
            rowKey={'taskId'}
            onRow={(record) => ({
              onClick: () => setSelectedTask(record),
              style: {
                cursor: 'pointer',
                backgroundColor:
                  selectedTask?.taskId === record.taskId ? '#f0f0f0' : 'white',
              },
            })}
          />
        </div>
        <div className="w-1/2">
          {data && data.length > 0 ? (
            <CommentReport
              mutate={handleMutate}
              selectedTask={selectedTask as ReportTaskDate}
            />
          ) : (
            <EmptyComponent />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportTask;
