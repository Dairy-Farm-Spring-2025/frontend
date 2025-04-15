import { EquipmentTypeStatus } from '@model/Warehouse/equipment';

export const equipmentTaskMap: Record<EquipmentTypeStatus, string> = {
  milking: 'Lấy sữa bò',
  feeding: 'Cho bò ăn',
  cleaning: 'Dọn chuồng bò',
  heathcare: '', // sẽ xử lý đặc biệt vì có 2 task
  housing: '',
  energy: '',
};
