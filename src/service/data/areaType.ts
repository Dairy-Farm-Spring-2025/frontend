import { useTranslation } from "react-i18next";

export const areaType = () => {
  const { t } = useTranslation();

  return [
    { value: 'cowHousing', label: t('Cow Housing') },
    { value: 'milkingParlor', label: t('Milking Parlor') },
    { value: 'warehouse', label: t('Warehouse') },
  ];
};
