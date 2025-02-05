



import React, { useEffect, useState } from 'react';
import { Input, Button, Divider, message, Table, Popconfirm, Row, Col, Tooltip, Select } from 'antd';
import useFetcher from '../../../../../hooks/useFetcher';
import ModalComponent from '../../../../../components/Modal/ModalComponent';
import TableComponent, { Column } from '../../../../../components/Table/TableComponent';
import AnimationAppear from '../../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../../components/UI/WhiteBackground';
import { formatAreaType } from '../../../../../utils/format';

interface ModalMilkBatchDetailProps {
    milkBatchId: number;
    modal: any;
    mutate: any;
}

interface Milk {
    dailyMilkId: number;
    shift: string;
    milkDate: string;
    worker: {
        name: string;
        phoneNumber: string;
        roleId: {
            name: string;
        };
        employeeNumber: string;
    };
    cow: {
        cowId: string;
        name: string;
        cowTypeEntity: {
            name: string;
        };
        cowStatus: string;
        cowOrigin: string;
        gender: string;
    };
}

const ModalMilkBatchDetail: React.FC<ModalMilkBatchDetailProps> = ({ modal, milkBatchId, mutate }) => {
    const { data, error, isLoading, mutate: localMutate } = useFetcher<any>(`MilkBatch/${milkBatchId}`, 'GET');
    const { trigger } = useFetcher<any>(`MilkBatch/${milkBatchId}`, 'PUT');
    const { data: dataDailyMilkAvailable, mutate: fetchDataDailymilkIdAvailable } = useFetcher<any>(`dailymilks/search_available`, 'GET');
    const [dailyMilkIdToAdd, setDailyMilkIdToAdd] = useState<number | null>(null);
    console.log("check data dailymilkid: ", dataDailyMilkAvailable)
    const refreshData = async () => {
        try {
            await localMutate();
        } catch (err) {
            message.error('Error refreshing milk batch data.');
        }
    };

    const handleAddDailyMilkId = async () => {
        if (!dailyMilkIdToAdd) {
            message.warning('Please select a valid Daily Milk ID.');
            return;
        }

        try {
            const payload = { dailyMilkIdsToAdd: [dailyMilkIdToAdd] };
            await trigger({ body: payload });
            message.success(`Daily Milk ID ${dailyMilkIdToAdd} added successfully!`);
            // setDailyMilkIdToAdd(null);
            await refreshData();
        } catch (err) {
            message.error('Error adding Daily Milk ID. Please try again.');
        }
    };
    const handleDelete = async (dailyMilkId: number) => {
        try {
            const payload = {
                dailyMilkIdsToRemove: [dailyMilkId],
            };

            await trigger({ body: payload });
            message.success(`Successfully removed Daily Milk ID: ${dailyMilkId}`);
            await refreshData();
        } catch (err) {
            message.error(`Error removing Daily Milk ID: ${dailyMilkId}`);
        }
    };
    const columns: Column[] = [
        {
            title: 'Daily Milk ID',
            dataIndex: 'dailyMilkId',
            key: 'dailyMilkId',
        },
        {
            title: 'Volume',
            dataIndex: 'volume',
            key: 'volume',
        },
        {
            title: 'Shift',
            dataIndex: 'shift',
            key: 'shift',
            render: (shift: string) => (
                formatAreaType(shift)
            )
        },
        {
            title: 'Milk Date',
            dataIndex: 'milkDate',
            key: 'milkDate',
        },
        {
            title: 'Worker Name',
            dataIndex: 'workerName',
            key: 'workerName',
            render: (_: any, record: Milk) => (
                <Tooltip
                    title={
                        <>
                            <div><strong>Employee Number:</strong> {formatAreaType(record.worker?.employeeNumber || 'N/A')}</div>
                            <div><strong>Phone:</strong> {record.worker?.phoneNumber || 'N/A'}</div>
                            <div><strong>Role:</strong> {record.worker?.roleId?.name || 'N/A'}</div>
                        </>
                    }
                    color="#87d068"
                    placement="top"
                >
                    <span className="text-blue-600">
                        {record.worker?.name || 'N/A'}
                    </span>
                </Tooltip>
            ),
        },
        {
            title: 'Cow Name',
            dataIndex: 'cowName',
            key: 'cowName',
            render: (_: any, record: Milk) => (
                <Tooltip
                    title={
                        <>
                            <div><strong>Cow Id:</strong> {record.cow?.cowId || 'N/A'}</div>
                            <div><strong>Type:</strong> {record.cow?.cowTypeEntity?.name || 'N/A'}</div>
                            <div><strong>Origin:</strong> {formatAreaType(record.cow?.cowOrigin || 'N/A')}</div>
                            <div><strong>Cow Type:</strong> {record.cow?.cowTypeEntity?.name || 'N/A'}</div>
                            <div><strong>Gender:</strong> {formatAreaType(record.cow?.gender || 'N/A')}</div>
                        </>
                    }
                    color="#87d068"
                    placement="top"
                >
                    <span className="text-blue-600">
                        {record.cow?.name || 'N/A'}
                    </span>
                </Tooltip>
            ),
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_: any, record: Milk) => (
                <Popconfirm
                    title={`Are you sure you want to delete Daily Milk ID: ${record.dailyMilkId}?`}
                    onConfirm={() => handleDelete(record.dailyMilkId)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger>Delete</Button>
                </Popconfirm>
            ),
        },
    ];

    const onClose = () => {
        modal.closeModal();
    };

    return (
        <ModalComponent
            footer={
                <Button onClick={onClose} type="primary">
                    Close
                </Button>
            }
            open={modal.open}
            onCancel={onClose}
            title={`MilkBatch Details`}
            width={1500}
        >
            {/* Add Daily Milk ID Section */}
            <Row gutter={16} style={{ marginBottom: 10 }}>
                <Col span={8}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Select a Daily Milk ID"
                        value={dailyMilkIdToAdd}
                        onChange={(value) => setDailyMilkIdToAdd(value)}
                        options={dataDailyMilkAvailable?.map((milk: Milk) => ({
                            value: milk.dailyMilkId,
                            label: `Daily Milk ID: ${milk.dailyMilkId} - ${milk.milkDate} (${formatAreaType(milk.shift)})`,
                        }))}

                        onDropdownVisibleChange={(open) => {
                            if (open) {
                                fetchDataDailymilkIdAvailable(); // Gọi API khi mở dropdown
                            }
                        }}
                    />
                </Col>
                <Col span={4}>
                    <Button type="primary" onClick={handleAddDailyMilkId}>
                        Add Daily Milk
                    </Button>
                </Col>
            </Row>

            {/* Table */}
            <AnimationAppear duration={0.5}>
                <WhiteBackground>
                    <TableComponent
                        columns={columns}
                        dataSource={data?.dailyMilks || []}

                        rowKey="dailyMilkId"
                        loading={isLoading}
                    />
                </WhiteBackground>
            </AnimationAppear>
        </ModalComponent>
    );
};

export default ModalMilkBatchDetail;
