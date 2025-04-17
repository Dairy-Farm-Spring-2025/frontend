import { t } from 'i18next';

export const genderData = () => [
  // {
  //   value: 'male',
  //   label: t('Male'),
  // },
  {
    value: 'female',
    label: t('Female'),
  },
];

export const genderDataUser = () => [
  {
    value: 'male',
    label: t('male', { defaultValue: 'Male' }),
  },
  {
    value: 'female',
    label: t('female', { defaultValue: 'Female' }),
  },
];
