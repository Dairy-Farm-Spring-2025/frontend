import { t } from 'i18next';

export const statusOptions = () => [
  { value: 'available', label: t('Available', { defaultValue: 'Available' }) },
  {
    value: 'outOfStock',
    label: t('Out of Stock', { defaultValue: 'Out of Stock' }),
  },
  { value: 'damaged', label: t('Damaged', { defaultValue: 'Damaged' }) },
  { value: 'expired', label: t('Expired', { defaultValue: 'Expired' }) },
  { value: 'reserved', label: t('Reserved', { defaultValue: 'Reserved' }) },
];

export const STATUS_ITEM_FILTER = () => [
  { value: 'available', text: t('Available', { defaultValue: 'Available' }) },
  {
    value: 'outOfStock',
    text: t('Out of Stock', { defaultValue: 'Out of Stock' }),
  },
  { value: 'damaged', text: t('Damaged', { defaultValue: 'Damaged' }) },
  { value: 'expired', text: t('Expired', { defaultValue: 'Expired' }) },
  { value: 'reserved', text: t('Reserved', { defaultValue: 'Reserved' }) },
];

export const unitOptions = () => [
  {
    value: 'kilogram',
    label: t('Kilogram (kg)', { defaultValue: 'Kilogram (kg)' }),
  },
  { value: 'gram', label: t('Gram (g)', { defaultValue: 'Gram (g)' }) },
  { value: 'liter', label: t('Liter (L)', { defaultValue: 'Liter (L)' }) },
  {
    value: 'milliliter',
    label: t('Milliliter (mL)', { defaultValue: 'Milliliter (mL)' }),
  },
];

export const UNIT_FILTER = () => [
  {
    value: 'kilogram',
    text: t('Kilogram (kg)', { defaultValue: 'Kilogram (kg)' }),
  },
  { value: 'gram', text: t('Gram (g)', { defaultValue: 'Gram (g)' }) },
  { value: 'liter', text: t('Liter (L)', { defaultValue: 'Liter (L)' }) },
  {
    value: 'milliliter',
    text: t('Milliliter (mL)', { defaultValue: 'Milliliter (mL)' }),
  },
];

export const ITEM_BATCH_OPTIONS = () => [
  { label: t('Available', { defaultValue: 'Available' }), value: 'available' },
  { label: t('In Use', { defaultValue: 'In Use' }), value: 'inUse' },
  {
    label: t('Depleted', { defaultValue: 'Depleted' }),
    value: 'depleted',
  },
  { label: t('Expired', { defaultValue: 'Expired' }), value: 'expired' },
  {
    label: t('Quarantined', { defaultValue: 'Quarantined' }),
    value: 'quarantined',
  },
];

export const ITEM_BATCH_FILTER = () => [
  { text: t('Available', { defaultValue: 'Available' }), value: 'available' },
  { text: t('In Use', { defaultValue: 'In Use' }), value: 'inUse' },
  {
    text: t('Depleted', { defaultValue: 'Depleted' }),
    value: 'depleted',
  },
  { text: t('Expired', { defaultValue: 'Expired' }), value: 'expired' },
  {
    text: t('Quarantined', { defaultValue: 'Quarantined' }),
    value: 'quarantined',
  },
];
