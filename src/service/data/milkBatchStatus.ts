import { t } from 'i18next';
export const FILTER_MILK_BATCH = () => [
  {
    value: 'expired',
    text: t('Expired'),
  },
  {
    value: 'inventory',
    text: t('Inventory'),
  },
  {
    value: 'out_of_stock',
    text: t('Out of stock'),
  },
];
