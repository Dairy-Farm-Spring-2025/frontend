export const HEALTH_RECORD_PATH = {
  //HEALTH_RECORD
  UPDATE_HEALTH_RECORD: (id: string) => `health-record/${id}`,
  CREATE_HEALTH_RECORD: 'health-record',
  //ILLNESS
  UPDATE_ILLNESS: (id: string) => `illness/prognosis/${id}`,
  DELETE_ILLNESS: (id: string) => `illness/${id}`,
  ILLNESS: 'illness',
  CREATE_ILLNESS: 'illness/create',
  CREATE_PLAN: 'illness-detail/create-plan',
  DETAIL_ILLNESS: (id: string) => `illness/${id}`,
  ILLNESS_DETAIL: (id: string) => `illness-detail/${id}`
};
