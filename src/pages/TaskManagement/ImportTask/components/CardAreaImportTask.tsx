import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import CardComponent from '@components/Card/CardComponent';
import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
import TableComponent, { Column } from '@components/Table/TableComponent';
import { formatDateHour } from '@utils/format';
import { Input, Select, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useState } from 'react';

const { Option } = Select;

interface CardAreaImportTaskProps {
  area?: string;
  task?: Record<string, any[]>;
  assignees: { id: number; name: string }[];
  availableAreas?: { value: string; label: string }[];
  availableTaskTypes?: { value: string; label: string }[];
  editingKeys: Record<string, boolean>;
  setEditingKeys: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onUpdateTask: (
    area: string,
    taskType: string,
    rowKey: string,
    updatedRow: any
  ) => void;
  onDeleteTask: (area: string, taskType: string, rowKey: string) => void;
  onRestoreTask?: (area: string, taskType: string, rowKey: string) => void;
  onChangeArea?: (oldArea: string, newArea: string) => void;
}

const CardAreaImportTask = ({
  area = '',
  task = {},
  assignees,
  availableAreas = [],
  availableTaskTypes = [],
  editingKeys,
  setEditingKeys,
  onUpdateTask,
  onDeleteTask,
  onRestoreTask,
  onChangeArea,
}: CardAreaImportTaskProps) => {
  const [editData, setEditData] = useState<Record<string, any>>({});
  const [selectedArea, setSelectedArea] = useState<string>(area);

  const isUnknownArea = area === 'Chưa rõ khu vực';

  // Function to disable dates before tomorrow and after 6 days from tomorrow
  const disabledDate = (current: dayjs.Dayjs) => {
    const tomorrow = dayjs().add(1, 'day').startOf('day');
    const maxDate = tomorrow.add(6, 'day').endOf('day');
    return current && (current < tomorrow || current > maxDate);
  };

  const handleEdit = (rowKey: string, record: any) => {
    setEditData((prev) => ({
      ...prev,
      [rowKey]: {
        ...record,
        fromDate: record.fromDate ? dayjs(record.fromDate) : null,
        toDate: record.toDate ? dayjs(record.toDate) : null,
        taskType: record.taskType || null,
      },
    }));
    setEditingKeys((prev) => ({ ...prev, [rowKey]: true }));
  };

  const handleSave = (rowKey: string, originalTaskType: string) => {
    const updatedRow = editData[rowKey];
    if (updatedRow) {
      onUpdateTask(area, originalTaskType || 'Chưa rõ loại công việc', rowKey, {
        ...updatedRow,
        taskType: updatedRow.taskType || null,
        fromDate: updatedRow.fromDate
          ? updatedRow.fromDate.format('YYYY-MM-DD')
          : null,
        toDate: updatedRow.toDate
          ? updatedRow.toDate.format('YYYY-MM-DD')
          : null,
        stripes: updatedRow.stripes || null,
      });
      setEditData((prev) => {
        const { [rowKey]: _, ...rest } = prev;
        console.log(_);
        return rest;
      });
      setEditingKeys((prev) => ({ ...prev, [rowKey]: false }));
    }
  };

  const handleCancel = (rowKey: string) => {
    setEditData((prev) => {
      const { [rowKey]: _, ...rest } = prev;
      console.log(_);
      return rest;
    });
    setEditingKeys((prev) => ({ ...prev, [rowKey]: false }));
  };

  const handleDelete = (rowKey: string, taskType: string) => {
    onDeleteTask(area, taskType || 'Chưa rõ loại công việc', rowKey);
  };

  const handleRestore = (rowKey: string, taskType: string) => {
    if (onRestoreTask) {
      onRestoreTask(area, taskType || 'Chưa rõ loại công việc', rowKey);
    }
  };

  const handleInputChange = (rowKey: string, field: string, value: any) => {
    setEditData((prev) => ({
      ...prev,
      [rowKey]: {
        ...prev[rowKey],
        [field]: value,
      },
    }));
  };

  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
    if (onChangeArea && value !== area) {
      onChangeArea(area, value);
    }
  };

  const columnsDateRange: Column[] = [
    {
      title: t('Task type'),
      dataIndex: 'taskType',
      key: 'taskType',
      render: (_, record) =>
        editingKeys[record.key] ? (
          <Select
            value={editData[record.key]?.taskType || undefined}
            onChange={(value) =>
              handleInputChange(record.key, 'taskType', value)
            }
            style={{ width: '100%' }}
            placeholder={t('Select task type')}
            allowClear
          >
            {availableTaskTypes.map((type) => (
              <Option key={type.value} value={type.value}>
                {type.label}
              </Option>
            ))}
          </Select>
        ) : record.error ? (
          <Tooltip
            title={record.errorMessage
              ?.split(';')
              .map((msg: string, index: number) => (
                <div key={index}>- {msg.trim()}</div>
              ))}
          >
            <span className="text-white">
              {record.taskType || t('Chưa rõ loại công việc')}
            </span>
          </Tooltip>
        ) : (
          record.taskType || t('Chưa rõ loại công việc')
        ),
    },
    {
      title: t('From date'),
      dataIndex: 'fromDate',
      key: 'fromDate',
      render: (_, record) =>
        editingKeys[record.key] ? (
          <DatePickerComponent
            value={editData[record.key]?.fromDate || null}
            onChange={(value) =>
              handleInputChange(record.key, 'fromDate', value)
            }
            disabledDate={disabledDate}
          />
        ) : (
          <span
            style={record.deleted ? { textDecoration: 'line-through' } : {}}
          >
            {formatDateHour(record.fromDate)}
          </span>
        ),
    },
    {
      title: t('To date'),
      dataIndex: 'toDate',
      key: 'toDate',
      render: (_, record) =>
        editingKeys[record.key] ? (
          <DatePickerComponent
            value={editData[record.key]?.toDate || null}
            onChange={(value) => handleInputChange(record.key, 'toDate', value)}
            disabledDate={disabledDate}
          />
        ) : (
          <span
            style={record.deleted ? { textDecoration: 'line-through' } : {}}
          >
            {formatDateHour(record.toDate)}
          </span>
        ),
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      key: 'description',
      render: (_, record) =>
        editingKeys[record.key] ? (
          <Input
            value={editData[record.key]?.description || ''}
            onChange={(e) =>
              handleInputChange(record.key, 'description', e.target.value)
            }
          />
        ) : (
          <span
            style={record.deleted ? { textDecoration: 'line-through' } : {}}
          >
            {record.description || '-'}
          </span>
        ),
    },
    {
      title: t('Shift'),
      dataIndex: 'shift',
      key: 'shift',
      render: (_, record) =>
        editingKeys[record.key] ? (
          <Select
            value={editData[record.key]?.shift || undefined}
            onChange={(value) => handleInputChange(record.key, 'shift', value)}
            style={{ width: '100%' }}
          >
            <Option value="dayShift">{t('Day Shift')}</Option>
            <Option value="nightShift">{t('Night Shift')}</Option>
          </Select>
        ) : (
          <span
            style={record.deleted ? { textDecoration: 'line-through' } : {}}
          >
            {record.shift === 'dayShift'
              ? t('Day Shift')
              : record.shift === 'nightShift'
              ? t('Night Shift')
              : '-'}
          </span>
        ),
    },
    {
      title: t('Assignee'),
      dataIndex: 'assigneeId',
      key: 'assigneeId',
      render: (_, record) =>
        editingKeys[record.key] ? (
          <Select
            value={editData[record.key]?.assigneeId || undefined}
            onChange={(value) =>
              handleInputChange(record.key, 'assigneeId', value)
            }
            style={{ width: '100%' }}
          >
            {assignees.map((assignee) => (
              <Option key={assignee.id} value={assignee.id}>
                {assignee.name}
              </Option>
            ))}
          </Select>
        ) : (
          <span
            style={record.deleted ? { textDecoration: 'line-through' } : {}}
          >
            {assignees.find((a) => a.id === record.assigneeId)?.name || '-'}
          </span>
        ),
    },
    {
      title: t('Action'),
      key: 'action',
      dataIndex: 'id',
      render: (_, record) => {
        if (record.deleted) {
          return (
            <div className="flex gap-2">
              <ButtonComponent
                shape="circle"
                onClick={() =>
                  handleRestore(
                    record.key,
                    record.taskType || 'Chưa rõ loại công việc'
                  )
                }
                icon={<UndoOutlined />}
                title={t('Restore')}
              />
            </div>
          );
        }

        return (
          <div className="flex gap-2">
            {editingKeys[record.key] ? (
              <>
                <ButtonComponent
                  shape="circle"
                  type="primary"
                  onClick={() =>
                    handleSave(
                      record.key,
                      record.taskType || 'Chưa rõ loại công việc'
                    )
                  }
                  icon={<CheckOutlined />}
                  title={t('Save')}
                />
                <ButtonComponent
                  shape="circle"
                  danger
                  onClick={() => handleCancel(record.key)}
                  icon={<CloseOutlined />}
                  title={t('Cancel')}
                />
              </>
            ) : (
              <>
                <ButtonComponent
                  shape="circle"
                  buttonType="warning"
                  onClick={() => handleEdit(record.key, record)}
                  icon={<EditOutlined />}
                  title={t('Edit')}
                />
                <ButtonComponent
                  shape="circle"
                  danger
                  onClick={() =>
                    handleDelete(
                      record.key,
                      record.taskType || 'Chưa rõ loại công việc'
                    )
                  }
                  icon={<DeleteOutlined />}
                  title={t('Delete')}
                />
              </>
            )}
          </div>
        );
      },
    },
  ];

  const groupByDateRange = (tasks: any[]) => {
    return tasks.reduce((acc: any, curr) => {
      const dateRange = `${curr.fromDate}~${curr.toDate}`;
      if (!acc[dateRange]) acc[dateRange] = [];
      acc[dateRange].push(curr);
      return acc;
    }, {} as Record<string, any[]>);
  };

  const renderAreaTitle = () => {
    if (isUnknownArea) {
      return (
        <div className="flex items-center gap-2">
          <span>{t('Select area')}:</span>
          <Select
            placeholder={t('Please select area')}
            style={{ width: 240 }}
            value={selectedArea}
            onChange={handleAreaChange}
          >
            {availableAreas.map((area) => (
              <Option key={area.value} value={area.value}>
                {area.label}
              </Option>
            ))}
          </Select>
        </div>
      );
    }
    return area;
  };

  return (
    <CardComponent title={renderAreaTitle()}>
      {Object.entries(task).map(([taskType, taskList]: [string, any[]]) => {
        const displayTaskType = taskType || t('Chưa rõ loại công việc');
        const groupedByDate = groupByDateRange(taskList);
        return (
          <div key={taskType || 'unknown'} className="mb-6">
            <h3 className="font-semibold text-base text-green-700 mb-2">
              {t('Task type')}: {displayTaskType}
            </h3>
            {(Object.entries(groupedByDate) as [string, any[]][]).map(
              ([dateRange, tasksInDateRange]: [string, any[]]) => (
                <div key={dateRange} className="mb-4">
                  <h4 className="font-semibold text-sm text-blue-700 mb-2">
                    {t('Date range')}: {dateRange}
                  </h4>
                  <TableComponent
                    columns={columnsDateRange}
                    dataSource={tasksInDateRange.map((item) => ({
                      ...item,
                      taskType: item.taskType || null,
                      error: item.error,
                      errorMessage: item.errorMessage,
                    }))}
                    pagination={false}
                    rowClassName={(record) => {
                      let className = record.error ? 'error-row' : '';
                      if (record.deleted) className += ' deleted-row';
                      return className;
                    }}
                  />
                </div>
              )
            )}
          </div>
        );
      })}
    </CardComponent>
  );
};

export default CardAreaImportTask;
