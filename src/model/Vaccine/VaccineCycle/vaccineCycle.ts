import { Cow } from '@model/Cow/Cow';
import { Item, Unit } from '../../Warehouse/items';
import { CowType } from '@model/Cow/CowType';
import { UserProfileData } from '@model/User';

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
  dosage: number;
  injectionSite: InjectionSite;
  vaccineIngredients: string;
  vaccineType: string;
  numberPeriodic: number;
  unitPeriodic: 'days' | 'months' | 'weeks' | 'years';
  firstInjectionMonth: number;
  itemEntity: Item;
  vaccineCycleEntity: string;
};

export type VaccineCycle = {
  vaccineCycleId: number;
  name: string;
  description: string;
  cowTypeEntity: CowType;
  vaccineCycleDetails: VaccineCycleDetails[];
};
export type VaccineInjection = {
  id: string;
  cowEntity: Cow;
  cowTypeEntity: CowType;
  vaccineCycleDetail: VaccineCycleDetails;
  injectionDate: string;
  administeredBy: UserProfileData;
  status: string;
  description: string;
};
export type InjectionSite =
  | 'leftArm'
  | 'rightArm'
  | 'leftThigh'
  | 'rightThigh'
  | 'buttock'
  | 'abdomen'
  | 'other';
