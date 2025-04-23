export interface CowTypeCount {
  [cowType: string]: number;
}

export interface FoodItem {
  name: string;
  itemId: number;
  unit: string;
  quantityNeeded: number;
}

export interface FeedPlan {
  totalCow: number;
  cowTypeCount: CowTypeCount;
  foodList: FoodItem[];
}
