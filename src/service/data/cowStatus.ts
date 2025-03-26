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
      value: 'pregnantCow',
      label: i18n.t('Pregnant cow', { defaultValue: 'Pregnant cow' }),
    },
    {
      value: 'openCow',
      label: i18n.t('Open cow', { defaultValue: 'Open cow' }),
    },
    {
      value: 'calvingCow',
      label: i18n.t('Calving cow', { defaultValue: 'Calving cow' }),
    },
    {
      value: 'sickCow',
      label: i18n.t('Sick cow', { defaultValue: 'Sick cow' }),
    },
    {
      value: 'breedingCow',
      label: i18n.t('Breeding cow', { defaultValue: 'Breeding cow' }),
    },
    {
      value: 'quarantinedCow',
      label: i18n.t('Quarantined cow', { defaultValue: 'Quarantined cow' }),
    },
    {
      value: 'culling',
      label: i18n.t('Culling', { defaultValue: 'Culling' }),
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
  ];
};
