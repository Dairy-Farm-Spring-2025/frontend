import { CategoryNotification } from '@model/Notification/Notification';

export const getCategoryNotificationColor = (
  category: CategoryNotification
): string => {
  const colors: Record<CategoryNotification, string> = {
    milking: 'green', // Green
    feeding: 'orange', // Orange
    healthcare: 'red', // Red
    task: 'blue', // Blue
    other: '', // Gray
  };

  return colors[category] || '#000000'; // Default to black if undefined
};
