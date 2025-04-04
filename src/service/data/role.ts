import { t } from 'i18next';

export const role = () => [
  {
    value: '1',
    label: t('Admin'),
  },
  {
    value: '2',
    label: t('Manager'),
  },
  {
    value: '3',
    label: t('Veterinarians'),
  },
  {
    value: '4',
    label: t('Worker'),
  },
];

export const ROLE_TASKTYPE_SELECT = () => [
  {
    value: '3',
    label: t('Veterinarians'),
  },
  {
    value: '4',
    label: t('Worker'),
  },
];
