import { Role } from '@model/Role';
import { UseEquipmentType } from '@model/UseEquipment/UseEquipment';

export type TaskType = {
  taskTypeId: string;
  name: string;
  roleId: Role;
  description: string;
  useEquipments: UseEquipmentType[];
};
