import { Area } from '@model/Area';
import { StatusIllnessDetail } from '@model/Cow/IllnessDetail';
import { UserProfileData } from '@model/User';
import { InjectionSite } from '@model/Vaccine/VaccineCycle/vaccineCycle';
import { VaccineInjection } from '@model/Vaccine/VaccineCycle/VaccineInjection';
import { Item } from '@model/Warehouse/items';
import { ReportTaskByDate } from './ReportTask';
import { TaskType } from './task-type';

export interface TaskPayload {
  description: string;
  fromDate: string;
  toDate: string;
  areaId: number;
  assigneeIds: number[];
  taskTypeId: number;
  shift: ShiftTask;
  illnessId: number;
}

export interface TaskValuesPayload {
  description: string;
  fromDate: string;
  toDate: string;
  areaId: number;
  assigneeIds: number[];
  priority: Priority;
  taskTypeId: number;
  shift: ShiftTask;
  illnessId: number;
  workDate: string;
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
  illness?: TaskIllness;
  vaccineInjection?: VaccineInjection;
}

export interface TaskIllness {
  date: string;
  description: string;
  dosage: number;
  illnessDetailId: number;
  injectionSite: InjectionSite;
  status: StatusIllnessDetail;
  vaccine: Item;
  veterinarian: UserProfileData;
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
