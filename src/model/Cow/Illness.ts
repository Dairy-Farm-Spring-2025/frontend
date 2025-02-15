import { UserProfileData } from '../User';
import { Cow } from './Cow';

export type IllnessCow = {
  illnessId: number;
  symptoms: string;
  severity: Severity;
  startDate: string;
  endDate: string;
  prognosis: string;
  cowEntity: Cow;
  userEntity: UserProfileData;
  veterinarian: UserProfileData;
};

export type Severity = 'mild' | 'moderate' | 'severe' | 'critical';
