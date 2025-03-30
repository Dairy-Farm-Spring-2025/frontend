import { Divider, Row, Col } from 'antd';
import CardComponent from '../../../../../components/Card/CardComponent';
import TagComponents from '../../../../../components/UI/TagComponents';
import TextTitle from '../../../../../components/UI/TextTitle';
import { VaccineInjection } from '../../../../../model/Vaccine/VaccineCycle/vaccineCycle';
import { formatInjectionSite } from '../../../../../utils/format';
import Title from '@components/UI/Title';
import { useParams } from 'react-router-dom';
import useFetcher from '@hooks/useFetcher';
import dayjs from 'dayjs';

interface DetailVaccineInjectionProps {
    data?: VaccineInjection;
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
            title={<Title className="!text-3xl text-blue-700 font-bold">{data?.description || 'Vaccine Cycle'}</Title>}
            className="shadow-lg border border-gray-200 rounded-xl"
        >
            <div className="p-6 space-y-10">
                {/* Section 1: Cow Information */}
                <section>
                    <Title className="!text-2xl text-gray-800 font-bold mb-6">Cow Information</Title>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} sm={12} md={8}>
                            <TextTitle
                                title={<span className="font-bold text-gray-800 text-xl">Cow Name</span>}
                                description={<span className="text-gray-700 font-semibold text-lg">{data?.cowEntity?.name || 'N/A'}</span>}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <TextTitle
                                title={<span className="font-bold text-gray-800 text-xl">Cow Status</span>}
                                description={<span className="text-gray-700 font-semibold text-lg">{data?.cowEntity?.cowStatus || 'N/A'}</span>}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <TextTitle
                                title={<span className="font-bold text-gray-800 text-xl">Date of Birth</span>}
                                description={
                                    <span className="text-gray-700 font-semibold text-lg">
                                        {data?.cowEntity?.dateOfBirth
                                            ? dayjs(data.cowEntity.dateOfBirth).format('DD/MM/YYYY')
                                            : 'N/A'}
                                    </span>
                                }
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <TextTitle
                                title={<span className="font-bold text-gray-800 text-xl">Date of Entry</span>}
                                description={
                                    <span className="text-gray-700 font-semibold text-lg">
                                        {data?.cowEntity?.dateOfEnter
                                            ? dayjs(data.cowEntity.dateOfEnter).format('DD/MM/YYYY')
                                            : 'N/A'}
                                    </span>
                                }
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <TextTitle
                                title={<span className="font-bold text-gray-800 text-xl">Cow Origin</span>}
                                description={<span className="text-gray-700 font-semibold text-lg">{data?.cowEntity?.cowOrigin || 'N/A'}</span>}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <TextTitle
                                title={<span className="font-bold text-gray-800 text-xl">Gender</span>}
                                description={<span className="text-gray-700 font-semibold text-lg">{data?.cowEntity?.gender || 'N/A'}</span>}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <TextTitle
                                title={<span className="font-bold text-gray-800 text-xl">Cow Type</span>}
                                description={<span className="text-gray-700 font-semibold text-lg">{data?.cowEntity?.cowTypeEntity?.name || 'N/A'}</span>}
                            />
                        </Col>
                    </Row>
                </section>

                {/* Divider */}
                <Divider className="my-8 border-gray-300" />

                {/* Section 2: Vaccine Information */}
                <section>
                    <Title className="!text-2xl text-gray-800 font-bold mb-6">Vaccine Information</Title>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} sm={12} md={8}>
                            <TextTitle
                                title={<span className="font-bold text-gray-800 text-xl">Vaccine Type</span>}
                                description={<span className="text-gray-700 font-semibold text-lg">{data?.vaccineCycleDetail?.vaccineType || 'N/A'}</span>}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <TextTitle
                                title={<span className="font-bold text-gray-800 text-xl">Periodic</span>}
                                description={
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-700 font-semibold text-lg">{data?.vaccineCycleDetail?.numberPeriodic || 'N/A'}</span>
                                        <span className="text-gray-600 text-lg">({data?.vaccineCycleDetail?.unitPeriodic || 'N/A'})</span>
                                    </div>
                                }
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <TextTitle
                                title={<span className="font-bold text-gray-800 text-xl">Dosage</span>}
                                description={
                                    <span className="text-gray-700 font-semibold text-lg">
                                        {data?.vaccineCycleDetail?.dosage || 'N/A'} ({data?.vaccineCycleDetail?.dosageUnit || 'N/A'})
                                    </span>
                                }
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <TextTitle
                                title={<span className="font-bold text-gray-800 text-xl">Injection Site</span>}
                                description={<span className="text-gray-700 font-semibold text-lg">{formatInjectionSite(data?.vaccineCycleDetail?.injectionSite) || 'N/A'}</span>}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <TextTitle
                                title={<span className="font-bold text-gray-800 text-xl">First Injection Month</span>}
                                description={<span className="text-gray-700 font-semibold text-lg">{data?.vaccineCycleDetail?.firstInjectionMonth || 'N/A'}</span>}
                            />
                        </Col>
                    </Row>
                </section>

                {/* Divider */}
                <Divider className="my-8 border-gray-300" />

                {/* Section 3: Item Details */}
                <section>
                    <Title className="!text-2xl text-gray-800 font-bold mb-6">Item Details</Title>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <TextTitle
                            title={<span className="font-bold text-gray-800 text-xl">Item Name</span>}
                            description={
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="text-gray-700 font-semibold text-lg">{data?.vaccineCycleDetail?.itemEntity?.name || 'N/A'}</span>
                                    <TagComponents color={data?.vaccineCycleDetail?.itemEntity?.status === 'available' ? 'green' : 'red'} className="text-lg">
                                        {data?.vaccineCycleDetail?.itemEntity?.status || 'N/A'}
                                    </TagComponents>
                                    <TagComponents color="blue" className="text-lg">
                                        {data?.vaccineCycleDetail?.itemEntity?.quantity || '0'} {data?.vaccineCycleDetail?.itemEntity?.unit || 'N/A'}
                                    </TagComponents>
                                </div>
                            }
                        />
                        <TextTitle
                            title={<span className="font-bold text-gray-800 text-xl mt-4">Description</span>}
                            description={<span className="text-gray-700 font-semibold text-lg">{data?.vaccineCycleDetail?.itemEntity?.description || 'No Description'}</span>}
                        />
                    </div>
                </section>

                {/* Divider */}
                <Divider className="my-8 border-gray-300" />

                {/* Section 4: Storage Information */}
                <section>
                    <Title className="!text-2xl text-gray-800 font-bold mb-6">Storage Information</Title>
                    <Row gutter={[32, 32]}>
                        <Col xs={24} md={12}>
                            <CardComponent
                                title={<span className="font-bold text-gray-800 text-xl">Category</span>}
                                className="shadow-sm border border-gray-200 rounded-lg"
                            >
                                <p className="text-gray-700 font-semibold text-lg">
                                    <span className="font-bold">Name: </span>
                                    {data?.vaccineCycleDetail?.itemEntity?.categoryEntity?.name || 'N/A'}
                                </p>
                            </CardComponent>
                        </Col>
                        <Col xs={24} md={12}>
                            <CardComponent
                                title={<span className="font-bold text-gray-800 text-xl">Warehouse</span>}
                                className="shadow-sm border border-gray-200 rounded-lg"
                            >
                                <div className="space-y-3">
                                    <p className="text-gray-700 font-semibold text-lg">
                                        <span className="font-bold">Name: </span>
                                        {data?.vaccineCycleDetail?.itemEntity?.warehouseLocationEntity?.name || 'N/A'}
                                    </p>
                                    <p className="text-gray-700 font-semibold text-lg">
                                        <span className="font-bold">Type: </span>
                                        {data?.vaccineCycleDetail?.itemEntity?.warehouseLocationEntity?.type || 'N/A'}
                                    </p>
                                    <p className="text-gray-700 font-semibold text-lg">
                                        <span className="font-bold">Description: </span>
                                        {data?.vaccineCycleDetail?.itemEntity?.warehouseLocationEntity?.description || 'N/A'}
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
                    <Title className="!text-2xl text-gray-800 font-bold mb-6">Administered By</Title>
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <TextTitle
                            title={<span className="font-bold text-gray-800 text-xl">Name</span>}
                            description={<span className="text-gray-700 font-semibold text-lg">{data?.administeredBy?.name || 'N/A'}</span>}
                        />
                        <TextTitle
                            title={<span className="font-bold text-gray-800 text-xl">Role</span>}
                            description={<span className="text-gray-700 font-semibold text-lg">{data?.administeredBy?.roleId?.name || 'N/A'}</span>}
                        />
                        <TextTitle
                            title={<span className="font-bold text-gray-800 text-xl">Email</span>}
                            description={<span className="text-gray-700 font-semibold text-lg">{data?.administeredBy?.email || 'N/A'}</span>}
                        />
                    </div>
                </section>
            </div>
        </CardComponent>
    );
};

export default DetailVaccineInjection;