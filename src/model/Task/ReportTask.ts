import { UserProfileData } from '@model/User';
import { Task } from './Task';

export interface ReportTaskByDate {
  reportTaskId: number;
  description: string;
  status: StatusReportTask;
  startTime: string;
  endTime: string;
  date: string;
  comment: string;
  reviewer_id: UserProfileData;
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
  reviewer_id: UserProfileData;
  reportImages: ImageReport[];
  taskId: Task;
}

export interface ReportTaskDashboard {
  description: string;
  endTime: string;
  reportTaskId: number;
  startTime: string;
  status: StatusReportTask;
}

type ImageReport = {
  reportTaskImageId: number;
  url: string;
};

export type StatusReportTask = 'pending' | 'processing' | 'closed' | 'misssing';
