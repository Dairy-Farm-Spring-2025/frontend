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
  reportImages: string[];
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
  reportImages: string[];
  taskId: Task;
}

export type StatusReportTask = 'pending' | 'processing' | 'closed';
