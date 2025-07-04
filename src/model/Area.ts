export type Area = {
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  length: number;
  width: number;
  penLength: number;
  penWidth: number;
  areaType: 'cowHousing' | 'quarantine';
  numberInRow: number;
  maxPen: number;
  areaId: number;
  occupiedPens: number;
  emptyPens: number;
  damagedPens: number;
  cowStatus: string;
  cowTypeId: string;
  cowTypeEntity: {
    cowTypeId: string;
    name: string;
    description?: string;
  };
};
