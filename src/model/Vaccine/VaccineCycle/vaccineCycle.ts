import { StatusItem, Unit } from '../../Warehouse/items';

export type VaccineCyclePayload = {
  name: string;
  description: string;
  cowTypeId: number;
  details: [
    {
      name: string;
      vaccineIngredients: string;
      vaccineType: string;
      description: string;
      numberPeriodic: number;
      unitPeriodic: string;
      dosageUnit: Unit;
      dosage: number;
      injectionSite: InjectionSite;
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
  vaccineIngredients: string;
  vaccineType: string;
  numberPeriodic: number;
  unitPeriodic: string;
  firstInjectionMonth: number;
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
      type: string;
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
