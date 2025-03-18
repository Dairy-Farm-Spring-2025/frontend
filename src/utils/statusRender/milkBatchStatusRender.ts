import { MilkBatchStatus } from '@model/DailyMilk/MilkBatch';

const MILK_BATCH_STATUS_COLORS: Record<MilkBatchStatus, string> = {
  expired: 'red', // Hết hạn - đỏ
  inventory: 'green', // Còn trong kho - xanh lá
  out_of_stock: 'volcano', // Hết hàng - cam
};

// Hàm trả về màu của status
export const getMilkBatchStatusColor = (status: MilkBatchStatus): string =>
  MILK_BATCH_STATUS_COLORS[status] || 'default';
