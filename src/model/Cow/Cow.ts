import { CowType } from './CowType';
import { HealthRecord, Injections } from './HealthRecord';
import { IllnessCow } from './Illness';

export type Cow = {
  cowId: number;
  name: string;
  cowStatus: CowStatus;
  cowType: CowType;
  dateOfBirth: string;
  dateOfEnter: string | null;
  dateOfOut: string | null;
  description: string;
  gender: 'male' | 'female';
  cowOrigin: string;
  healthInfoResponses: HealthResponse[];
  cowTypeName?: string;
  cowTypeEntity?: any;
  errorStrings?: string[];
  createdAt: string;
  updatedAt: string;
  inPen: boolean;
  penResponse: any;
  key: string;

};

export type HealthResponse = {
  date: string;
  health: HealthRecord & IllnessCow & Injections;
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
