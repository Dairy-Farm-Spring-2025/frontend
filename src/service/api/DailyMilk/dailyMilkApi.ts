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
  recordDailyMilkOfCowByMonth: async (id: string, year: number) => {
    try {
      const response = await api.get(
        `dailymilks/total/${id}/month?year=${year}`
      );
      return response.data;
    } catch (error: any) {
      throw Error(error.response.data.message);
    }
  },
  recordDailyMilkCowByDate: async (id: string, date: string) => {
    try {
      const response = await api.get(`dailymilks/total/${id}/day?date=${date}`);
      return response.data;
    } catch (error: any) {
      throw Error(error.response.data.message);
    }
  },
};
