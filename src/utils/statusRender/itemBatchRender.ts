import { ItemBatchStatus } from '@model/Warehouse/itemBatch';

const statusColorMap: Record<ItemBatchStatus, string> = {
  available: 'green',
  inUse: 'blue',
  depleted: 'orange',
  expired: 'red',
  quarantined: 'purple',
};

// Hàm nhận status → trả màu
function statusColorMapItemBatch(status: ItemBatchStatus): string {
  return statusColorMap[status];
}

export default statusColorMapItemBatch;
