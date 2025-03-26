export const NOTIFICATION_PATH = {
  MY_NOTIFICATIONS: 'notifications/myNotification',
  CREATE_NOTIFICATION: 'notifications/create',
  GET_NOTIFICATIONS: 'notifications',
  DELETE_NOTIFICATION: (id: number) => `notifications/${id}`,
  MARK_AS_READ: (id: number, userId: number) =>
    `notifications/${id}/mark-read/${userId}`,
};
