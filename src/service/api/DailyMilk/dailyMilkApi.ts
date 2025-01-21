import api from '../../../config/axios/axios';

export const dailyMilkApi = {
  searchDailyMilk: async (areaId: string, shift: string) => {
    try {
      const response = await api.get(`dailymilks/search`, {
        params: {
          areaId: areaId,
          shift: shift,
        },
      });
      return response.data;
    } catch (error: any) {
      throw Error(error.response.data.message);
    }
  },
};
