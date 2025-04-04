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
    label: `${t('Day shift')} 🌞`,
  },
  {
    value: 'nightShift',
    label: `${t('Night shift')} 🌙`,
  },
];

export const SHIFT_FEED_MEAL = () => [
  {
    value: 'morningShift',
    label: t('Morning Shift'),
  },
  {
    value: 'noonShift',
    label: t('Noon Shift'),
  },
  {
    value: 'afternoonShift',
    label: t('Afternoon Shift'),
  },
];

export const SHIFT_FEED_MEAL_FILTER = () => [
  {
    text: t('Morning Shift'),
    value: 'morningShift',
  },
  {
    text: t('Noon Shift'),
    value: 'noonShift',
  },
  {
    text: t('Afternoon Shift'),
    value: 'afternoonShift',
  },
];
