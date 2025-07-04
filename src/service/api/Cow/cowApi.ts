export const COW_PATH = {
  COWS: 'cows',
  COW_DETAIL: (id: string) => `cows/${id}`,
  COW_UPDATE: (id: string) => `cows/${id}`,
  COW_CREATE: 'cows/create',
  CREATE_BULK: 'cows/create-bulk',
  REVIEW_IMPORT_COW: 'cows/cow-from-excel',
  COW_IN_AREA: (id: string) => `cows/by_area/${id}`, 
  COW_CREATE_SINGLE: `cows/import-single`
};
