import dayjs from "dayjs";

export const formatDateHour = (data: any) => {
  return dayjs(data).format("YYYY-MM-DD");
};

export const formatSTT = (data: any[]) => {
  return data.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};
