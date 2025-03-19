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
};
