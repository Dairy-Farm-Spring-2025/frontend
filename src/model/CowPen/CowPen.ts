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
