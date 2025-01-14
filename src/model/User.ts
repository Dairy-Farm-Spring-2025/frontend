import { Role } from "./Role";

export type UserProfileData = {
  createdAt: string;
  updatedAt: string;
  id: number;
  name: string;
  phoneNumber: number;
  employeeNumber: number;
  email: string;
  gender: string;
  address: string;
  profilePhoto: string;
  dob: string;
  status: string;
  roleId: Role;
};
