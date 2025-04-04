import { t } from 'i18next';

export const injectionSiteOptions = () => [
  { label: `💪 ${t('Left Arm')}`, value: 'leftArm' },
  { label: `💪 ${t('Right Arm')}`, value: 'rightArm' },
  { label: `🦵 ${t('Left Thigh')}`, value: 'leftThigh' },
  { label: `🦵 ${t('Right Thigh')}`, value: 'rightThigh' },
  { label: `🍑 ${t('Buttock')}`, value: 'buttock' },
  { label: `🫄 ${t('Abdomen')}`, value: 'abdomen' },
  { label: `❓ ${t('Other')}`, value: 'other' },
];

export const vaccineType = () => [
  { label: `💉 ${t('Hormone')}`, value: 'hormone' },
  { label: `💉 ${t('Vaccine')}`, value: 'vaccine' },
];

export const unitPeriodic = () => [
  { label: t('Days'), value: 'days' },
  { label: t('Weeks'), value: 'weeks' },
  { label: t('Months'), value: 'months' },
  { label: t('Years'), value: 'years' },
];
