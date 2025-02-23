export type CowTypeRequest = {
  name: string;
  description: string;
  status: 'exist' | 'notExist';
  maxWeight: 0;
};

export type CowType = {
  cowTypeId: number;
  name: string;
  description: string;
  status: 'exist' | 'notExist';
  createdAt: string;
  updatedAt: string;
  maxWeight: number;
};
