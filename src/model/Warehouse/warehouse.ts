export type WarehouseType = {
  warehouseLocationId: number;
  name: string;
  description: string;
  type: WarehouseTypeName;
};

export type WarehouseTypeName = 'equipment' | 'food' | 'vaccine';
