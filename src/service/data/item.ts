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
  { value: 'piece', label: t('Piece', { defaultValue: 'Piece' }) },
  { value: 'pack', label: t('Pack', { defaultValue: 'Pack' }) },
  {
    value: 'squareMeter',
    label: t('Square Meter (m²)', { defaultValue: 'Square Meter (m²)' }),
  },
  { value: 'bottle', label: t('Bottle', { defaultValue: 'Bottle' }) },
  { value: 'bag', label: t('Bag', { defaultValue: 'Bag' }) },
  { value: 'box', label: t('Box', { defaultValue: 'Box' }) },
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
  { value: 'piece', text: t('Piece', { defaultValue: 'Piece' }) },
  { value: 'pack', text: t('Pack', { defaultValue: 'Pack' }) },
  {
    value: 'squareMeter',
    text: t('Square Meter (m²)', { defaultValue: 'Square Meter (m²)' }),
  },
  { value: 'bottle', text: t('Bottle', { defaultValue: 'Bottle' }) },
  { value: 'bag', text: t('Bag', { defaultValue: 'Bag' }) },
  { value: 'box', text: t('Box', { defaultValue: 'Box' }) },
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
