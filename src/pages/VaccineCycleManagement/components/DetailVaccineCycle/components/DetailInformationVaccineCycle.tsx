import DescriptionComponent from '@components/Description/DescriptionComponent';
import { t } from 'i18next';
import CardComponent from '../../../../../components/Card/CardComponent';
import { VaccineCycleDetails } from '../../../../../model/Vaccine/VaccineCycle/vaccineCycle';
import {
  formatInjectionSite,
  formatStatusWithCamel,
} from '../../../../../utils/format';

interface DetailInformationVaccineCycleProps {
  data: VaccineCycleDetails;
}

const DetailInformationVaccineCycle = ({
  data,
}: DetailInformationVaccineCycleProps) => {
  return (
    <CardComponent className="!text-base !text-left">
      {/* Section 1: Vaccine Cycle Information */}
      <div className="flex flex-col gap-4">
        <DescriptionComponent
          className="!shadow-none"
          items={[
            {
              label: t('Vaccine Ingredients'),
              children: (
                <p className="text-gray-600">
                  {data?.vaccineIngredients || 'N/A'}
                </p>
              ),
            },
            {
              label: t('Vaccine Type'),
              children: (
                <span className="text-gray-600">
                  {t(formatStatusWithCamel(data?.vaccineType)) || 'N/A'}
                </span>
              ),
            },
            {
              label: t('Number Periodic'),
              children: (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">
                    {data?.numberPeriodic || 'N/A'}
                  </span>
                  <span className="text-gray-600">
                    ({t(formatStatusWithCamel(data?.unitPeriodic)) || 'N/A'})
                  </span>
                </div>
              ),
            },
            {
              label: t('Dosage'),
              children: (
                <p className="text-gray-600">
                  {data?.dosage || 'N/A'}{' '}
                  <span className="text-gray-600">
                    ({data?.dosageUnit || 'N/A'})
                  </span>
                </p>
              ),
            },
            {
              label: t('Injection Site'),
              children: (
                <span className="text-gray-600">
                  {t(formatInjectionSite(data?.injectionSite)) || 'N/A'}
                </span>
              ),
            },
            {
              label: t('First Injection Month'),
              children: (
                <span className="text-gray-600">
                  {data?.firstInjectionMonth || 'N/A'}
                </span>
              ),
            },
            {
              label: t('Item'),
              children: (
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">
                    {data?.itemEntity?.name || 'N/A'}
                  </span>
                </div>
              ),
              span: 3,
            },
          ]}
        />
      </div>
    </CardComponent>
  );
};

export default DetailInformationVaccineCycle;
