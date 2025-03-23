export type MilkBatch = {
  milkBatchId: number;
  totalVolume: number;
  expiryDate: string;
  status: string;
  volume: number;
};

export type MilkBatchStatus = 'expired' | 'inventory' | 'out_of_stock';
