import { UserProfileData } from '../User';
import { Item } from '../Warehouse/items';

export type IllnessDetail = {
  illnessDetailId: number;
  date: string;
  description: string;
  status: StatusIllnessDetail;
  veterinarian: UserProfileData;
  vaccine: Item;
};

export type StatusIllnessDetail =
  | 'observed'
  | 'treated'
  | 'cured'
  | 'ongoing'
  | 'deceased';
