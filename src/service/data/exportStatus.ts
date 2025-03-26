import { t } from 'i18next';

export const EXPORT_STATUS_OPTIONS = () => [
  { value: 'pending', label: t('Pending') },
  { value: 'approve', label: t('Approved') },
  { value: 'export', label: t('Exported') },
  { value: 'cancel', label: t('Cancel') },
  { value: 'reject', label: t('Reject') },
];
