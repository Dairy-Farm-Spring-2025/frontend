import { StatusReportTask } from '@model/Task/ReportTask';

const STATUS_COLORS: Record<StatusReportTask, string> = {
  pending: 'blue', // Màu vàng - chờ xử lý
  processing: 'gold', // Màu xanh - đang xử lý
  closed: 'green', // Màu xanh lá - đã đóng
  missing: 'red',
};

export const getReportTaskStatusColor = (status: StatusReportTask): string =>
  STATUS_COLORS[status] || 'default';
