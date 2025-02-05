import { Cow } from '../Cow/Cow';
import { UserProfileData } from '../User';
import { MilkBatch } from './MilkBatch';

export type DailyMilkModel = {
  dailyMilkId: number;
  shift: 'shiftOne' | 'shiftTwo' | 'shiftThree' | 'shiftFour';
  milkDate: string;
  milkBatch: MilkBatch;
  volume: number;
  worker: UserProfileData;
  cow: Cow;
};
