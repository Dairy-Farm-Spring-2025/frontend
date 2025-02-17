import { CowStatus } from './Cow';

export type HealthRecordPayload = {
  status: 'good' | 'fair' | 'poor' | 'critical' | 'recovering';
  weight: number;
  size: number;
  period: CowStatus;
  cowId: number;
  reportTime: string;
};

export type HealthRecord = {
  status: 'good' | 'fair' | 'poor' | 'critical' | 'recovering';
  weight: number;
  size: number;
  period: CowStatus;
  healthRecordId: number;
};
