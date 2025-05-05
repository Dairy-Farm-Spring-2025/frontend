export const STORAGE_PATH = {
  STORAGES: 'warehouses',
  STORAGE_DELETE: (id: string) => `warehouses/${id}`,
  STORAGE_CREATE: 'warehouses/create',
  UPDATE_STORAGE: (id: string) => `warehouses/${id}`,
  STORAGE_DETAIL: (id: string) => `warehouses/${id}`,
  ITEMS_STORAGE: (id: string) => `items/location/${id}`,
  EQUIPMENT_STORAGE: (id: string) => `equipment/location/${id}`,
};
