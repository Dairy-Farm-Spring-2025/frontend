import { DailyMilkModel } from './DailyMilk';

export type MilkBatch = {
  milkBatchId: number;
  totalVolume: number;
  expiryDate: string;
  status: string;
  volume: number;
  date: string;
  dailyMilks: DailyMilkModel[];
};

export type MilkBatchStatus = 'expired' | 'inventory' | 'out_of_stock';
