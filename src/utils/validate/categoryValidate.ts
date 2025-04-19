export const validateNameCategory = (name: string) => {
  const validateCateogryName = [
    'Cỏ khô',
    'Thức ăn tinh',
    'Thức ăn ủ chua',
    'Khoáng chất',
    'Vắc-xin',
  ];
  if (validateCateogryName.includes(name)) return true;
  return false;
};
