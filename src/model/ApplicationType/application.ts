import { UserProfileData } from '../User';
import { ApplicationType } from './applicationType';

export type Application = {
  title: string;
  content: string;
  status: ApplicationStatus;
  commentApprove: string;
  requestDate: Date;
  approveDate: Date;
  fromDate: Date;
  toDate: Date;
  type: ApplicationType;
  approveBy: UserProfileData;
  requestBy: UserProfileData;
};

export type ApplicationStatus = 'processing' | 'complete' | 'cancel' | 'reject';
