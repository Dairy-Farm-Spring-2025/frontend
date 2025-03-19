import { Divider, Row, Col } from 'antd';
import CardComponent from '../../../../../components/Card/CardComponent';
import TagComponents from '../../../../../components/UI/TagComponents';
import TextTitle from '../../../../../components/UI/TextTitle';
import { VaccineCycleDetails } from '../../../../../model/Vaccine/VaccineCycle/vaccineCycle';
import { formatInjectionSite } from '../../../../../utils/format';
import QuillRender from '../../../../../components/UI/QuillRender';
import Title from '@components/UI/Title';

interface DetailInformationVaccineCycleProps {
  data: VaccineCycleDetails;
}

const DetailInformationVaccineCycle = ({ data }: DetailInformationVaccineCycleProps) => {
  return (
    <CardComponent title={<Title className="!text-2xl">{data?.name || 'Vaccine Cycle'}</Title>}>
      <div className="space-y-8">
        {/* Section 1: Vaccine Cycle Information */}
        <div>
          <Title className="!text-xl mb-4">Vaccine Cycle Information</Title>
          <div className="mb-4">
            <TextTitle
              title={<span className="font-semibold text-gray-600">Description</span>}
              description={
                <QuillRender
                  description={data?.description || 'No Description'}
                  className="prose max-w-full p-4 bg-gray-50 rounded-lg"
                />
              }
            />
          </div>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <TextTitle
                title={<span className="font-semibold text-gray-600">Dosage</span>}
                description={
                  <p className="text-gray-600">
                    {data?.dosage || 'N/A'} <span className="text-gray-500">({data?.dosageUnit || 'N/A'})</span>
                  </p>
                }
              />
            </Col>
            <Col span={8}>
              <TextTitle
                title={<span className="font-semibold text-gray-600">Injection Site</span>}
                description={
                  <span className="text-gray-600">{formatInjectionSite(data?.injectionSite) || 'N/A'}</span>
                }
              />
            </Col>
            <Col span={8}>
              <TextTitle
                title={<span className="font-semibold text-gray-600">Age in months</span>}
                description={<span className="text-gray-600">{data?.ageInMonths || 'N/A'}</span>}
              />
            </Col>
          </Row>
        </div>

        {/* Section 2: Item Details */}
        <div>
          <Title className="!text-xl mb-4">Item Details</Title>
          <Row gutter={[16, 16]} className="mb-4">
            <Col span={24}>
              <TextTitle
                title={<span className="font-semibold text-gray-600">Item Name</span>}
                description={
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700">{data?.itemEntity?.name || 'N/A'}</span>
                    <TagComponents color={data?.itemEntity?.status === 'available' ? 'green' : 'red'}>
                      {data?.itemEntity?.status || 'N/A'}
                    </TagComponents>
                    <TagComponents color="blue" className="flex items-center gap-2">
                      <span>{data?.itemEntity?.quantity || '0'}</span>
                      <span className="text-gray-500">({data?.itemEntity?.unit || 'N/A'})</span>
                    </TagComponents>
                  </div>
                }
              />
            </Col>
            <Col span={24}>
              <TextTitle
                title={<span className="font-semibold text-gray-600">Description</span>}
                description={
                  <span className="text-gray-600">
                    {data?.itemEntity?.description || 'No Description'}
                  </span>
                }
              />
            </Col>
          </Row>
        </div>

        {/* Section 3: Storage Information */}
        <div>
          <Title className="!text-xl mb-4">Storage Information</Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <CardComponent
                title={<span className="font-semibold text-gray-600">Category</span>}
                className="h-fit shadow-sm border border-gray-200"
              >
                <p className="text-gray-600">
                  {data?.itemEntity?.categoryEntity?.name || 'N/A'}
                </p>
              </CardComponent>
            </Col>
            <Col span={12}>
              <CardComponent
                title={
                  <div className="flex gap-2">
                    <span className="font-semibold text-gray-600">Warehouse</span>
                    <span className="text-gray-700">
                      {data?.itemEntity?.warehouseLocationEntity?.name || 'N/A'}
                    </span>
                  </div>
                }
                className="h-fit shadow-sm border border-gray-200"
              >
                <p className="text-gray-600">
                  {data?.itemEntity?.warehouseLocationEntity?.description || 'No Description'}
                </p>
              </CardComponent>
            </Col>
          </Row>
        </div>
      </div>
    </CardComponent>
  );
};

export default DetailInformationVaccineCycle;