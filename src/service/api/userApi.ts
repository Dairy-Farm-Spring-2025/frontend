import api from "../../config/axios/axios";


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


    getRole: async () => {
        try {
            const response = await api.get('users/roles')
            return response.data
        } catch (error: any) {
            throw error.response.data
        }
    },
}



