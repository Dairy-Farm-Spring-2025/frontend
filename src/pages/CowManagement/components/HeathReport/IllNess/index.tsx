import { Divider, Image, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import cowImage from '../../../../assets/cow.jpg';
import TableComponent, { Column } from '../../../../../components/Table/TableComponent';
import useModal from '../../../../../hooks/useModal';
import useFetcher from '../../../../../hooks/useFetcher';
import { Health } from '../../../../../model/Cow/HealthReport';
import useToast from '../../../../../hooks/useToast';
import { formatAreaType, formatDateHour, formatSTT } from '../../../../../utils/format';
import { getLabelByValue } from '../../../../../utils/getLabel';
import { cowOrigin } from '../../../../../service/data/cowOrigin';
import ButtonComponent from '../../../../../components/Button/ButtonComponent';
import PopconfirmComponent from '../../../../../components/Popconfirm/PopconfirmComponent';
import AnimationAppear from '../../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../../components/UI/WhiteBackground';

import useFetch from '../../../../../hooks/useFetcher';
import ModalCreateIllNess from './components/ModalCreateIllNess';
import ModalViewDetail from './components/ModalViewDetail';
import { useTranslation } from 'react-i18next';
const IllNess = () => {
    const [healthReport, setHealthReport] = useState<Health[]>([]);
    const { data, error, isLoading, mutate } = useFetch<Health[]>('illness', 'GET');
    const { t } = useTranslation();
    const { trigger, isLoading: loadingDelete } = useFetcher(
        'suppliers',
        'DELETE'
    );
    const [modalOpen, setModalOpen] = useState(false)
    console.log(isLoading);
    const toast = useToast();

    const onConfirm = async (id: string) => {
        try {
            await trigger({ url: `illness/${id}` });
            toast.showSuccess('Delete success');
            mutate();
        } catch (error: any) {
            toast.showError(error.message);
        }
    };
    const [id, setId] = useState('');
    const modalViewDetail = useModal();

    const handleOpenModalDetail = (id: string) => {
        setId(id);
        modalViewDetail.openModal();
    };



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
            title: t('Cow'),
            render: (data) => (
                <Tooltip
                    color="#87d068"
                    placement="top"
                    title={
                        <div className='cowEntity'>
                            <p><strong>ID:</strong> {data.cowId}</p>
                            <p><strong>{t("Status")}:</strong> {formatAreaType(data.cowStatus)}</p>
                            <p><strong>{t("Gender")}:</strong> {formatAreaType(data.gender)}</p>
                            <p><strong>{t("Date of Birth")}:</strong> {formatDateHour(data.dateOfBirth)}</p>
                            <p><strong>{t("Date of Enter")}:</strong> {formatDateHour(data.dateOfEnter)}</p>
                            <p><strong>{t("Origin")}:</strong> {getLabelByValue(data.cowOrigin, cowOrigin)}</p>
                            <p><strong>{t("Description")}:</strong> {data.description}</p>
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
            title: t('Created At'),
            render: (data) => formatDateHour(data),
        },
        // {
        //     dataIndex: 'symptoms',
        //     key: 'symptoms',
        //     title: 'Symptoms',
        //     //   render: (element: string, data) => (
        //     //     <TextLink
        //     //       to={`/dairy/cow-management/${data.cowId}`}
        //     //       className="!text-base font-bold"
        //     //     >
        //     //       {element}
        //     //     </TextLink>
        //     //   ),
        // },
        // {
        //     dataIndex: 'severity',
        //     key: 'severity',
        //     title: 'Severity',

        // },
        // {
        //     dataIndex: 'prognosis',
        //     key: 'prognosis',
        //     title: 'Prognosis',
        //     //   render: (data) => getLabelByValue(data, cowOrigin),
        // },
        {
            dataIndex: 'startDate',
            key: 'startDate',
            title: t('Start Date'),
            render: (data) => formatDateHour(data),
        },
        {
            dataIndex: 'endDate',
            key: 'endDate',
            title: t('End Date'),
            render: (data) => (data ? formatDateHour(data) : 'Not Out'),
        },


        {
            dataIndex: 'userEntity',
            key: 'userEntity',
            title: t('user'),
            render: (data) =>
                <Tooltip
                    color="#87d068"
                    placement="top"
                    title={
                        <div className='userEntity'>
                            <p><strong>ID:</strong> {data.id}</p>
                            <p><strong>{t("Employee Number")}:</strong> {formatAreaType(data.employeeNumber)}</p>
                            <p><strong>{t("Email")}:</strong> {data.email}</p>
                            <p><strong>{t("Date of Enter")}:</strong> {formatDateHour(data.dateOfEnter)}</p>
                            <p><strong>{t("Role")}:</strong> {data.roleId.name}</p>
                            {/* <p><strong>Origin:</strong> {getLabelByValue(data.cowOrigin, cowOrigin)}</p>
                            <p><strong>Description:</strong> {data.description}</p> */}
                        </div>
                    }
                >
                    <span className="text-blue-500 ">{data.name}</span>
                </Tooltip>,
        },
        {
            dataIndex: 'illnessId',
            key: 'action',
            title: t('Action'),
            render: (data, record) => (<div className="flex gap-5">

                <ButtonComponent
                    type="primary"
                    onClick={() => handleOpenModalDetail(data)}
                >
                    {t("View Detail")}
                </ButtonComponent>
                <PopconfirmComponent
                    title={'Delete?'}
                    onConfirm={() => onConfirm(data)}
                >
                    <ButtonComponent type="primary" danger>
                        {t("Delete")}
                    </ButtonComponent>
                </PopconfirmComponent>
            </div>
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
                <ButtonComponent type="primary" onClick={() => setModalOpen(true)}>
                    {t("Create IllNess")}
                </ButtonComponent>
                <Divider className="my-4" />
                <TableComponent
                    loading={isLoading}
                    columns={columns}
                    dataSource={formatSTT(healthReport)}
                />
                {/* Modal Create Health Report */}
                <ModalCreateIllNess
                    modal={{ open: modalOpen, closeModal: () => setModalOpen(false) }}
                    mutate={mutate}
                />
                {id !== '' && (
                    <ModalViewDetail id={id} modal={modalViewDetail} mutate={mutate} />
                )}
            </WhiteBackground>
        </AnimationAppear>
    );
};

export default IllNess;
