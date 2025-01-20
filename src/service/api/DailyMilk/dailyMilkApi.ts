import api from '../../../config/axios/axios';

export const dailyMilkApi = {
  searchDailyMilk: async (areaId: string) => {
    try {
      const response = await api.get(`dailymilks/search?areaId=${areaId}`);
      return response.data;
    } catch (error: any) {
      throw Error(error.response.data.message);
    }
  },
};
