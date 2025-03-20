import { Cow } from '@model/Cow/Cow';
import { VaccineCycleDetails } from './vaccineCycle';
import { UserProfileData } from '@model/User';

export interface VaccineInjection {
  id: number;
  cowEntity: Cow;
  vaccineCycleDetail: VaccineCycleDetails;
  injectionDate: string;
  administeredBy: UserProfileData;
}
