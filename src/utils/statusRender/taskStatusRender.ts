import { Priority } from '@model/Task/Task';

export const priorityColors: Record<Priority, string> = {
  low: 'green',
  medium: 'yellow',
  high: 'red',
  critical: 'darkred',
};

export const statusColors: Record<any, string> = {
  pending: '#FEF9C3', // Light Yellow
  inProgress: '#DBEAFE', // Light Blue
  completed: '#D1FAE5', // Light Green
  reviewed: '#E9D5FF', // Light Purple
  processing: '#DBEAFE',
  closed: '#D1FAE5',
  misssing: '#FFAFAF',
};

export const statusTaskBorder: Record<any, string> = {
  pending: '#FACC15', // Vàng đậm hơn
  inProgress: '#3B82F6', // Xanh dương đậm
  completed: '#10B981', // Xanh lá đậm
  reviewed: '#A855F7', // Tím đậm
  processing: '#2563EB', // Xanh dương trung bình
  closed: '#059669', // Xanh lá trung bình
  misssing: '#E53935',
};
