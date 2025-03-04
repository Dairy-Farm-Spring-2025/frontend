export type Area = {
  name: string;
  description: string;
  length: number;
  width: number;
  penLength: number;
  penWidth: number;
  areaType: 'cowHousing' | 'milkingParlor' | 'wareHouse';
  areaId: number;
  occupiedPens: number;
  emptyPens: number;
  damagedPens: number;
};
