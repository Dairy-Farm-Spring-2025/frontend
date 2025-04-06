import { Cow, CowStatus } from './Cow';
import { CowType } from './CowType';


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
  cowEntity: Cow;
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
    cowTypeEntity: {
      cowTypeId: number;
      name: string;
      description: string;
      maxWeight: number;
      status: string;
    };
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
}
