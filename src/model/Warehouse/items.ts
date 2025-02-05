export type Item = {
  itemId: number;
  name: string;
  status: 'available' | 'outOfStock' | 'damaged' | 'expired' | 'reserved';
  unit:
    | 'kilogram'
    | 'gram'
    | 'liter'
    | 'milliliter'
    | 'piece'
    | 'pack'
    | 'squareMeter'
    | 'bottle'
    | 'bag'
    | 'box';
  quantity: number;
  categoryEntity: {
    categoryId: number;
    name: string;
  };
  warehouseLocationEntity: {
    warehouseLocationId: number;
    name: string;
    description: string;
  };
};

export type ItemRequestBody = {
  name: string;
  status: 'available' | 'outOfStock' | 'damaged' | 'expired' | 'reserved';
  unit:
    | 'kilogram'
    | 'gram'
    | 'liter'
    | 'milliliter'
    | 'piece'
    | 'pack'
    | 'squareMeter'
    | 'bottle'
    | 'bag'
    | 'box';
  quantity: number;
  categoryId: number;
  locationId: number;
};
