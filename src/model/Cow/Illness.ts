import { UserProfileData } from '../User';
import { Cow } from './Cow';
import { IllnessDetail } from './IllnessDetail';

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
  illnessDetails: IllnessDetail[];
  illnessStatus: 'pending' | 'processing' | 'complete' | 'cancel' | 'fail';
  mediaList: {
    illnessImageId: number;
    url: string;
  }[];
};

export type Severity = 'mild' | 'moderate' | 'severe' | 'critical' | 'none';
