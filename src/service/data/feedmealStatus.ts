import i18n from '@config/i18n';

export const FEED_MEAL_STATUS = () => {
  return [
    {
      value: 'inUse',
      label: i18n.t('In use', { defaultValue: 'In use' }),
    },
    {
      value: 'noUse',
      label: i18n.t('No use', { defaultValue: 'No use' }),
    },
  ];
};

export const FEED_MEAL_STATUS_FILTER = () => {
  return [
    {
      value: 'inUse',
      text: i18n.t('In use', { defaultValue: 'In use' }),
    },
    {
      value: 'noUse',
      text: i18n.t('No use', { defaultValue: 'No use' }),
    },
  ];
};
