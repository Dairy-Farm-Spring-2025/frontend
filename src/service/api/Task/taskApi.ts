export const TASK_PATH = {
  TASK_DATE_RANGE: 'tasks/myTasks/by-date-range',
  TASK_MANAGER_DATE_RANGE: 'tasks/by-date-range',
  TASKS_TYPE: 'task_types',
  TASK_DETAIL: (taskId: number) => `tasks/${taskId}`,
  TASK_UPDATE: (taskId: number) => `tasks/update/${taskId}`,
  TASK_REASSIGN: (taskId: number, assigneeId: number) =>
    `tasks/${taskId}/assign/${assigneeId}`,
  DOWNLOAD_TEMPLATE: 'tasks/download-template',
  GET_IMPORT_FILES: 'tasks/import-tasks',
  CREATE_FROM_EXCEL: 'tasks/create-from-excel',
};
