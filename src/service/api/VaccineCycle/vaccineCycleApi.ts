export const VACCINE_CYCLE_PATH = {
  GET_ALL_VACCINE_CYCLE: 'vaccinecycles',
  DELETE_VACCINE_CYCLE: (id: number) => `vaccinecycles/${id}`,
  CREATE_VACCINE_CYCLE: 'vaccinecycles/create',
  GET_VACCINE_CYCLE: (id: number) => `vaccinecycles/${id}`,
  UPDATE_VACCINE_CYCLE: (id: number) => `vaccinecycles/${id}`,
  GET_VACCINE_CYCLE_DETAIL: (id: number) => `vaccine-cycle-details/${id}`,
  CREATE_VACCINE_CYCLE_DETAIL: 'vaccine-cycle-details',
  UPDATE_VACCINE_CYCLE_DETAIL: (id: number) => `vaccine-cycle-details/${id}`,
  DELETE_VACCINE_CYCLE_DETAIL: (id: number) => `vaccine-cycle-details/${id}`,
  CHECK_EXISTS: (cowTypeId: number) =>
    `vaccinecycles/check-exists?cowTypeId=${cowTypeId}`,
};
