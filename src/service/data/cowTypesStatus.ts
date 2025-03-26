import { t } from 'i18next';

export const cowTypesStatus = () => {
  return [
    {
      label: t('Exist'),
      value: 'exist',
    },
    {
      label: t('Not Exist'),
      value: 'notExist',
    },
  ];
};
