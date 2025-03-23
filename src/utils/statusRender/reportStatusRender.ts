import { StatusReportTask } from '@model/Task/ReportTask';

const STATUS_COLORS: Record<StatusReportTask, string> = {
  pending: 'gold', // Màu vàng - chờ xử lý
  processing: 'blue', // Màu xanh - đang xử lý
  closed: 'green', // Màu xanh lá - đã đóng
};

export const getReportTaskStatusColor = (status: StatusReportTask): string =>
  STATUS_COLORS[status] || 'default';
