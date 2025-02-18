import { CowType } from "../Cow/CowType";

export type FeedType = {
    feedMealId: number;
    name: string;
    description: string;
    cowTypeEntity: CowType
};
