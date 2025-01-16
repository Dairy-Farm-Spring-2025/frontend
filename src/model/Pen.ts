import { Area } from "./Area";

export type Pen = {
    penId: string;
    name: string;
    description: string;
    penType: 'calfPen' | 'heiferPen' | 'dryCowPen' | 'lactatingCowPen' | 'maternityPen' | 'isolationPen' | 'holdingPen';
    length: number;
    width: number;
    penStatus: 'occupied' | 'empty' | 'reserved' | 'underMaintenance' | 'decommissioned';
    areaId: number
    area: Area
}

