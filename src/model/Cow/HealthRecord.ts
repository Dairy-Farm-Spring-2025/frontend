import { Cow, CowStatus } from './Cow';
import { CowType } from './CowType';

export type HealthRecordPayload = {
  bodyTemperature: number;
  heartRate: number;
  respiratoryRate: number;
  ruminateActivity: number;
  size: number;
  description: string | null;
  period: CowStatus;
  chestCircumference: number;
  bodyLength: number;
  cowId: number;
  status: 'good' | 'fair' | 'poor' | 'critical' | 'recovering';
};

export type HealthRecord = {
  status: 'good' | 'fair' | 'poor' | 'critical' | 'recovering';
  healthRecordId: number;
  bodyTemperature: number;
  heartRate: number;
  respiratoryRate: number;
  ruminateActivity: number;
  weight: number;
  size: number;
  description: string | null;
  reportTime: string; // ISO date string
  period: CowStatus;
  cowEntity: Cow;
  chestCircumference: number;
  bodyLength: number;

};

export type Injections = {
  id: number;
  cowEntity: {
    cowId: number;
    name: string;
    cowStatus: string;
    dateOfBirth: string;
    dateOfEnter: string;
    dateOfOut: string | null;
    description: string;
    cowOrigin: string;
    gender: string;
    cowTypeEntity: CowType;
  };
  vaccineCycleDetail: {
    vaccineCycleDetailId: number;
    name: string;
    description: string;
    dosageUnit: string;
    dosage: number;
    injectionSite: string;
    itemEntity: {
      itemId: number;
      name: string;
      quantity: number;
      unit: string;
      categoryEntity: {
        categoryId: number;
        name: string;
      };
    };
  };
  injectionDate: string;
  administeredBy: {
    id: number;
    name: string;
    employeeNumber: string;
    email: string;
    roleId: {
      id: number;
      name: string;
    };
  };
  status: string | null;
};
