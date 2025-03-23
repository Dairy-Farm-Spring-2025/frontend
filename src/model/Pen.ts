import { Area } from './Area';

export type Pen = {
  penId: string;
  name: string;
  description: string;
  penType:
    | 'calfPen'
    | 'heiferPen'
    | 'dryCowPen'
    | 'lactatingCowPen'
    | 'maternityPen'
    | 'isolationPen'
    | 'holdingPen';
  length: number;
  width: number;
  penStatus: PenStatus;
  areaId: number;
  areaBelongto: Area;
  area: Area;
};

export type PenStatus =
  | 'occupied'
  | 'empty'
  | 'reserved'
  | 'underMaintenance'
  | 'decommissioned'
  | 'inPlaning';
