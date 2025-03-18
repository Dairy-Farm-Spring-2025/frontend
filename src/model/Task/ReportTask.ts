export interface ReportTaskByDate {
  reportTaskId: number;
  description: string;
  status: 'pending' | 'processing' | 'closed';
  startTime: string;
  endTime: string;
  date: string;
  comment: string;
  reviewer_id: number;
  reportImages: string[];
}
