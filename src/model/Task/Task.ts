import { Area } from '@model/Area';
import { TaskType } from './task-type';
import { UserProfileData } from '@model/User';
import { ReportTaskByDate } from './ReportTask';
import { IllnessCow } from '@model/Cow/Illness';
import { VaccineInjection } from '@model/Vaccine/VaccineCycle/VaccineInjection';

export interface TaskPayload {
  description: string;
  fromDate: string;
  toDate: string;
  areaId: number;
  assigneeIds: number[];
  priority: Priority;
  taskTypeId: number;
  shift: ShiftTask;
  illnessId: number;
}

export interface Task {
  taskId: number;
  description: string;
  status: StatusTask;
  fromDate: string;
  toDate: string;
  areaId: Area;
  taskTypeId: TaskType;
  assigner: UserProfileData;
  assignee: UserProfileData;
  priority: Priority;
  shift: 'dayShift' | 'nightShift';
  completionNotes: string;
  illness?: IllnessCow;
  vaccineInjection?: VaccineInjection;
}

export interface TaskDateRange {
  taskId: number;
  description: string;
  status: StatusTask;
  fromDate: string;
  toDate: string;
  areaName: string; // Changed from areaId: Area
  taskTypeId: TaskType; // Changed from taskTypeId: TaskType
  assignerName: string; // Changed from assigner: UserProfileData
  assigneeName: string; // Changed from assignee: UserProfileData
  priority: Priority;
  shift: ShiftTask;
  completionNotes: string | null;
  reportTask: ReportTaskByDate;
}

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type ShiftTask = 'dayShift' | 'nightShift';
export type StatusTask = 'pending' | 'inProgress' | 'completed' | 'reviewed';
