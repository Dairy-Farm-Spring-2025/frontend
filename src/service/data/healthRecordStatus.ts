import { t } from 'i18next';

export const HEALTH_RECORD_STATUS = () => [
  { label: t('Good'), value: 'good' },
  { label: t('Fair'), value: 'fair' },
  { label: t('Poor'), value: 'poor' },
  { label: t('critical', { defaultValue: 'Critical' }), value: 'critical' },
  { label: t('Recovering'), value: 'recovering' },
];
