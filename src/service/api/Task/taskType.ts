export const TASK_TYPE_PATH = {
  CREATE_TASK_TYPE: 'task_types/create',
  DELETE_TASK_TYPE: (id: string) => `task_types/${id}`,
  GET_ALL_TASKTYPES: 'task_types',
  USE_EQUIPMENTS: 'use-equipments',
  CREATE_USE_EQUIPMENT: 'use-equipments',
  DELETE_USE_EQUIPMENT: (id: number, taskTypeId: number) =>
    `use-equipments/${id}/${taskTypeId}`,
  DETAIL_USE_EQUIPMENT: (equipmentId: number, taskTypeId: number) =>
    `use-equipments/${equipmentId}/${taskTypeId}`,
  UPDATE_USE_EQUIPMENT: (equipmentId: number, taskTypeId: number) =>
    `use-equipments/${equipmentId}/${taskTypeId}`,
};
