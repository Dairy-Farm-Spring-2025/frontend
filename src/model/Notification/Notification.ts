import { UserProfileData } from '@model/User';

export type Notification = {
  notificationId: number;
  title: string;
  description: string;
  link: string;
  category: CategoryNotification;
  userNotifications: UserNotification[];
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
  | 'healthcare'
  | 'task'
  | 'other';
