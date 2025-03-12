export const APPLICATION_PATH = {
  APPLICATION_MY_REQUEST: 'application/my-request',
  APPLICATION_DETAIL: (id: string) => `application/${id}`,
  APPLICATION_REQUEST: 'application/request',
  APPLICATION: 'application',
  APPLICATION_APPROVE: (id: string) => `application/approval-request/${id}`,
};
