import { TaskType } from '@model/Task/task-type';
import { EquipmentType } from '@model/Warehouse/equipment';

export type UseEquipmentType = {
  id: UseEquipmentTypeId;
  equipment: EquipmentType;
  taskType: TaskType;
  requiredQuantity: number;
  note: string;
};
export type UseEquipmentTypeId = {
  equipmentId: number;
  taskTypeId: number;
};
