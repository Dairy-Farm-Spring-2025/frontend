import { WarehouseType } from "./warehouse";

export type EquipmentType = {
    equipmentId: string;
    name: string;
    type: string;
    status: string;
    description: string;
    quantity: number;
    warehouseLocationEntity: WarehouseType
};
