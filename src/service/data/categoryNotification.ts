import { t } from 'i18next';

export const getCategoryNotification = () => {
  return [
    { value: 'milking', label: t('Milking') },
    { value: 'feeding', label: t('Feeding') },
    { value: 'heathcare', label: t('Healthcare') },
    { value: 'task', label: t('Task') },
    { value: 'other', label: t('Other') },
  ];
};
