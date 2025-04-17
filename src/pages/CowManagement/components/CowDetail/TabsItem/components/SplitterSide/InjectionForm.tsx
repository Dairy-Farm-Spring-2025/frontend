import DescriptionComponent, {
  DescriptionPropsItem,
} from '@components/Description/DescriptionComponent';
import Title from '@components/UI/Title';
import { formatDateHour, formatStatusWithCamel } from '@utils/format';
import { FormInstance } from 'antd';
import { t } from 'i18next';

interface InjectionFormProps {
  form: FormInstance;
  onBack: () => void;
}

const InjectionForm = ({ form }: InjectionFormProps) => {
  const items: DescriptionPropsItem[] = [
    {
      children: form.getFieldValue('vaccineName') || 'N/A',
      key: 'vaccineName',
      label: t('Vaccine Cycle Name'),
    },
    {
      children: formatDateHour(form.getFieldValue('date')) || 'N/A',
      key: 'date',
      label: t('Injection Date'),
    },
    {
      children: form.getFieldValue('administeredBy'),
      key: 'administeredBy',
      label: t('Injection By'),
    },
    {
      children: form.getFieldValue('dosage'),
      key: 'dosage',
      label: t('Dosage'),
    },
    {
      children: t(formatStatusWithCamel(form.getFieldValue('injectionSite'))),
      key: 'injectionSite',
      label: t('Injection Site'),
    },
  ];
  return (
    <div className="!w-full">
      <Title className="!text-2xl mb-5">{t('Injection Record')}: </Title>
      <DescriptionComponent items={items} className="!w-full" />
    </div>
  );
};

export default InjectionForm;
