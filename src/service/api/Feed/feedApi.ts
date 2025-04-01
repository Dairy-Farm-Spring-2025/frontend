export const FEED_PATH = {
  FEED_MEALS: 'feedmeals',
  DELETE_FEED_MEALS: (id: string) => `feedmeals/${id}`,
  DETAIL_FEED_MEALS: (id: string) => `feedmeals/${id}`,
  FEED_MEAL_DRY_MATTER: 'feedmeals/drymatter',
  CREATE_FEED_MEALS: 'feedmeals',
  ADD_DETAIL: (feedMealId: string) => `feedmeals/addDetail/${feedMealId}`
};
