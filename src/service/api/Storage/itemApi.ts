export const ITEMS_PATH = {
  ITEMS: 'items',
  ITEMS_DELETE: (id: string) => `items/${id}`,
  ITEMS_CREATE: 'items/create',
  VIEW_ITEM_BATCHES: (itemId: number) => `itembatchs/batches/${itemId}`,
  CHECK_STOCK: (itemId: number) => `items/check-stock/${itemId}`,
};
