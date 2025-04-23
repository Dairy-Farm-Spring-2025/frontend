export const AREA_PATH = {
  AREAS: 'areas',
  AREA_DETAIL: (id: string) => `areas/${id}`,
  AREA_CREATE: 'areas/create',
  AREA_EDIT: (id: number) => `areas/${id}`,
  AREA_COW: (id: string) => `cows/byArea/${id}`,
  AREA_FEED_MEALS: (id: string) => `feedmeals/calculate/${id}`,
};
