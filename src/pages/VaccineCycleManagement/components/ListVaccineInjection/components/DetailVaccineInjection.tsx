import Title from '@components/UI/Title';
import useFetcher from '@hooks/useFetcher';
import { Col, Divider, Row } from 'antd';
import { useParams } from 'react-router-dom';
import CardComponent from '../../../../../components/Card/CardComponent';
import TagComponents from '../../../../../components/UI/TagComponents';
import TextTitle from '../../../../../components/UI/TextTitle';
import { VaccineInjection } from '../../../../../model/Vaccine/VaccineCycle/vaccineCycle';
import {
  formatDateHour,
  formatInjectionSite,
  formatStatusWithCamel,
} from '../../../../../utils/format';

// interface DetailVaccineInjectionProps {
//   data?: VaccineInjection;
// }

import { t } from 'i18next';
const DetailVaccineInjection = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useFetcher<VaccineInjection>(
    `vaccine-injections/${id}`,
    'GET'
  );

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500 text-lg">{t('Loading')}...</span>
      </div>
    );
  }

  return (
    <CardComponent
      title={
        <Title className="!text-2xl">
          {data?.description || (t('Vaccine Cycle'))}
        </Title>
      }
      className="shadow-lg border border-gray-200 rounded-xl"
    >
      <div className="p-6 space-y-10">
        {/* Section 1: Cow Information */}
        <section>
          <Title className="!text-xl text-gray-800 font-semibold mb-6">
            {t('Cow Information')}
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    {t('Cow Name')}
                  </span>
                }
                description={
                  <span className="text-gray-600 font-medium text-base">
                    {(data?.cowEntity?.name || 'N/A')}
                  </span>
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    {t('Cow Status')}
                  </span>
                }
                description={
                  <span className="text-gray-600 font-medium text-base">
                    {t(formatStatusWithCamel(data?.cowEntity?.cowStatus)) || 'N/A'}
                  </span>
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    {t('Date of Birth')}
                  </span>
                }
                description={
                  <span className="text-gray-600 font-medium text-base">
                    {data?.cowEntity?.dateOfBirth
                      ? formatDateHour(data.cowEntity.dateOfBirth)
                      : 'N/A'}
                  </span>
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    {t('Date of Entry')}
                  </span>
                }
                description={
                  <span className="text-gray-600 font-medium text-base">
                    {data?.cowEntity?.dateOfEnter
                      ? formatDateHour(data.cowEntity.dateOfEnter)
                      : 'N/A'}
                  </span>
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    {t('Cow Origin')}
                  </span>
                }
                description={
                  <span className="text-gray-600 font-medium text-base">
                    {t(formatStatusWithCamel(data?.cowEntity?.cowOrigin)) || 'N/A'}
                  </span>
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    {t('Gender')}
                  </span>
                }
                description={
                  <span className="text-gray-600 font-medium text-base">
                    {t(formatStatusWithCamel(data?.cowEntity?.gender)) || 'N/A'}
                  </span>
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    {t('Cow Type')}
                  </span>
                }
                description={
                  <span className="text-gray-600 font-medium text-base">
                    {data?.cowEntity?.cowTypeEntity?.name || 'N/A'}
                  </span>
                }
              />
            </Col>
          </Row>
        </section>

        {/* Divider */}
        <Divider className="my-8 border-gray-300" />

        {/* Section 2: Vaccine Information */}
        <section>
          <Title className="!text-xl text-gray-800 font-semibold mb-6">
            {t('Vaccine Information')}
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    {t('Vaccine Type')}
                  </span>
                }
                description={
                  <span className="text-gray-600 font-medium text-base">
                    {t(formatStatusWithCamel(
                      data?.vaccineCycleDetail?.vaccineType
                    )) || 'N/A'}
                  </span>
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    {t('Periodic')}
                  </span>
                }
                description={
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium text-base">
                      {data?.vaccineCycleDetail?.numberPeriodic || 'N/A'}
                    </span>
                    <span className="text-gray-600 font-medium text-base">
                      ({t(data?.vaccineCycleDetail?.unitPeriodic) || 'N/A'})
                    </span>
                  </div>
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    {t('Dosage')}
                  </span>
                }
                description={
                  <span className="text-gray-600 font-medium text-base">
                    {data?.vaccineCycleDetail?.dosage || 'N/A'} (
                    {t(data?.vaccineCycleDetail?.dosageUnit) || 'N/A'})
                  </span>
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    {t('Injection Site')}
                  </span>
                }
                description={
                  <span className="text-gray-600 font-medium text-base">
                    {t(formatInjectionSite(
                      data?.vaccineCycleDetail?.injectionSite
                    )) || 'N/A'}
                  </span>
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    {t('First Injection Month')}
                  </span>
                }
                description={
                  <span className="text-gray-600 font-medium text-base">
                    {data?.vaccineCycleDetail?.firstInjectionMonth || 'N/A'}
                  </span>
                }
              />
            </Col>
          </Row>
        </section>

        {/* Divider */}
        <Divider className="my-8 border-gray-300" />

        {/* Section 3: Item Details */}
        <section>
          <Title className="!text-xl text-gray-800 font-semibold mb-6">
            {t('Item Details')}
          </Title>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <TextTitle
              title={
                <span className="font-semibold text-gray-600 text-lg">
                  {t('Item Name')}
                </span>
              }
              description={
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-gray-700 font-medium text-base">
                    {data?.vaccineCycleDetail?.itemEntity?.name || 'N/A'}
                  </span>
                  <TagComponents
                    color={
                      data?.vaccineCycleDetail?.itemEntity?.status ===
                        'available'
                        ? 'green'
                        : 'red'
                    }
                    className="text-base"
                  >
                    {data?.vaccineCycleDetail?.itemEntity?.status || 'N/A'}
                  </TagComponents>
                  <TagComponents color="blue" className="text-base">
                    {data?.vaccineCycleDetail?.itemEntity?.quantity || '0'}{' '}
                    {data?.vaccineCycleDetail?.itemEntity?.unit || 'N/A'}
                  </TagComponents>
                </div>
              }
            />
            <TextTitle
              title={
                <span className="font-semibold text-gray-600 text-lg mt-4">
                  {t('Description')}
                </span>
              }
              description={
                <span className="text-gray-600 font-medium text-base">
                  {data?.vaccineCycleDetail?.itemEntity?.description ||
                    'No Description'}
                </span>
              }
            />
          </div>
        </section>

        {/* Divider */}
        <Divider className="my-8 border-gray-300" />

        {/* Section 4: Storage Information */}
        <section>
          <Title className="!text-xl text-gray-800 font-semibold mb-6">
            {t('Storage Information')}
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={12}>
              <CardComponent
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    {t('Category')}
                  </span>
                }
                className="shadow-sm border border-gray-200 rounded-lg"
              >
                <p className="text-gray-600 font-medium text-base">
                  <span className="font-semibold">{t('Name')}: </span>
                  {data?.vaccineCycleDetail?.itemEntity?.categoryEntity?.name ||
                    'N/A'}
                </p>
              </CardComponent>
            </Col>
            <Col xs={24} md={12}>
              <CardComponent
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    {t('Warehouse')}
                  </span>
                }
                className="shadow-sm border border-gray-200 rounded-lg"
              >
                <div className="space-y-3">
                  <p className="text-gray-600 font-medium text-base">
                    <span className="font-semibold">{t('Name')}: </span>
                    {data?.vaccineCycleDetail?.itemEntity
                      ?.warehouseLocationEntity?.name || 'N/A'}
                  </p>
                  <p className="text-gray-600 font-medium text-base">
                    <span className="font-semibold">{t('Type')}: </span>
                    {t(formatStatusWithCamel(
                      data?.vaccineCycleDetail?.itemEntity
                        ?.warehouseLocationEntity?.type
                    )) || 'N/A'}
                  </p>
                  <p className="text-gray-600 font-medium text-base">
                    <span className="font-semibold">{t('Description')}: </span>
                    {data?.vaccineCycleDetail?.itemEntity
                      ?.warehouseLocationEntity?.description || 'N/A'}
                  </p>
                </div>
              </CardComponent>
            </Col>
          </Row>
        </section>

        {/* Divider */}
        <Divider className="my-8 border-gray-300" />

        {/* Section 5: Administered By */}
        <section>
          <Title className="!text-xl text-gray-800 font-semibold mb-6">
            {t('Administered By')}
          </Title>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <TextTitle
              title={
                <span className="font-semibold text-gray-600 text-lg">
                  {t('Name')}
                </span>
              }
              description={
                <span className="text-gray-600 font-medium text-base">
                  {data?.administeredBy?.name || 'N/A'}
                </span>
              }
            />
            <TextTitle
              title={
                <span className="font-semibold text-gray-600 text-lg">
                  {t('Role')}
                </span>
              }
              description={
                <span className="text-gray-600 font-medium text-base">
                  {t(formatStatusWithCamel(data?.administeredBy?.roleId?.name)) || 'N/A'}
                </span>
              }
            />
            <TextTitle
              title={
                <span className="font-semibold text-gray-600 text-lg">
                  {t('Email')}
                </span>
              }
              description={
                <span className="text-gray-600 font-medium text-base">
                  {data?.administeredBy?.email || 'N/A'}
                </span>
              }
            />
          </div>
        </section>
      </div>
    </CardComponent>
  );
};

export default DetailVaccineInjection;
