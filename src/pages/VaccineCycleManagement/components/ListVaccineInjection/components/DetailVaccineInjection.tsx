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

const DetailVaccineInjection = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useFetcher<VaccineInjection>(
    `vaccine-injections/${id}`,
    'GET'
  );

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-gray-500 text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <CardComponent
      title={
        <Title className="!text-2xl">
          {data?.description || 'Vaccine Cycle'}
        </Title>
      }
      className="shadow-lg border border-gray-200 rounded-xl"
    >
      <div className="p-6 space-y-10">
        {/* Section 1: Cow Information */}
        <section>
          <Title className="!text-xl text-gray-800 font-semibold mb-6">
            Cow Information
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    Cow Name
                  </span>
                }
                description={
                  <span className="text-gray-600 font-medium text-base">
                    {data?.cowEntity?.name || 'N/A'}
                  </span>
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    Cow Status
                  </span>
                }
                description={
                  <span className="text-gray-600 font-medium text-base">
                    {formatStatusWithCamel(data?.cowEntity?.cowStatus) || 'N/A'}
                  </span>
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    Date of Birth
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
                    Date of Entry
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
                    Cow Origin
                  </span>
                }
                description={
                  <span className="text-gray-600 font-medium text-base">
                    {formatStatusWithCamel(data?.cowEntity?.cowOrigin) || 'N/A'}
                  </span>
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    Gender
                  </span>
                }
                description={
                  <span className="text-gray-600 font-medium text-base">
                    {formatStatusWithCamel(data?.cowEntity?.gender) || 'N/A'}
                  </span>
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    Cow Type
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
            Vaccine Information
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    Vaccine Type
                  </span>
                }
                description={
                  <span className="text-gray-600 font-medium text-base">
                    {formatStatusWithCamel(
                      data?.vaccineCycleDetail?.vaccineType
                    ) || 'N/A'}
                  </span>
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    Periodic
                  </span>
                }
                description={
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium text-base">
                      {data?.vaccineCycleDetail?.numberPeriodic || 'N/A'}
                    </span>
                    <span className="text-gray-600 font-medium text-base">
                      ({data?.vaccineCycleDetail?.unitPeriodic || 'N/A'})
                    </span>
                  </div>
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    Dosage
                  </span>
                }
                description={
                  <span className="text-gray-600 font-medium text-base">
                    {data?.vaccineCycleDetail?.dosage || 'N/A'} (
                    {data?.vaccineCycleDetail?.dosageUnit || 'N/A'})
                  </span>
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    Injection Site
                  </span>
                }
                description={
                  <span className="text-gray-600 font-medium text-base">
                    {formatInjectionSite(
                      data?.vaccineCycleDetail?.injectionSite
                    ) || 'N/A'}
                  </span>
                }
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <TextTitle
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    First Injection Month
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
            Item Details
          </Title>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <TextTitle
              title={
                <span className="font-semibold text-gray-600 text-lg">
                  Item Name
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
                  Description
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
            Storage Information
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={12}>
              <CardComponent
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    Category
                  </span>
                }
                className="shadow-sm border border-gray-200 rounded-lg"
              >
                <p className="text-gray-600 font-medium text-base">
                  <span className="font-semibold">Name: </span>
                  {data?.vaccineCycleDetail?.itemEntity?.categoryEntity?.name ||
                    'N/A'}
                </p>
              </CardComponent>
            </Col>
            <Col xs={24} md={12}>
              <CardComponent
                title={
                  <span className="font-semibold text-gray-600 text-lg">
                    Warehouse
                  </span>
                }
                className="shadow-sm border border-gray-200 rounded-lg"
              >
                <div className="space-y-3">
                  <p className="text-gray-600 font-medium text-base">
                    <span className="font-semibold">Name: </span>
                    {data?.vaccineCycleDetail?.itemEntity
                      ?.warehouseLocationEntity?.name || 'N/A'}
                  </p>
                  <p className="text-gray-600 font-medium text-base">
                    <span className="font-semibold">Type: </span>
                    {formatStatusWithCamel(
                      data?.vaccineCycleDetail?.itemEntity
                        ?.warehouseLocationEntity?.type
                    ) || 'N/A'}
                  </p>
                  <p className="text-gray-600 font-medium text-base">
                    <span className="font-semibold">Description: </span>
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
            Administered By
          </Title>
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <TextTitle
              title={
                <span className="font-semibold text-gray-600 text-lg">
                  Name
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
                  Role
                </span>
              }
              description={
                <span className="text-gray-600 font-medium text-base">
                  {data?.administeredBy?.roleId?.name || 'N/A'}
                </span>
              }
            />
            <TextTitle
              title={
                <span className="font-semibold text-gray-600 text-lg">
                  Email
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
