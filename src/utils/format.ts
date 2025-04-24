import dayjs from 'dayjs';
import { InjectionSite } from '../model/Vaccine/VaccineCycle/vaccineCycle';

export const formatDateHour = (data: any) => {
  const date = dayjs(data);

  // Kiểm tra xem dữ liệu có chứa giờ không
  const hasTime =
    date.hour() !== 0 || date.minute() !== 0 || date.second() !== 0;

  return hasTime
    ? date.format('DD / MM / YYYY HH:mm')
    : date.format('DD / MM / YYYY');
};

export const formatSTT = (data: any[]) => {
  return data?.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const formatFollowTime = (data: any[], dataIndex: string) => {
  if (!Array.isArray(data) || data.length === 0 || !dataIndex) return [];

  return [...data].sort((a, b) => {
    const timeA = new Date(a?.[dataIndex] ?? 0).getTime();
    const timeB = new Date(b?.[dataIndex] ?? 0).getTime();
    return timeB - timeA;
  });
};

export const formatDate = ({
  data,
  type = 'render',
}: {
  data: any;
  type: 'render' | 'params';
}) => {
  const date = dayjs(data);
  const formatted =
    type === 'render'
      ? date.format('DD / MM / YYYY')
      : date.format('YYYY-MM-DD');
  return formatted;
};

export const formatAddMilkBatch = (data: any[]) => {
  if (!Array.isArray(data)) return []; // Kiểm tra dữ liệu đầu vào
  return data.sort((a, b) => b.dailyMilkId - a.dailyMilkId);
};
export const formatAreaType = (type: string) => {
  // Thay thế các dấu gạch dưới (_) thành khoảng trắng và viết hoa chữ cái đầu mỗi từ
  return type
    ?.replace(/([A-Z])/g, ' $1') // Thêm khoảng trắng trước chữ hoa
    ?.replace(/^./, (str) => str.toUpperCase()) // Viết hoa chữ cái đầu tiên
    ?.trim(); // Loại bỏ khoảng trắng dư thừa
};

export const validateInput = (_: any, value: string) => {
  const regex = /^[A-Z]+-Pen-[0-9]+$/;

  if (!value) {
    return Promise.reject('');
  }
  if (!regex.test(value)) {
    return Promise.reject(
      'Input does not match the required format (A-Z)-Pen-(1-0), eg: ABC-Pen-123'
    );
  }
  return Promise.resolve();
};

export function formatInjectionSite(site: InjectionSite): string {
  return site
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add a space before each capital letter
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
}

export const formatToTitleCase = (value: string) => {
  if (!value) return '';

  return value
    .toLowerCase() // Convert to lowercase
    .split('_') // Split by underscore (e.g., HEALTH_RECORD)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' '); // Join words with a space
};

export const formatStatusWithCamel = (type: string) =>
  type
    ? type
        .replace(/_/g, ' ') // Chuyển snake_case -> space
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Chuyển camelCase -> space
        .replace(/\b\w/g, (c) => c.toUpperCase()) // Viết hoa từng chữ
    : '';
  
export const formatDateRangeImportTask = (dateRange: string): string => {
  const [start, end] = dateRange.split('~');

  const formatDate = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('-');
    return `${day} / ${month} / ${year}`;
  };

  return `${formatDate(start)} ~ ${formatDate(end)}`;
};
