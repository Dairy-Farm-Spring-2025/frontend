export const NOTIFICATION_PATH = {
  MY_NOTIFICATIONS: 'notifications/myNotification',
  CREATE_NOTIFICATION: 'notifications/create',
  GET_NOTIFICATIONS: 'notifications',
  DELETE_NOTIFICATION: (id: number) => `notifications/${id}`,
};
