import { t } from 'i18next';

export const equipmentTypeSelect = () => [
  {
    label: t('Milking'),
    value: 'milking',
  },
  {
    label: t('Feeding'),
    value: 'feeding',
  },
  {
    label: t('Cleaning'),
    value: 'cleaning',
  },
  {
    label: t('Housing'),
    value: 'housing',
  },
  {
    label: t('HealthCare'),
    value: 'healthcare',
  },
  {
    label: t('Energy'),
    value: 'energy',
  },
];

export const EquipmentStatus = () => [
  {
    label: t('Available'),
    value: 'available',
  },
  {
    label: t('Repairing'),
    value: 'repairing',
  },
  {
    label: t('Broken'),
    value: 'broken',
  },
  {
    label: t('Using'),
    value: 'using',
  },
];
