import { StatusItem, Unit } from '../../Warehouse/items';

export type VaccineCyclePayload = {
  name: string;
  description: string;
  cowTypeId: number;
  details: [
    {
      name: string;
      description: string;
      dosageUnit: Unit;
      dosage: number;
      injectionSite: InjectionSite;
      ageInMonths: number;
      itemId: number;
    }
  ];
};

export type VaccineCycleDetails = {
  vaccineCycleDetailId: number;
  name: string;
  description: string;
  dosageUnit: Unit;
  dosage: 0;
  injectionSite: InjectionSite;
  ageInMonths: 0;
  itemEntity: {
    itemId: 0;
    name: string;
    description: string;
    status: StatusItem;
    unit: Unit;
    quantity: number;
    categoryEntity: {
      categoryId: number;
      name: string;
    };
    warehouseLocationEntity: {
      warehouseLocationId: number;
      name: string;
      description: string;
    };
  };
  vaccineCycleEntity: string;
};

export type VaccineCycle = {
  vaccineCycleId: number;
  name: string;
  description: string;
  cowTypeEntity: {
    cowTypeId: number;
    name: string;
    description: string;
    status: 'exist' | 'notExist';
  };
  vaccineCycleDetails: VaccineCycleDetails[];
};

export type InjectionSite =
  | 'leftArm'
  | 'rightArm'
  | 'leftThigh'
  | 'rightThigh'
  | 'buttock'
  | 'abdomen'
  | 'other';
