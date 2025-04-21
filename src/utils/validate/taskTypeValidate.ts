export const validateTaskType = (name: string) => {
  const validateTaskTypeName = [
    'Cho bò ăn',
    'Dọn chuồng bò',
    'Trực ca đêm',
    'Khám định kì',
    'Khám bệnh',
    'Lấy sữa bò',
  ];
  if (validateTaskTypeName.includes(name)) return true;
  return false;
};
