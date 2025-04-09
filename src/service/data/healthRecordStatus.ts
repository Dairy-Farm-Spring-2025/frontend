import { t } from 'i18next';

export const HEALTH_RECORD_STATUS = () => [
  { label: t('Good'), value: 'good' },
  { label: t('Fair'), value: 'fair' },
  { label: t('Poor'), value: 'poor' },
  { label: t('critical', { defaultValue: 'Critical' }), value: 'critical' },
  { label: t('Recovering'), value: 'recovering' },
];

export const IllnessStatus = () => [
  { label: t('Pending'), value: 'pending' },
  { label: t('Processing'), value: 'processing' },
  { label: t('Complete'), value: 'complete' },
  { label: t('Cancel'), value: 'Cancel' },
  { label: t('Fail'), value: 'fail' },
];
export const IllnessStatus_Filter = () => [
  { text: t('Pending', { defaultValue: 'Pending' }), value: 'pending' },
  { text: t('Processing', { defaultValue: 'Processing' }), value: 'processing' },
  { text: t('Complete', { defaultValue: 'Complete' }), value: 'complete' },
  { text: t('Cancel', { defaultValue: 'Cancel' }), value: 'Cancel' },
  { text: t('Fail', { defaultValue: 'Fail' }), value: 'fail' },

];
