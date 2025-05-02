export const validateNameCategory = (name: string) => {
  const validateCateogryName = [
    'Cỏ Khô',
    'Thức ăn tinh',
    'Thức ăn ủ chua',
    'Khoáng chất',
    'Vắc-xin',
    'Thuốc',
  ];
  if (validateCateogryName.includes(name)) return true;
  return false;
};
