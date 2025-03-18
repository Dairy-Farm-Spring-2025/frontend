import { EquipmentStatus } from '@model/Warehouse/equipment';

const EQUIPMENT_STATUS_COLORS: Record<EquipmentStatus, string> = {
  available: 'green', // Có sẵn
  repairing: 'orange', // Đang sửa chữa
  broken: 'red', // Hỏng
  using: 'blue', // Đang sử dụng
};

export const getEquipmentStatusTag = (status: EquipmentStatus) => {
  return EQUIPMENT_STATUS_COLORS[status] || 'default';
};
