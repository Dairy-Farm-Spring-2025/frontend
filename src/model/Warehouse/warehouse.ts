export type WarehouseType = {
  warehouseLocationId: number;
  name: string;
  description: string;
  type: 'milk' | 'equipment' | 'food' | 'vaccine';
};
