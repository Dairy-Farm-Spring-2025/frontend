import { CowType } from './CowType';
import { HealthRecord } from './HealthRecord';
import { IllnessCow } from './Illness';

export type Cow = {
  cowId: number;
  name: string;
  cowStatus: CowStatus;
  dateOfBirth: string;
  dateOfEnter: string;
  dateOfOut: string;
  description: string;
  cowOrigin: string;
  gender: 'male' | 'female';
  cowType: CowType;
  cowTypeEntity: CowType;
  createdAt: string;
  updatedAt: string;
  inPen: boolean;
  healthInfoResponses: HealthResponse[];
  penResponse: any;
};

export type HealthResponse = {
  date: string;
  health: HealthRecord & IllnessCow;
  id: number;
  type: 'HEALTH_RECORD' | 'ILLNESS';
};

export type CowStatus =
  | 'milkingCow'
  | 'dryCow'
  | 'pregnantCow'
  | 'openCow'
  | 'calvingCow'
  | 'sickCow'
  | 'breedingCow'
  | 'quarantinedCow'
  | 'culling';
