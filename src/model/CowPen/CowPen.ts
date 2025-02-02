import { Cow } from '../Cow/Cow';
import { Pen } from '../Pen';

export type CowPen = {
  penEntity: Pen;
  cowEntity: Cow;
  fromDate: string;
  toDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
};

interface AreaBelongto {
  areaId: number;
  name: string;
  description: string;
  length: number;
  width: number;
  penLength: number | null;
  penWidth: number | null;
  areaType: string;
}

export type PenEntity = {
  penId: number;
  name: string;
  description: string;
  penType: string;
  penStatus: string;
  areaBelongto: AreaBelongto;
};

interface CowEntity {
  cowId: number;
  name: string;
  cowStatus:
    | 'milkingCow'
    | 'dryCow'
    | 'pregnantCow'
    | 'openCow'
    | 'calvingCow'
    | 'sickCow'
    | 'breedingCow'
    | 'quarantinedCow'
    | 'culling';
  dateOfBirth: string;
  dateOfEnter: string;
  dateOfOut: string | null;
  description: string;
  cowOrigin: string;
  gender: string;
  cowTypeEntity: CowTypeEntity;
}

interface CowTypeEntity {
  cowTypeId: number;
  name: string;
  description: string;
  status: string;
}

interface DataItem {
  penEntity: PenEntity;
  cowEntity: CowEntity;
  fromDate: string;
  toDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type RootData = {
  data: DataItem[];
};
