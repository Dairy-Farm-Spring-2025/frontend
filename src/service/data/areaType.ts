import { t } from 'i18next';

export const areaType = () => {
  return [
    { value: 'cowHousing', label: t('Cow Housing') },
    { value: 'milkingParlor', label: t('Milking Parlor') },
    { value: 'warehouse', label: t('Warehouse') },
  ];
};
