import { AreaType } from '@model/Area/AreaType';

export const minDimensions: Record<
  AreaType,
  { length: number; width: number }
> = {
  cowHousing: { length: 20, width: 10 },
  quarantine: { length: 20, width: 10 },
};
