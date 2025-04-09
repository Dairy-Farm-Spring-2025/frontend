export const DASHBOARD_PATH = {
  DAILY_MILK_TOTAL_DATE: (date: any) => `dailymilks/total/day?date=${date}`,
  DAILY_MILK_TOTAL_MONTH: (year: any) => `dailymilks/total/month?year=${year}`,
  DASHBOARD_TODAY: 'dashboard/today',
};
