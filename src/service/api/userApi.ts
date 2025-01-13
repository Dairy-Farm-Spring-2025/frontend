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

    setRoleAccount: async (id: number, data: any) => {
        try {
            const response = await api.put(`account/${id}`, data);
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

export const staffApi = {
    getAccount: async () => {
        try {
            const response = await api.get('account/staffs')
            return response.data
        } catch (error: any) {
            throw error.response.data
        }
    },
    addStaff: async (data: any) => {
        try {
            const response = await api.post('account/users/staff', data)
            return response.data
        } catch (error: any) {
            throw error.response.data
        }
    }
}

export const managerApi = {

    getAccount: async () => {
        try {
            const response = await api.get('account/managers')
            return response.data
        } catch (error: any) {
            throw error.response.data
        }
    }
}

