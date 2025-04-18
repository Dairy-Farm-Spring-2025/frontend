import DescriptionComponent from '@components/Description/DescriptionComponent';
import Title from '@components/UI/Title';
import { Task } from '@model/Task/Task';
import { formatDateHour, formatStatusWithCamel } from '@utils/format';
import { t } from 'i18next';

interface IllnessTaskProps {
  dataTask: Task;
}
const IllnessTask = ({ dataTask }: IllnessTaskProps) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <Title className="mb-3">{t('Illness Record')}</Title>
        <DescriptionComponent
          items={[
            {
              children: formatDateHour(dataTask?.illness?.date),
              label: t('Date'),
            },
            {
              children: dataTask?.illness?.dosage,
              label: t('Dosage'),
            },
            {
              children: t(
                formatStatusWithCamel(dataTask?.illness?.status as string)
              ),
              label: t('Status'),
            },
            {
              children: t(
                formatStatusWithCamel(
                  dataTask?.illness?.injectionSite as string
                )
              ),
              label: t('Injection Site'),
              span: 1,
            },
            {
              children: `${dataTask?.illness?.veterinarian?.name} - ${dataTask?.illness?.veterinarian?.employeeNumber}`,
              label: t('Veterinarian'),
              span: 2,
            },
            {
              children: dataTask?.illness?.description,
              label: t('Description'),
              span: 3,
            },
          ]}
        />
      </div>
      <div>
        <Title className="mb-3">{t('Vaccine')}</Title>
        <DescriptionComponent
          items={[
            {
              children: dataTask?.illness?.vaccine?.name,
              label: t('Name'),
              span: 2,
            },
            {
              children: t(
                formatStatusWithCamel(dataTask?.illness?.vaccine?.unit as any)
              ),
              label: t('Unit'),
              span: 1,
            },
            {
              children: dataTask?.illness?.vaccine?.description,
              label: t('Description'),
              span: 3,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default IllnessTask;
