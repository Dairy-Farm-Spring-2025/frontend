import { WarehouseType } from './warehouse';

export type EquipmentType = {
  equipmentId: string;
  name: string;
  type: EquipmentTypeStatus;
  status: EquipmentStatus;
  description: string;
  quantity: number;
  warehouseLocationEntity: WarehouseType;
};

export type EquipmentStatus = 'available' | 'repairing' | 'broken' | 'using';
export type EquipmentTypeStatus =
  | 'milking'
  | 'feeding'
  | 'cleaning'
  | 'housing'
  | 'heathcare'
  | 'energy';
