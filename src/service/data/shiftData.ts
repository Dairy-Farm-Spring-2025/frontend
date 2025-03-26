import { t } from 'i18next';

export const shiftData = () => [
  {
    value: 'shiftOne',
    label: t('Shift 1 (0h - 6h)'),
    start: 0,
    end: 6,
  },
  {
    value: 'shiftTwo',
    label: t('Shift 2 (6h - 12h)'),
    start: 6,
    end: 12,
  },
];

export const SHIFT_TASK = () => [
  {
    value: 'dayShift',
    label: t('Day shift'),
  },
  {
    value: 'nightShift',
    label: t('Night shift'),
  },
];
