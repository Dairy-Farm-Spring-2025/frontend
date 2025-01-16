import dayjs from "dayjs";

export const formatDateHour = (data: any) => {
  return dayjs(data).format("YYYY-MM-DD");
};

export const formatSTT = (data: any[]) => {
  return data.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};
export const formatAreaType = (type: string) => {
  // Thay thế các dấu gạch dưới (_) thành khoảng trắng và viết hoa chữ cái đầu mỗi từ
  return type
    .replace(/([A-Z])/g, ' $1')  // Thêm khoảng trắng trước chữ hoa
    .replace(/^./, (str) => str.toUpperCase()) // Viết hoa chữ cái đầu tiên
    .trim();  // Loại bỏ khoảng trắng dư thừa
};