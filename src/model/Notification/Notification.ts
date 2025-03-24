import { UserProfileData } from '@model/User';

export type Notification = {
  notificationId: number;
  title: string;
  description: string;
  link: string;
  category: CategoryNotification;
  userNotifications: UserNotification[];
};

export type MyNotification = {
  id: UserId;
  notification: Notification;
  read: boolean;
  user: UserProfileData;
};

type UserId = {
  userId: number;
  notificationId: number;
};

export type UserNotification = {
  id: UserId;
  user: UserProfileData;
  read: true;
};

export type CategoryNotification =
  | 'milking'
  | 'feeding'
  | 'heathcare'
  | 'task'
  | 'other';
