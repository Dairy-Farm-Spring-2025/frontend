import { CowType } from "./CowType";

export type Cow = {
  cowId: number;
  name: string;
  cowStatus:
    | "milkingCow"
    | "dryCow"
    | "pregnantCow"
    | "openCow"
    | "calvingCow"
    | "sickCow"
    | "breedingCow"
    | "quarantinedCow"
    | "culling";
  dateOfBirth: string;
  dateOfEnter: string;
  dateOfOut: string;
  description: string;
  cowOrigin: string;
  gender: "male" | "female";
  cowType: CowType;
  cowTypeEntity: CowType;
  createdAt: string;
  updatedAt: string;
};
