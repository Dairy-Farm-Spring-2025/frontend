import { UploadOutlined } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import api from '@config/axios/axios';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { TASK_PATH } from '@service/api/Task/taskApi';
import { Divider, Upload } from 'antd';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import CardAreaImportTask from './components/CardAreaImportTask';
import { Area } from '@model/Area';
import { AREA_PATH } from '@service/api/Area/areaApi';
import { TaskType } from '@model/Task/task-type';
import { TASK_TYPE_PATH } from '@service/api/Task/taskType';
import dayjs from 'dayjs';

const ImportTask = () => {
  const toast = useToast();
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [importedData, setImportedData] = useState<any>({});
  const [allValid, setAllValid] = useState(true);
  const [editingKeys, setEditingKeys] = useState<Record<string, boolean>>({});
  const [availableAreas, setAvailableAreas] = useState<
    { value: string; label: string }[]
  >([]);
  const [availableTaskTypes, setAvailableTaskTypes] = useState<
    { value: string; label: string }[]
  >([]);

  const { trigger: triggerImportFile, isLoading: isLoadingImport } = useFetcher(
    TASK_PATH.GET_IMPORT_FILES,
    'POST',
    'multipart/form-data',
    false
  );
  const { data: dataArea } = useFetcher<Area[]>(AREA_PATH.AREAS, 'GET');
  const { data: dataTaskType } = useFetcher<TaskType[]>(
    TASK_TYPE_PATH.GET_ALL_TASKTYPES,
    'GET'
  );

  useEffect(() => {
    if (dataArea) {
      setAvailableAreas(
        dataArea.map((element) => ({
          value: element.name,
          label: element.name,
        }))
      );
    }
    if (dataTaskType) {
      setAvailableTaskTypes(
        dataTaskType.map((element) => ({
          value: element.name,
          label: element.name,
        }))
      );
    }
  }, [dataArea, dataTaskType]);

  // Validation function for dates (to catch invalid dates from file imports)
  const validateDates = (data: any) => {
    const tomorrow = dayjs().add(1, 'day').startOf('day');
    const maxDate = tomorrow.add(6, 'day').endOf('day');

    let isValid = true;

    for (const area in data) {
      for (const taskType in data[area]) {
        for (const task of data[area][taskType]) {
          if (task.deleted) continue;

          const fromDate = task.fromDate ? dayjs(task.fromDate) : null;
          const toDate = task.toDate ? dayjs(task.toDate) : null;

          if (fromDate && toDate) {
            if (
              fromDate.isBefore(tomorrow, 'day') ||
              fromDate.isAfter(maxDate, 'day') ||
              toDate.isBefore(tomorrow, 'day') ||
              toDate.isAfter(maxDate, 'day') ||
              toDate.isBefore(fromDate, 'day')
            ) {
              isValid = false;
              break;
            }
          }
        }
        if (!isValid) break;
      }
      if (!isValid) break;
    }

    return isValid;
  };

  useEffect(() => {
    setAllValid(validateDates(importedData));
  }, [importedData]);

  const handleDownload = async () => {
    try {
      setLoadingDownload(true);
      const response = await api.get(TASK_PATH.DOWNLOAD_TEMPLATE, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.showSuccess(t('Download template success'));
    } catch (error: any) {
      toast.showError(error.message);
    } finally {
      setLoadingDownload(false);
    }
  };

  const handleBeforeUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await triggerImportFile({ body: formData });
      if (response) {
        const formattedData = Object.keys(response).reduce((acc, area) => {
          acc[area] = Object.keys(response[area]).reduce(
            (taskAcc, taskType) => {
              const normalizedTaskType = taskType || 'Chưa rõ loại công việc';
              const tasksByDateRange: Record<string, any[]> = {};
              response[area][taskType].forEach((task: any) => {
                const dateRange = `${task.fromDate}-${task.toDate}`;
                if (!tasksByDateRange[dateRange]) {
                  tasksByDateRange[dateRange] = [];
                }
                tasksByDateRange[dateRange].push(task);
              });

              taskAcc[normalizedTaskType] = [];
              Object.entries(tasksByDateRange).forEach(([, tasks]) => {
                tasks.forEach((task, idx) => {
                  taskAcc[normalizedTaskType].push({
                    ...task,
                    key: `${area}-${normalizedTaskType}-${task.fromDate}-${task.toDate}-${idx}`,
                    taskType: task.taskType || null,
                  });
                });
              });
              return taskAcc;
            },
            {} as Record<string, any[]>
          );
          return acc;
        }, {} as any);
        setImportedData(formattedData);
        toast.showSuccess(t('Import success'));

        if (formattedData['Chưa rõ khu vực']) {
          toast.showWarning(t('Please select area for unknown area tasks'));
        }
      } else {
        toast.showError(t('No data returned'));
      }
    } catch (error: any) {
      toast.showError(error.message || t('Import failed'));
    }
    return false;
  };

  const handleUpdateTask = (
    area: string,
    originalTaskType: string,
    rowKey: string,
    updatedRow: any
  ) => {
    setImportedData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const normalizedOriginalTaskType =
        originalTaskType || 'Chưa rõ loại công việc';
      const newTaskType = updatedRow.taskType || 'Chưa rõ loại công việc';

      if (!newData[area] || !newData[area][normalizedOriginalTaskType]) {
        toast.showError(
          `Cannot find tasks for area: ${area}, taskType: ${normalizedOriginalTaskType}`
        );
        return prev;
      }

      const tasks = newData[area][normalizedOriginalTaskType];
      const taskIndex = tasks.findIndex((task: any) => task.key === rowKey);

      if (taskIndex === -1) {
        toast.showError(`Cannot find task with key: ${rowKey}`);
        return prev;
      }

      const dateRange = `${updatedRow.fromDate}-${updatedRow.toDate}`;
      const tasksInSameDateRange = (newData[area][newTaskType] || []).filter(
        (task: any) =>
          `${task.fromDate}-${task.toDate}` === dateRange && task.key !== rowKey
      );
      const newIndex = tasksInSameDateRange.length;
      const newKey = `${area}-${newTaskType}-${updatedRow.fromDate}-${updatedRow.toDate}-${newIndex}`;

      if (normalizedOriginalTaskType !== newTaskType || rowKey !== newKey) {
        if (!newData[area][newTaskType]) {
          newData[area][newTaskType] = [];
        }

        const updatedTask = {
          ...tasks[taskIndex],
          ...updatedRow,
          key: newKey,
        };
        newData[area][newTaskType].push(updatedTask);
        tasks.splice(taskIndex, 1);

        if (tasks.length === 0) {
          delete newData[area][normalizedOriginalTaskType];
        }
      } else {
        newData[area][normalizedOriginalTaskType][taskIndex] = {
          ...tasks[taskIndex],
          ...updatedRow,
          key: newKey,
        };
      }

      return newData;
    });
  };

  const handleDeleteTask = (area: string, taskType: string, rowKey: string) => {
    setImportedData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const normalizedTaskType = taskType || 'Chưa rõ loại công việc';

      if (!newData[area] || !newData[area][normalizedTaskType]) {
        toast.showError(
          `Cannot find tasks for area: ${area}, taskType: ${normalizedTaskType}`
        );
        return prev;
      }

      const tasks = newData[area][normalizedTaskType];
      const taskIndex = tasks.findIndex((task: any) => task.key === rowKey);
      if (taskIndex !== -1) {
        newData[area][normalizedTaskType][taskIndex] = {
          ...tasks[taskIndex],
          deleted: true,
        };
      }
      return newData;
    });
  };

  const handleRestoreTask = (
    area: string,
    taskType: string,
    rowKey: string
  ) => {
    setImportedData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      const normalizedTaskType = taskType || 'Chưa rõ loại công việc';

      if (!newData[area] || !newData[area][normalizedTaskType]) {
        toast.showError(
          `Cannot find tasks for area: ${area}, taskType: ${normalizedTaskType}`
        );
        return prev;
      }

      const taskIndex = newData[area][normalizedTaskType].findIndex(
        (task: any) => task.key === rowKey
      );
      if (taskIndex >= 0) {
        newData[area][normalizedTaskType][taskIndex] = {
          ...newData[area][normalizedTaskType][taskIndex],
          deleted: false,
        };
      }
      return newData;
    });
  };

  const handleChangeArea = (oldArea: string, newArea: string) => {
    if (oldArea === newArea) return;

    setImportedData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));

      if (!newData[oldArea]) {
        return prev;
      }

      if (!newData[newArea]) {
        newData[newArea] = {};
      }

      Object.keys(newData[oldArea]).forEach((taskType) => {
        const normalizedTaskType = taskType || 'Chưa rõ loại công việc';
        if (!newData[newArea][normalizedTaskType]) {
          newData[newArea][normalizedTaskType] = [];
        }

        const tasksByDateRange: Record<string, any[]> = {};
        newData[oldArea][taskType].forEach((task: any) => {
          const dateRange = `${task.fromDate}-${task.toDate}`;
          if (!tasksByDateRange[dateRange]) {
            tasksByDateRange[dateRange] = [];
          }
          tasksByDateRange[dateRange].push(task);
        });

        Object.entries(tasksByDateRange).forEach(([, tasks]) => {
          tasks.forEach((task, idx) => {
            const newKey = `${newArea}-${normalizedTaskType}-${task.fromDate}-${task.toDate}-${idx}`;
            newData[newArea][normalizedTaskType].push({
              ...task,
              key: newKey,
              areaName: newArea,
            });
          });
        });
      });

      delete newData[oldArea];
      toast.showSuccess(t('Successfully changed area'));
      return newData;
    });
  };

  const handleSubmit = async () => {
    try {
      if (importedData['Chưa rõ khu vực']) {
        toast.showError(t('Please select area for all unknown area tasks'));
        return;
      }

      if (!allValid) {
        toast.showError(t('Please correct invalid dates before submitting'));
        return;
      }

      const requestBody = [];
      for (const area in importedData) {
        for (const taskType in importedData[area]) {
          for (const task of importedData[area][taskType]) {
            if (task.deleted) continue;
            const normalizedTaskType =
              taskType === 'Chưa rõ loại công việc' ? null : taskType;
            requestBody.push({
              areaName: area,
              description: task.description,
              fromDate: task.fromDate,
              toDate: task.toDate,
              shift: task.shift,
              assigneeId: task.assigneeId,
              taskType: normalizedTaskType,
            });
          }
        }
      }

      console.log('Request body:', requestBody);
      toast.showSuccess(t('Submit successful'));
    } catch {
      toast.showError(t('Validation failed'));
    }
  };

  const isUnknownAreaExist = !!importedData['Chưa rõ khu vực'];

  return (
    <AnimationAppear>
      <WhiteBackground>
        <div className="flex gap-4">
          <Upload
            beforeUpload={handleBeforeUpload}
            showUploadList={false}
            accept=".xlsx,.xls"
          >
            <ButtonComponent
              loading={isLoadingImport}
              icon={<UploadOutlined />}
              type="primary"
            >
              {t('Import task from file')}
            </ButtonComponent>
          </Upload>
          <ButtonComponent loading={loadingDownload} onClick={handleDownload}>
            {t('Download task template')}
          </ButtonComponent>
        </div>
        <Divider className="!my-2" />

        {isUnknownAreaExist && (
          <div className="my-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-amber-600 font-medium">
              {t(
                'Some tasks need area selection. Please select area from dropdown.'
              )}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-10">
          {Object.entries(importedData || {}).map(([area, task]) => (
            <CardAreaImportTask
              key={area}
              area={area}
              task={task as any}
              assignees={[
                { id: 1, name: 'Nguyễn Văn A' },
                { id: 2, name: 'Trần Thị B' },
                { id: 3, name: 'Phạm Văn C' },
              ]}
              availableAreas={availableAreas}
              availableTaskTypes={availableTaskTypes}
              editingKeys={editingKeys}
              setEditingKeys={setEditingKeys}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onRestoreTask={handleRestoreTask}
              onChangeArea={handleChangeArea}
            />
          ))}
        </div>

        {Object.keys(importedData).length > 0 && (
          <div className="mt-4">
            <ButtonComponent
              type="primary"
              disabled={isUnknownAreaExist || !allValid}
              onClick={handleSubmit}
            >
              {t('Confirm import')}
            </ButtonComponent>
            {isUnknownAreaExist && (
              <span className="ml-3 text-red-500">
                {t(
                  'Please select area for all unknown tasks before submitting'
                )}
              </span>
            )}
            {!allValid && (
              <span className="ml-3 text-red-500">
                {t(
                  'Some tasks have invalid dates. Dates must be from tomorrow to 6 days after.'
                )}
              </span>
            )}
          </div>
        )}
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ImportTask;
