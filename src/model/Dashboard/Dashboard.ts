import { Application } from '@model/ApplicationType/application';
import { ReportTaskByDate } from '@model/Task/ReportTask';

export type DashboardTodayType = {
  dailyTasks: number;
  processingApplications: Application[];
  processingApplicationsCount: number;
  tasksByIllness: any;
  tasksByIllnessDetail: any;
  tasksByVaccineInjection: any;
  todayReports: ReportTaskByDate[];
  totalMilkToday: number;
  usedItemsToday: any;
  totalCow: number;
  cowStatsByType: CowStatByType[];
};

export type CowStatByType = {
  cowTypeName: string;
  total: number;
  statusCount: any[];
};
