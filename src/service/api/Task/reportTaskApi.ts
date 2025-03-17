export const REPORT_TASK_PATH = {
  REPORT_TASK_DATE: (taskId: number, date: string) =>
    `reportTask/task/${taskId}/date?date=${date}`,
  JOIN_TASK: (taskId: number) => `reportTask/joinTask/${taskId}`,
};
