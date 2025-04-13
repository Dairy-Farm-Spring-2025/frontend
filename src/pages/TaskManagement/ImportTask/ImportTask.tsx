import { CheckOutlined, UploadOutlined } from '@ant-design/icons';
import ButtonComponent from '@components/Button/ButtonComponent';
import FloatButtonComponent from '@components/FloatButton/FloatButtonComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import api from '@config/axios/axios';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { Area } from '@model/Area';
import { TaskType } from '@model/Task/task-type';
import { AREA_PATH } from '@service/api/Area/areaApi';
import { TASK_PATH } from '@service/api/Task/taskApi';
import { TASK_TYPE_PATH } from '@service/api/Task/taskType';
import { USER_PATH } from '@service/api/User/userApi';
import { Divider, Popover, Skeleton, Upload } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import CardAreaImportTask from './components/CardAreaImportTask';

const ImportTask = () => {
  const toast = useToast();
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [importedData, setImportedData] = useState<any>({});
  const [allValid, setAllValid] = useState(true);
  const navigate = useNavigate();
  const [editingKeys, setEditingKeys] = useState<Record<string, boolean>>({});
  const { trigger: triggerCreate, isLoading: isLoadingCreate } = useFetcher(
    TASK_PATH.CREATE_FROM_EXCEL,
    'POST'
  );
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

  const availableAreas = useMemo(
    () =>
      (dataArea || []).map((element) => ({
        value: element.name,
        label: element.name,
      })),
    [dataArea]
  );

  const availableTaskTypes = useMemo(
    () =>
      (dataTaskType || []).map((element) => ({
        value: element.name,
        label: element.name,
        role: element.roleId.id,
      })),
    [dataTaskType]
  );

  // Validation function for dates
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

  const validateTaskType = (data: any) => {
    let isValid = true;
    for (const area in data) {
      for (const taskType in data[area]) {
        for (const task of data[area][taskType]) {
          if (task.deleted) continue;
          if (task.taskType === null) {
            isValid = false;
            break;
          }
        }
        if (!isValid) break;
      }
      if (!isValid) break;
    }
    return isValid;
  };

  const validateAssignees = (data: any) => {
    let isValid = true;
    for (const area in data) {
      for (const taskType in data[area]) {
        for (const task of data[area][taskType]) {
          if (task.deleted) continue;
          if (task.assigneeId === undefined || task.assigneeId === null) {
            isValid = false;
            break;
          }
        }
        if (!isValid) break;
      }
      if (!isValid) break;
    }
    return isValid;
  };

  const hasAssignees = useMemo(
    () => validateAssignees(importedData),
    [importedData]
  );

  useEffect(() => {
    setAllValid(validateDates(importedData));
  }, [importedData]);

  const isValidTaskType = useMemo(
    () => validateTaskType(importedData),
    [importedData]
  );

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
              taskAcc[normalizedTaskType] = response[area][taskType].map(
                (task: any) => ({
                  ...task,
                  key: uuidv4(), // Sử dụng UUID làm key
                  taskType: task.taskType || null,
                })
              );
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

      if (normalizedOriginalTaskType !== newTaskType) {
        if (!newData[area][newTaskType]) {
          newData[area][newTaskType] = [];
        }

        const updatedTask = {
          ...tasks[taskIndex],
          ...updatedRow,
          key: uuidv4(), // Tạo key mới khi thay đổi taskType
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

        newData[oldArea][taskType].forEach((task: any, idx: number) => {
          const newKey = `${newArea}-${normalizedTaskType}-${task.fromDate}-${task.toDate}-${idx}`;
          newData[newArea][normalizedTaskType].push({
            ...task,
            key: newKey,
            areaName: newArea,
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

      if (!isValidTaskType) {
        toast.showError(t('Please select task types for all tasks'));
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
      const response = await triggerCreate({ body: requestBody });
      toast.showSuccess(response.message);
      navigate('../list');
    } catch {
      toast.showError(t('Validation failed'));
    }
  };

  const useGetAssignees = () => {
    const { trigger } = useFetcher('', 'GET');

    const getAssignees = async (
      taskType: string,
      area: string,
      fromDate: string,
      toDate: string
    ): Promise<{ value: number; label: string }[]> => {
      try {
        const normalizedTaskType = taskType || 'Chưa rõ loại công việc';
        let url = '';

        if (
          ['Cho bò ăn', 'Dọn chuồng bò', 'Lấy sữa bò'].includes(
            normalizedTaskType
          )
        ) {
          const areaName = availableAreas.find((a) => a.value === area)?.value;
          if (!areaName) {
            toast.showError(t('Area not found'));
            return [];
          }
          url = USER_PATH.USERS_FREE_IMPORT({
            roleId: '4',
            fromDate,
            toDate,
            areaName,
          });
        } else if (normalizedTaskType === 'Trực ca đêm') {
          url = USER_PATH.NIGHT_USERS_FREE({ fromDate, toDate });
        } else if (normalizedTaskType === 'Khám định kì') {
          url = USER_PATH.VETERINARIANS_AVAILABLE(fromDate);
        } else {
          return [];
        }

        const response = await trigger({ url });
        return response.map((user: any) => ({
          value: user.id,
          label: user.name,
        }));
      } catch {
        toast.showError(t('Failed to fetch assignees'));
        return [];
      }
    };

    return getAssignees;
  };

  const getAssignees = useGetAssignees();

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
        <Skeleton loading={isLoadingCreate || isLoadingImport}>
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
                availableAreas={availableAreas}
                availableTaskTypes={availableTaskTypes}
                editingKeys={editingKeys}
                setEditingKeys={setEditingKeys}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onRestoreTask={handleRestoreTask}
                onChangeArea={handleChangeArea}
                getAssignees={getAssignees}
              />
            ))}
          </div>

          {Object.keys(importedData).length > 0 && (
            <FloatButtonComponent.Group>
              {!(
                isUnknownAreaExist ||
                !allValid ||
                !isValidTaskType ||
                !hasAssignees
              ) ? (
                <FloatButtonComponent
                  tooltip={'Confirm'}
                  type="primary"
                  onClick={handleSubmit}
                  children={undefined}
                  icon={<CheckOutlined />}
                />
              ) : (
                <Popover
                  title={t('Error')}
                  content={
                    <div className="flex flex-col gap-2 text-base bg-white">
                      {isUnknownAreaExist && (
                        <span className="text-red-500">
                          -{' '}
                          {t(
                            'Please select area for all unknown tasks before submitting'
                          )}
                        </span>
                      )}
                      {!allValid && (
                        <span className="text-red-500">
                          -{' '}
                          {t(
                            'Some tasks have invalid dates. Dates must be from tomorrow to 6 days after'
                          )}
                        </span>
                      )}
                      {!isValidTaskType && (
                        <span className="text-red-500">
                          - {t('Some task types are not selected')}
                        </span>
                      )}
                      {!hasAssignees && (
                        <span className="text-red-500">
                          - {t('Some tasks do not have assignees selected')}
                        </span>
                      )}
                    </div>
                  }
                >
                  <FloatButtonComponent
                    type="primary"
                    children={undefined}
                    buttonType="volcano"
                    tooltip=""
                  />
                </Popover>
              )}
              <FloatButtonComponent.BackTop />
            </FloatButtonComponent.Group>
          )}
        </Skeleton>
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ImportTask;
