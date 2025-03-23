export const REPORT_TASK_PATH = {
  REPORT_TASK_DATE: (taskId: number, date: string) =>
    `reportTask/task/${taskId}/date?date=${date}`,
  JOIN_TASK: (taskId: number) => `reportTask/joinTask/${taskId}`,
  CREATE_REPORT: (taskId: number) => `reportTask/create/${taskId}`,
  REPORT_TASK_BY_DATE: (date: string) => `reportTask/by-date?date=${date}`,
  REVIEW_REPORT: (taskId: number) => `reportTask/review/${taskId}`,
};
