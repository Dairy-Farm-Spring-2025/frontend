import { Role } from "@model/Role";


export type TaskType = {
    taskTypeId: string;
    name: string;
    roleId: Role;
    description: string;

};
