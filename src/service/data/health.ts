import { t } from 'i18next';

export const healthSeverity = () => [
  {
    value: 'none',
    label: t('None'),
  },
  {
    value: 'mild',
    label: t('Mild'),
  },
  {
    value: 'moderate',
    label: t('Moderate'),
  },
  {
    value: 'severe',
    label: t('Severe'),
  },
  {
    value: 'critical',
    label: t('critical', { defaultValue: 'Critical' }),
  },
];
