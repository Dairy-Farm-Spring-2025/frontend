import { Image, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import cowImage from '../../../../assets/cow.jpg';
import ButtonComponent from '../../../../components/Button/ButtonComponent';
import TableComponent, {
    Column,
} from '../../../../components/Table/TableComponent';
import AnimationAppear from '../../../../components/UI/AnimationAppear';
import TextLink from '../../../../components/UI/TextLink';
import WhiteBackground from '../../../../components/UI/WhiteBackground';
import useFetch from '../../../../hooks/useFetcher';
import useToast from '../../../../hooks/useToast';
import { Cow } from '../../../../model/Cow/Cow';
import { cowOrigin } from '../../../../service/data/cowOrigin';
import { cowStatus } from '../../../../service/data/cowStatus';
import { formatAreaType, formatDateHour, formatSTT } from '../../../../utils/format';
import { getLabelByValue } from '../../../../utils/getLabel';
import { Health } from '../../../../model/Cow/HealthReport';
import "./index.scss"

const HealthReport = () => {
    const [healthReport, setHealthReport] = useState<Health[]>([]);
    const { data, error, isLoading } = useFetch<Health[]>('illness', 'GET');
    console.log(isLoading);
    const toast = useToast();
    const columns: Column[] = [
        {
            dataIndex: 'illnessId',
            key: 'illnessId',
            title: '#',
            render: (__, _, index) => <p className="text-base">{index + 1}</p>,
        },
        {
            dataIndex: 'cowEntity',
            key: 'cowEntity',
            title: 'Cow',
            render: (data) => (
                <Tooltip
                    color="#87d068"
                    placement="top"
                    title={
                        <div className='cowEntity'>
                            <p><strong>ID:</strong> {data.cowId}</p>
                            <p><strong>Status:</strong> {formatAreaType(data.cowStatus)}</p>
                            <p><strong>Gender:</strong> {formatAreaType(data.gender)}</p>
                            <p><strong>Date of Birth:</strong> {formatDateHour(data.dateOfBirth)}</p>
                            <p><strong>Date of Enter:</strong> {formatDateHour(data.dateOfEnter)}</p>
                            <p><strong>Origin:</strong> {getLabelByValue(data.cowOrigin, cowOrigin)}</p>
                            <p><strong>Description:</strong> {data.description}</p>
                        </div>
                    }
                >
                    <span className="text-blue-500 ">{data.name}</span>
                </Tooltip>
            ),
        },

        // {
        //   dataIndex: 'image',
        //   key: 'image',
        //   title: 'Image',
        //   render: () => <Image width={200} src={cowImage} />,
        //   width: 200,
        // },
        {
            dataIndex: 'createdAt',
            key: 'createdAt',
            title: 'Created At',
            render: (data) => formatDateHour(data),
        },
        {
            dataIndex: 'symptoms',
            key: 'symptoms',
            title: 'Symptoms',
            //   render: (element: string, data) => (
            //     <TextLink
            //       to={`/dairy/cow-management/${data.cowId}`}
            //       className="!text-base font-bold"
            //     >
            //       {element}
            //     </TextLink>
            //   ),
        },
        {
            dataIndex: 'severity',
            key: 'severity',
            title: 'Severity',

        },
        {
            dataIndex: 'startDate',
            key: 'startDate',
            title: 'Start Date',
            render: (data) => formatDateHour(data),
        },
        {
            dataIndex: 'endDate',
            key: 'endDate',
            title: 'End Date',
            render: (data) => (data ? formatDateHour(data) : 'Not Out'),
        },
        {
            dataIndex: 'prognosis',
            key: 'prognosis',
            title: 'Prognosis',
            //   render: (data) => getLabelByValue(data, cowOrigin),
        },

        {
            dataIndex: 'userEntity',
            key: 'userEntity',
            title: 'User',
            render: (data) =>
                <Tooltip
                    color="#87d068"
                    placement="top"
                    title={
                        <div className='userEntity'>
                            <p><strong>ID:</strong> {data.id}</p>
                            <p><strong>Employee Number:</strong> {formatAreaType(data.employeeNumber)}</p>
                            <p><strong>Email:</strong> {data.email}</p>
                            <p><strong>Date of Enter:</strong> {formatDateHour(data.dateOfEnter)}</p>
                            <p><strong>Role:</strong> {data.roleId.name}</p>
                            {/* <p><strong>Origin:</strong> {getLabelByValue(data.cowOrigin, cowOrigin)}</p>
                            <p><strong>Description:</strong> {data.description}</p> */}
                        </div>
                    }
                >
                    <span className="text-blue-500 ">{data.name}</span>
                </Tooltip>,
        },
        {
            dataIndex: 'cowId',
            key: 'action',
            title: 'Action',
            render: () => (
                <ButtonComponent type="primary" danger>
                    Delete
                </ButtonComponent>
            ),
        },
    ];
    useEffect(() => {
        if (data) {
            setHealthReport(data);
        }
        if (error) {
            toast.showError(error);
        }
    }, [data, error, toast]);
    return (
        <AnimationAppear duration={0.5}>
            <WhiteBackground>
                <TableComponent
                    loading={isLoading}
                    columns={columns}
                    dataSource={formatSTT(healthReport)}
                />
            </WhiteBackground>
        </AnimationAppear>
    );
};

export default HealthReport;
