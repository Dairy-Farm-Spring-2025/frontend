import i18n from 'i18next';

export const cowStatus = () => {
  return [
    {
      value: 'milkingCow',
      label: i18n.t('Milking cow', { defaultValue: 'Milking cow' }),
    },
    {
      value: 'dryCow',
      label: i18n.t('Dry cow', { defaultValue: 'Dry cow' }),
    },
    {
      value: 'youngCow',
      label: i18n.t('Pregnant cow', { defaultValue: 'Pregnant cow' }),
    },

    {
      value: 'sickCow',
      label: i18n.t('Sick cow', { defaultValue: 'Sick cow' }),
    },
    {
      value: 'seriousSickCow',
      label: i18n.t('Serious Sick Cow', { defaultValue: 'Serious Sick Cow' }),
    },

    {
      value: 'culling',
      label: i18n.t('Culling', { defaultValue: 'Culling' }),
    },
  ];
};

export const COW_STATUS_FILTER = () => {
  return [
    {
      value: 'milkingCow',
      text: i18n.t('Milking cow', { defaultValue: 'Milking cow' }),
    },
    {
      value: 'dryCow',
      text: i18n.t('Dry cow', { defaultValue: 'Dry cow' }),
    },
    {
      value: 'pregnantCow',
      text: i18n.t('Pregnant cow', { defaultValue: 'Pregnant cow' }),
    },
    {
      value: 'openCow',
      text: i18n.t('Open cow', { defaultValue: 'Open cow' }),
    },
    {
      value: 'calvingCow',
      text: i18n.t('Calving cow', { defaultValue: 'Calving cow' }),
    },
    {
      value: 'sickCow',
      text: i18n.t('Sick cow', { defaultValue: 'Sick cow' }),
    },
    {
      value: 'breedingCow',
      text: i18n.t('Breeding cow', { defaultValue: 'Breeding cow' }),
    },
    {
      value: 'quarantinedCow',
      text: i18n.t('Quarantined cow', { defaultValue: 'Quarantined cow' }),
    },
    {
      value: 'culling',
      text: i18n.t('Culling', { defaultValue: 'Culling' }),
    },
  ];
};

export const COW_STATUS_DRY_MATTER = () => {
  return [
    {
      value: 'milkingCow',
      label: i18n.t('Milking cow', { defaultValue: 'Milking cow' }),
    },
    {
      value: 'dryCow',
      label: i18n.t('Dry cow', { defaultValue: 'Dry cow' }),
    },
    {
      value: 'sickCow',
      label: i18n.t('Sick cow', { defaultValue: 'Sick cow' }),
    },
    {
      value: 'seriousSickCow',
      label: i18n.t('Serious Sick cow', { defaultValue: 'Serious Sick cow' }),
    },
    {
      value: 'youngCow',
      label: i18n.t('Pregnant cow', { defaultValue: 'Pregnant cow' }),
    },
  ];
};

export const COW_STATUS_FEED_MEALS = () => {
  return [
    {
      value: 'milkingCow',
      text: i18n.t('Milking cow', { defaultValue: 'Milking cow' }),
    },
    {
      value: 'dryCow',
      text: i18n.t('Dry cow', { defaultValue: 'Dry cow' }),
    },
    {
      value: 'sickCow',
      text: i18n.t('Sick cow', { defaultValue: 'Sick cow' }),
    },
  ];
};
