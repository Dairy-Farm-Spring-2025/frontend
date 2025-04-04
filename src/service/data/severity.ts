import { t } from 'i18next';

export const SEVERITY_OPTIONS = () => [
  { label: `🟢 ${t('Mild')}`, value: 'mild' },
  { label: `🟠 ${t('Moderate')}`, value: 'moderate' },
  { label: `🔴 ${t('Severe')}`, value: 'severe' },
  { label: `🚨 ${t('Critical')}`, value: 'critical' },
];
