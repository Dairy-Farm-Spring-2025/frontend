import { Role } from "@model/Role";


export type TaskType = {
    taskId: string;
    name: string;
    roleId: Role;
    description: string;

};
