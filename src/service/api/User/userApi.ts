import api from "../../../config/axios/axios";
import CreateUser from "../../../model/User"

export const userApi = {
    getAllUser: async () => {
        try {
            const response = await api.get('users/all')
            return response.data
        } catch (error: any) {
            throw error.response.data
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
            const response = await api.post("users/create", body);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response.data.message);
        }
    },

    getRole: async () => {
        try {
            const response = await api.get('users/roles')
            return response.data
        } catch (error: any) {
            throw error.response.data
        }
    },
}


