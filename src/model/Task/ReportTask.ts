import { Task } from './Task';

export interface ReportTaskByDate {
  reportTaskId: number;
  description: string;
  status: StatusReportTask;
  startTime: string;
  endTime: string;
  date: string;
  comment: string;
  reviewer_id: number;
  reportImages: ImageReport[];
}

export interface ReportTaskDate {
  reportTaskId: number;
  description: string;
  status: StatusReportTask;
  startTime: string;
  endTime: string;
  date: string;
  comment: string;
  reviewer_id: number;
  reportImages: ImageReport[];
  taskId: Task;
}

type ImageReport = {
  reportTaskImageId: number;
  url: string;
};

export type StatusReportTask = 'pending' | 'processing' | 'closed';
