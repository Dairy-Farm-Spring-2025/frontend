import dayjs from "dayjs";

export const formatDateHour = (data: any) => {
  return dayjs(data).format("DD-MM-YYYY");
};
