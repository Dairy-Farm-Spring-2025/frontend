import { CowStatus } from '../Cow/Cow';
import { CowType } from '../Cow/CowType';
import { Item } from '../Warehouse/items';

export type FeedType = {
  feedMealId: number;
  name: string;
  description: string;
  cowTypeEntity: CowType;
};

export type FeedMeals = {
  feedMealId: number;
  name: string;
  description: string;
  cowTypeEntity: CowType;
  cowStatus: CowStatus;
  status: FeedMealsStatus;
  feedMealDetails: FeedMealDetails[];
  shift: string;
};

export type FeedMealDetails = {
  feedMealDetailId: number;
  quantity: number;
  itemEntity: Item;
};

export type FeedMealsStatus = 'inUse' | 'noUser';
