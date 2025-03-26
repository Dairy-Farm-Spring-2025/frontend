import { Divider, Row, Col } from 'antd';
import CardComponent from '../../../../../components/Card/CardComponent';
import TagComponents from '../../../../../components/UI/TagComponents';
import TextTitle from '../../../../../components/UI/TextTitle';
import { VaccineInjection } from '../../../../../model/Vaccine/VaccineCycle/vaccineCycle';
import { formatInjectionSite } from '../../../../../utils/format';
import QuillRender from '../../../../../components/UI/QuillRender';
import Title from '@components/UI/Title';
import { useParams } from 'react-router-dom';
import useFetcher from '@hooks/useFetcher';

interface DetailVaccineInjectionProps {
    data: VaccineInjection;
}

const DetailVaccineInjection = () => {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading } = useFetcher<VaccineInjection>(`vaccine-injections/${id}`, 'GET');

    if (isLoading || !data) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="text-gray-500 text-lg">Loading...</span>
            </div>
        );
    }

    return (
        <CardComponent
            title={<Title className="!text-2xl text-blue-700">{data?.injectionDate || 'Vaccine Cycle'}</Title>}
            className="shadow-lg border border-gray-100 rounded-xl"
        >
            <div className="p-6 space-y-8">
                {/* Section 1: Vaccine Cycle Information */}
                <section>
                    <Title className="!text-xl text-gray-800 mb-4">Cycle Information</Title>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} sm={12} md={8}>
                            <TextTitle
                                title={<span className="font-semibold text-gray-700">Cow</span>}
                                description={<span className="text-gray-600">{data?.cowEntity?.name || 'N/A'}</span>}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <TextTitle
                                title={<span className="font-semibold text-gray-700">Vaccine Type</span>}
                                description={<span className="text-gray-600">{data?.vaccineCycleDetail?.vaccineType || 'N/A'}</span>}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <TextTitle
                                title={<span className="font-semibold text-gray-700">Periodic</span>}
                                description={
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-600">{data?.vaccineCycleDetail?.numberPeriodic || 'N/A'}</span>
                                        <span className="text-gray-500">({data?.vaccineCycleDetail?.unitPeriodic || 'N/A'})</span>
                                    </div>
                                }
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <TextTitle
                                title={<span className="font-semibold text-gray-700">Dosage</span>}
                                description={
                                    <span className="text-gray-600">
                                        {data?.vaccineCycleDetail?.dosage || 'N/A'} ({data?.vaccineCycleDetail?.dosageUnit || 'N/A'})
                                    </span>
                                }
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <TextTitle
                                title={<span className="font-semibold text-gray-700">Injection Site</span>}
                                description={<span className="text-gray-600">{formatInjectionSite(data?.vaccineCycleDetail?.injectionSite) || 'N/A'}</span>}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <TextTitle
                                title={<span className="font-semibold text-gray-700">First Injection Month</span>}
                                description={<span className="text-gray-600">{data?.vaccineCycleDetail?.firstInjectionMonth || 'N/A'}</span>}
                            />
                        </Col>
                    </Row>
                </section>

                {/* Divider */}
                <Divider className="my-6" />

                {/* Section 2: Item Details */}
                <section>
                    <Title className="!text-xl text-gray-800 mb-4">Item Details</Title>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <TextTitle
                            title={<span className="font-semibold text-gray-700">Item Name</span>}
                            description={
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-gray-700 font-medium">{data?.vaccineCycleDetail?.itemEntity?.name || 'N/A'}</span>
                                    <TagComponents color={data?.vaccineCycleDetail?.itemEntity?.status === 'available' ? 'green' : 'red'}>
                                        {data?.vaccineCycleDetail?.itemEntity?.status || 'N/A'}
                                    </TagComponents>
                                    <TagComponents color="blue">
                                        {data?.vaccineCycleDetail?.itemEntity?.quantity || '0'} {data?.vaccineCycleDetail?.itemEntity?.unit || 'N/A'}
                                    </TagComponents>
                                </div>
                            }
                        />
                        <TextTitle
                            title={<span className="font-semibold text-gray-700 mt-4">Description</span>}
                            description={<span className="text-gray-600">{data?.vaccineCycleDetail?.itemEntity?.description || 'No Description'}</span>}
                        />
                    </div>
                </section>

                {/* Divider */}
                <Divider className="my-6" />

                {/* Section 3: Storage Information */}
                <section>
                    <Title className="!text-xl text-gray-800 mb-4">Storage Information</Title>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                            <CardComponent
                                title={<span className="font-semibold text-gray-700">Category</span>}
                                className="shadow-sm border border-gray-200 rounded-lg"
                            >
                                <p className="text-gray-600">
                                    <span className="font-medium">Name: </span>
                                    {data?.vaccineCycleDetail?.itemEntity?.categoryEntity?.name || 'N/A'}
                                </p>
                            </CardComponent>
                        </Col>
                        <Col xs={24} md={12}>
                            <CardComponent
                                title={<span className="font-semibold text-gray-700">Warehouse</span>}
                                className="shadow-sm border border-gray-200 rounded-lg"
                            >
                                <div className="space-y-2">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Name: </span>
                                        {data?.vaccineCycleDetail?.itemEntity?.warehouseLocationEntity?.name || 'N/A'}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Type: </span>
                                        {data?.vaccineCycleDetail?.itemEntity?.warehouseLocationEntity?.type || 'N/A'}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Description: </span>
                                        {data?.vaccineCycleDetail?.itemEntity?.warehouseLocationEntity?.description || 'N/A'}
                                    </p>
                                </div>
                            </CardComponent>
                        </Col>
                    </Row>
                </section>

                {/* Section 4: Administered By */}
                <section>
                    <Title className="!text-xl text-gray-800 mb-4">Administered By</Title>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <TextTitle
                            title={<span className="font-semibold text-gray-700">Name</span>}
                            description={<span className="text-gray-600">{data?.administeredBy?.name || 'N/A'}</span>}
                        />
                        <TextTitle
                            title={<span className="font-semibold text-gray-700">Role</span>}
                            description={<span className="text-gray-600">{data?.administeredBy?.roleId?.name || 'N/A'}</span>}
                        />
                        <TextTitle
                            title={<span className="font-semibold text-gray-700">Email</span>}
                            description={<span className="text-gray-600">{data?.administeredBy?.email || 'N/A'}</span>}
                        />
                    </div>
                </section>
            </div>
        </CardComponent>
    );
};

export default DetailVaccineInjection;