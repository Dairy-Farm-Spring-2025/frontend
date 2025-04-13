import api from '../../../config/axios/axios';
import CreateUser from '../../../model/User';

export const userApi = {
  getAllUser: async () => {
    try {
      const response = await api.get('users/all');
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  banUser: async (id: number) => {
    try {
      const response = await api.put(`users/ban/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  unBanUser: async (id: number) => {
    try {
      const response = await api.put(`users/unban/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
  createUser: async (body: CreateUser) => {
    try {
      const response = await api.post('users/create', body);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response.data.message);
    }
  },

  getRole: async () => {
    try {
      const response = await api.get('users/roles');
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },
};

export const USER_PATH = {
  WORKER: 'users/workers',
  CREATE_USER: 'users/create',
  VETERINARIANS: 'users/veterinarians',
  SIGN_IN: 'users/signin',
  FCM_TOKEN_UPDATE: 'users/update/fcmToken',
  VETERINARIANS_AVAILABLE: (date: string) =>
    `users/available/veterinarians?date=${date}`,
  NIGHT_USERS_FREE: ({
    fromDate,
    toDate,
  }: {
    fromDate: string;
    toDate: string;
  }) => `users/free/night?fromDate=${fromDate}&toDate=${toDate}`,
  USERS_FREE: ({
    roleId,
    fromDate,
    toDate,
    areaId,
  }: {
    roleId: string;
    fromDate: string;
    toDate: string;
    areaId?: number | string;
  }) =>
    `users/free?roleId=${roleId}&fromDate=${fromDate}&toDate=${toDate}${
      areaId ? `&areaId=${areaId}` : ''
    }`,
  USERS_FREE_IMPORT: ({
    roleId,
    fromDate,
    toDate,
    areaName,
  }: {
    roleId: string;
    fromDate: string;
    toDate: string;
    areaName?: number | string;
  }) =>
    `users/free?roleId=${roleId}&fromDate=${fromDate}&toDate=${toDate}${
      areaName ? `&areaName=${areaName}` : ''
    }`,
};
