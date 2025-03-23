import { StatusItem } from '@model/Warehouse/items';

const STATUS_COLORS: Record<StatusItem, string> = {
  available: 'green', // Hàng có sẵn - xanh lá
  outOfStock: 'red', // Hết hàng - đỏ
  damaged: 'volcano', // Hư hỏng - cam
  expired: 'gray', // Hết hạn - xám
  reserved: 'gold', // Đã đặt trước - vàng
};

export const getItemStatusColor = (status: StatusItem): string =>
  STATUS_COLORS[status] || 'default';
