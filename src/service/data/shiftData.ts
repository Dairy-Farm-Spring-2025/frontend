import { t } from 'i18next';

export const shiftData = () => [
  {
    value: 'shiftOne',
    label: t('Shift 1 (8h - 12h)'),
    start: 8,
    end: 12,
  },
  {
    value: 'shiftTwo',
    label: t('Shift 2 (13h - 17h)'),
    start: 13,
    end: 24,
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
