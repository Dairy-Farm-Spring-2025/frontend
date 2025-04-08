import DescriptionComponent from '@components/Description/DescriptionComponent';
import QuillRender from '@components/UI/QuillRender';
import TextTitle from '@components/UI/TextTitle';
import Title from '@components/UI/Title';
import { Task } from '@model/Task/Task';
import { VaccineInjection } from '@model/Vaccine/VaccineCycle/vaccineCycle';
import { formatStatusWithCamel } from '@utils/format';
import { t } from 'i18next';

interface VaccineTaskProps {
  data: Task;
}
const VaccineTask = ({ data }: VaccineTaskProps) => {
  const dataVaccineInjection: VaccineInjection = data?.vaccineInjection as any;
  return (
    <div>
      <TextTitle
        title={t('Description')}
        description={
          <QuillRender description={dataVaccineInjection?.description} />
        }
      />
      <div className="flex flex-col gap-2">
        <Title className="text-base mt-4">{t('Cow Information')}:</Title>
        <DescriptionComponent
          layout="horizontal"
          items={[
            {
              key: 'name',
              label: t('Name'),
              children: dataVaccineInjection?.cowEntity?.name,
              span: 3,
            },
            {
              key: 'cow-type',
              label: t('Cow Type'),
              children: `${dataVaccineInjection?.cowEntity?.cowTypeEntity?.name} - ${dataVaccineInjection?.cowEntity?.cowTypeEntity?.maxWeight} (kg)`,
              span: 3,
            },
            {
              key: 'cow-status',
              label: t('Cow Status'),
              children: t(
                formatStatusWithCamel(
                  dataVaccineInjection?.cowEntity?.cowStatus
                )
              ),
              span: 3,
            },
          ]}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Title className="text-base mt-4">{t('Vaccine Cycle Detail')}:</Title>
        <DescriptionComponent
          layout="horizontal"
          items={[
            {
              key: 'name',
              label: t('Name'),
              children: dataVaccineInjection?.vaccineCycleDetail?.name,
              span: 3,
            },
            {
              key: 'vaccineIngredients',
              label: t('Vaccine Ingredients'),
              children:
                dataVaccineInjection?.vaccineCycleDetail?.vaccineIngredients,
              span: 3,
            },
            {
              key: 'dosage',
              label: t('Dosage'),
              children: `${
                dataVaccineInjection?.vaccineCycleDetail?.dosage
              } (${t(dataVaccineInjection?.vaccineCycleDetail?.dosageUnit)})`,
              span: 2,
            },
            {
              key: 'numberPeriodic',
              label: t('Number Periodic'),
              children: `${
                dataVaccineInjection?.vaccineCycleDetail?.numberPeriodic
              } (${t(
                formatStatusWithCamel(
                  dataVaccineInjection?.vaccineCycleDetail?.unitPeriodic
                )
              )})`,
              span: 2,
            },
            {
              key: 'injectionSite',
              label: t('Injection Site'),
              children: t(
                formatStatusWithCamel(
                  dataVaccineInjection?.vaccineCycleDetail?.injectionSite
                )
              ),
              span: 2,
            },
            {
              key: 'vaccineType',
              label: t('Vaccine Type'),
              children: t(
                formatStatusWithCamel(
                  dataVaccineInjection?.vaccineCycleDetail?.vaccineType
                )
              ),
              span: 2,
            },
            {
              key: 'firstInjectionMonth',
              label: t('First Injection Month'),
              children:
                dataVaccineInjection?.vaccineCycleDetail?.firstInjectionMonth,
              span: 2,
            },
            {
              key: 'item',
              label: t('Item'),
              children:
                dataVaccineInjection?.vaccineCycleDetail?.itemEntity?.name,
              span: 2,
            },
            {
              key: 'description',
              label: t('Description'),
              children: dataVaccineInjection?.vaccineCycleDetail?.description,
              span: 3,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default VaccineTask;
