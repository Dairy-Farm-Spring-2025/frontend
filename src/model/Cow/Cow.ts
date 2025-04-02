import { CowType } from './CowType';
import { HealthRecord } from './HealthRecord';
import { IllnessCow } from './Illness';

export type Cow = {
  cowId: string;
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
  key: any;
};

export type HealthResponse = {
  date: string;
  health: HealthRecord & IllnessCow;
  id: number;
  type: 'HEALTH_RECORD' | 'ILLNESS' | 'INJECTIONS';
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
