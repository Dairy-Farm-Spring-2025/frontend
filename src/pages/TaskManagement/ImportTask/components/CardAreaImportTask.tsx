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
import InputComponent from '@components/Input/InputComponent';
import SelectComponent from '@components/Select/SelectComponent';
import TableComponent, { Column } from '@components/Table/TableComponent';
import Title from '@components/UI/Title';
import { SHIFT_TASK } from '@service/data/shiftData';
import { formatDateHour } from '@utils/format';
import { Form, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useCallback, useMemo, useRef, useState } from 'react';

interface CardAreaImportTaskProps {
  area?: string;
  task?: Record<string, any[]>;
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
  getAssignees: (
    taskType: string,
    area: string,
    fromDate: string,
    toDate: string
  ) => Promise<{ value: number; label: string }[]>;
}

const CardAreaImportTask = ({
  area = '',
  task = {},
  availableAreas = [],
  availableTaskTypes = [],
  editingKeys,
  setEditingKeys,
  onUpdateTask,
  onDeleteTask,
  onRestoreTask,
  onChangeArea,
  getAssignees,
}: CardAreaImportTaskProps) => {
  const [form] = Form.useForm();
  const [selectedArea, setSelectedArea] = useState<string>(area);
  const [assigneeOptions, setAssigneeOptions] = useState<
    Record<string, { value: number; label: string }[]>
  >({});
  const isUnknownArea = area === 'Chưa rõ khu vực';
  // Track fetching status per row
  const fetchingStatus = useRef<Record<string, boolean>>({});
  // Track last fetched data to prevent redundant fetches
  const lastFetchedData = useRef<Record<string, string>>({});

  const hasError = useMemo(
    () => (record: any) => {
      const today = dayjs().startOf('day');

      const fromDate = record.fromDate ? dayjs(record.fromDate) : null;
      const toDate = record.toDate ? dayjs(record.toDate) : null;
      const isFromDateInvalid = !fromDate || fromDate.isBefore(today);

      const isToDateInvalid =
        !toDate ||
        (fromDate && toDate.isBefore(fromDate)) ||
        toDate.isBefore(today);
      const isDateRangeInvalid =
        fromDate && toDate && toDate.diff(fromDate, 'day') > 6;

      const isTaskTypeInvalid = !record.taskType;

      const isAssigneeInvalid =
        record.assigneeId === null || record.assigneeId === undefined;

      console.log(
        isFromDateInvalid,
        isToDateInvalid,
        isDateRangeInvalid,
        isTaskTypeInvalid,
        isAssigneeInvalid
      );

      return (
        isFromDateInvalid ||
        isToDateInvalid ||
        isDateRangeInvalid ||
        isTaskTypeInvalid ||
        isAssigneeInvalid
      );
    },
    []
  );

  const fetchAssigneesForRow = useCallback(
    async (
      rowKey: string,
      taskType: string,
      fromDate: string,
      toDate: string
    ) => {
      // Skip if already fetching
      if (fetchingStatus.current[rowKey]) {
        return;
      }

      // Create a unique key for the fetch data
      const fetchKey = `${taskType}-${fromDate}-${toDate}-${area}`;
      // Skip if we already fetched this exact data
      if (lastFetchedData.current[rowKey] === fetchKey) {
        return;
      }

      fetchingStatus.current[rowKey] = true;

      try {
        console.log(
          `Fetching assignees for rowKey: ${rowKey}, taskType: ${taskType}, fromDate: ${fromDate}, toDate: ${toDate}`
        );

        const effectiveToDate =
          toDate && dayjs(toDate).isBefore(dayjs(fromDate)) ? fromDate : toDate;

        const assignees = await getAssignees(
          taskType,
          area,
          fromDate,
          effectiveToDate
        );

        setAssigneeOptions((prev) => {
          const prevAssignees = prev[rowKey] || [];
          if (JSON.stringify(prevAssignees) !== JSON.stringify(assignees)) {
            return { ...prev, [rowKey]: assignees };
          }
          return prev;
        });

        // Update last fetched data
        lastFetchedData.current[rowKey] = fetchKey;
      } catch (error) {
        console.error(`Error fetching assignees for ${rowKey}:`, error);
        setAssigneeOptions((prev) => ({
          ...prev,
          [rowKey]: [],
        }));
      } finally {
        fetchingStatus.current[rowKey] = false;
      }
    },
    [getAssignees, area]
  );

  const disabledFromDate = (current: dayjs.Dayjs) => {
    return (
      (current && current.isBefore(dayjs().startOf('day'))) ||
      current.isSame(dayjs().startOf('day'))
    );
  };

  const disabledToDate = (current: dayjs.Dayjs, rowKey: string) => {
    const fromDate = form.getFieldValue([rowKey, 'fromDate']);
    if (!fromDate) {
      return false;
    }
    const minDate = dayjs(fromDate).startOf('day');
    const maxDate = dayjs(fromDate).add(5, 'day').endOf('day');
    return current && (current.isBefore(minDate) || current.isAfter(maxDate));
  };

  const handleEdit = (rowKey: string, record: any) => {
    form.setFieldsValue({
      [rowKey]: {
        ...record,
        fromDate: record.fromDate ? dayjs(record.fromDate) : null,
        toDate: record.toDate ? dayjs(record.toDate) : null,
        taskType: record.taskType || null,
      },
    });
    setEditingKeys((prev) => ({ ...prev, [rowKey]: true }));
  };

  const handleSave = (rowKey: string, originalTaskType: string) => {
    form
      .validateFields([rowKey])
      .then(() => {
        const updatedRow = form.getFieldValue(rowKey);
        onUpdateTask(
          area,
          originalTaskType || 'Chưa rõ loại công việc',
          rowKey,
          {
            ...updatedRow,
            taskType: updatedRow.taskType || null,
            fromDate: updatedRow.fromDate
              ? updatedRow.fromDate.format('YYYY-MM-DD')
              : null,
            toDate: updatedRow.toDate
              ? updatedRow.toDate.format('YYYY-MM-DD')
              : null,
            stripes: updatedRow.stripes || null,
          }
        );
        setEditingKeys((prev) => ({ ...prev, [rowKey]: false }));
        form.resetFields([rowKey]);
        // Cleanup
        delete fetchingStatus.current[rowKey];
        delete lastFetchedData.current[rowKey];
      })
      .catch((error) => {
        console.log('Validation failed:', error);
      });
  };

  const handleCancel = (rowKey: string) => {
    setEditingKeys((prev) => ({ ...prev, [rowKey]: false }));
    form.resetFields([rowKey]);
    // Cleanup
    delete fetchingStatus.current[rowKey];
    delete lastFetchedData.current[rowKey];
  };

  const handleDelete = (rowKey: string, taskType: string) => {
    onDeleteTask(area, taskType || 'Chưa rõ loại công việc', rowKey);
    // Cleanup
    delete fetchingStatus.current[rowKey];
    delete lastFetchedData.current[rowKey];
  };

  const handleRestore = (rowKey: string, taskType: string) => {
    if (onRestoreTask) {
      onRestoreTask(area, taskType || 'Chưa rõ loại công việc', rowKey);
    }
  };

  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
    if (onChangeArea && value !== area) {
      onChangeArea(area, value);
    }
  };

  const handleAssigneeDropdownVisibleChange = (
    open: boolean,
    rowKey: string
  ) => {
    if (open) {
      const rowData = form.getFieldValue(rowKey);
      if (rowData?.taskType && rowData?.fromDate) {
        const fromDateStr = rowData.fromDate.format
          ? rowData.fromDate.format('YYYY-MM-DD')
          : rowData.fromDate;
        const toDateStr = rowData.toDate
          ? rowData.toDate.format
            ? rowData.toDate.format('YYYY-MM-DD')
            : rowData.toDate
          : fromDateStr;
        fetchAssigneesForRow(rowKey, rowData.taskType, fromDateStr, toDateStr);
      }
    }
  };

  const handleValuesChange = (
    changedValues: any,
    allValues: any,
    rowKey: string
  ) => {
    const changedField = Object.keys(changedValues[rowKey])[0];
    const value = changedValues[rowKey][changedField];

    if (changedField === 'taskType') {
      form.setFieldsValue({
        [rowKey]: {
          ...allValues[rowKey],
          taskType: value,
          fromDate: null,
          toDate: null,
          shift: null,
          assigneeId: null,
          description: allValues[rowKey]?.description || '',
        },
      });
      setAssigneeOptions((prev) => ({
        ...prev,
        [rowKey]: [],
      }));
      delete fetchingStatus.current[rowKey];
      delete lastFetchedData.current[rowKey];
    }

    if (changedField === 'fromDate') {
      if (
        allValues[rowKey].taskType === 'Khám định kì' ||
        allValues[rowKey].taskType === 'Trực ca đêm'
      ) {
        form.setFieldsValue({
          [rowKey]: {
            ...allValues[rowKey],
            toDate: value,
            assigneeId: null,
          },
        });
      } else {
        form.setFieldsValue({
          [rowKey]: {
            ...allValues[rowKey],
            assigneeId: null,
            toDate: null,
          },
        });
      }
      setAssigneeOptions((prev) => ({
        ...prev,
        [rowKey]: [],
      }));
      delete fetchingStatus.current[rowKey];
      delete lastFetchedData.current[rowKey];
    }
  };

  const columnsDateRange: Column[] = [
    {
      title: t('Task type'),
      dataIndex: 'taskType',
      minWidth: 200,
      key: 'taskType',
      render: (_, record) =>
        editingKeys[record.key] ? (
          <Form.Item
            name={[record.key, 'taskType']}
            rules={[{ required: true, message: t('Please select task type') }]}
            noStyle
          >
            <SelectComponent
              options={availableTaskTypes}
              style={{ width: '100%' }}
              placeholder={t('Select task type')}
              allowClear
            />
          </Form.Item>
        ) : record.error ? (
          <Tooltip
            title={
              hasError(record) &&
              record.errorMessage
                ?.split(';')
                .map((msg: string, index: number) => (
                  <div key={index}>- {msg.trim()}</div>
                ))
            }
          >
            <span
              className={`${hasError(record) ? 'text-white' : 'text-black'}`}
            >
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
      minWidth: 250,
      key: 'fromDate',
      render: (_, record) =>
        editingKeys[record.key] ? (
          <Form.Item
            name={[record.key, 'fromDate']}
            rules={[{ required: true, message: t('Please select from date') }]}
            noStyle
          >
            <DatePickerComponent disabledDate={disabledFromDate} />
          </Form.Item>
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
      minWidth: 250,
      key: 'toDate',
      render: (_, record) =>
        editingKeys[record.key] ? (
          <Form.Item
            name={[record.key, 'toDate']}
            rules={[{ required: true, message: t('Please select to date') }]}
            noStyle
          >
            <DatePickerComponent
              disabledDate={(current) => disabledToDate(current, record.key)}
              disabled={
                form.getFieldValue([record.key, 'taskType']) ===
                  'Khám định kì' ||
                form.getFieldValue([record.key, 'taskType']) === 'Trực ca đêm'
              }
            />
          </Form.Item>
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
      minWidth: 250,
      key: 'description',
      render: (_, record) =>
        editingKeys[record.key] ? (
          <Form.Item name={[record.key, 'description']} noStyle>
            <InputComponent />
          </Form.Item>
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
      minWidth: 200,
      render: (_, record) =>
        editingKeys[record.key] ? (
          <Form.Item name={[record.key, 'shift']} noStyle>
            <SelectComponent options={SHIFT_TASK()} style={{ width: '100%' }} />
          </Form.Item>
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
      minWidth: 200,
      key: 'assigneeId',
      render: (_, record) =>
        editingKeys[record.key] ? (
          <Form.Item
            name={[record.key, 'assigneeId']}
            rules={[{ required: true, message: t('Please select assignee') }]}
            noStyle
          >
            <SelectComponent
              style={{ width: '100%' }}
              options={assigneeOptions[record.key] || []}
              placeholder={t('Select assignee')}
              onDropdownVisibleChange={(open) =>
                handleAssigneeDropdownVisibleChange(open, record.key)
              }
              loading={fetchingStatus.current[record.key] || false}
            />
          </Form.Item>
        ) : (
          <span
            style={record.deleted ? { textDecoration: 'line-through' } : {}}
          >
            {record.assigneeName ||
              (assigneeOptions[record.key] || []).find(
                (a) => a.value === record.assigneeId
              )?.label ||
              '-'}
          </span>
        ),
    },
    {
      title: t('Action'),
      key: 'action',
      dataIndex: 'id',
      minWidth: 100,
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

  const renderAreaTitle = () => {
    if (isUnknownArea) {
      return (
        <div className="flex items-center gap-2">
          <span>{t('Select area')}:</span>
          <SelectComponent
            placeholder={t('Please select area')}
            style={{ width: 240 }}
            value={selectedArea}
            onChange={handleAreaChange}
            options={availableAreas}
          />
        </div>
      );
    }
    return area;
  };

  return (
    <CardComponent
      className="!shadow-card"
      title={<Title>{renderAreaTitle()}</Title>}
    >
      <Form
        form={form}
        onValuesChange={(changedValues, allValues) => {
          const rowKey = Object.keys(changedValues)[0];
          if (rowKey) {
            handleValuesChange(changedValues, allValues, rowKey);
          }
        }}
      >
        {Object.entries(task).map(([taskType, taskList]: [string, any[]]) => {
          const displayTaskType = taskType || t('Chưa rõ loại công việc');
          return (
            <div key={taskType || 'unknown'} className="mb-6">
              <Title className="font-bold text-base text-green-700 mb-2">
                {t('Task type')}:{' '}
                <span className="font-semibold ml-1">{displayTaskType}</span>
              </Title>
              <TableComponent
                columns={columnsDateRange}
                dataSource={taskList.map((item) => ({
                  ...item,
                  taskType: item.taskType || null,
                  error: item.error,
                  errorMessage: item.errorMessage,
                }))}
                pagination={false}
                rowClassName={(record) => {
                  let className = '';
                  if (hasError(record)) {
                    className += 'error-row ';
                  }
                  if (record.deleted) {
                    className += 'deleted-row ';
                  }
                  return className.trim();
                }}
              />
            </div>
          );
        })}
      </Form>
    </CardComponent>
  );
};

export default CardAreaImportTask;
