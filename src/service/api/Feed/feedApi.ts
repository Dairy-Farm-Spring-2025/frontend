import { CowStatus } from '@model/Cow/Cow';

export const FEED_PATH = {
  FEED_MEALS: 'feedmeals',
  DELETE_FEED_MEALS: (id: string) => `feedmeals/${id}`,
  DETAIL_FEED_MEALS: (id: string) => `feedmeals/${id}`,
  FEED_MEAL_DRY_MATTER: 'feedmeals/drymatter',
  CREATE_FEED_MEALS: 'feedmeals',
  ADD_DETAIL: (feedMealId: string) => `feedmeals/addDetail/${feedMealId}`,
  DELETE_DETAIL: (feedMealId: string) => `feedmeals/detail/${feedMealId}`,
  CHECK_EXISTS: (cowTypeId: number, cowStatus: CowStatus) =>
    `feedmeals/check-exists?cowTypeId=${cowTypeId}&cowStatus=${cowStatus}`,
};
