import { StatusItem, Unit } from './items';

export type ItemBatch = {
  itemBatchId: number;
  quantity: number;
  importDate: string;
  expiryDate: string;
  status: 'available' | 'inUse' | 'depleted' | 'expired' | 'quarantined';
  itemEntity: {
    itemId: number;
    name: string;
    description: string;
    status: StatusItem;
    unit: Unit;
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
  supplierEntity: {
    supplierId: number;
    name: string;
    address: string;
    phone: string;
    email: string;
  };
};

export type ItemBatchCreate = {
  quantity: number;
  expiryDate: string;
  itemId: number;
  supplierId: number;
};
