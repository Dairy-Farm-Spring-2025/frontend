import React, { useEffect, useState } from 'react';
import { Descriptions, Input, Button, Divider, message } from 'antd';
import useFetcher from '../../../../../hooks/useFetcher';
import ModalComponent from '../../../../../components/Modal/ModalComponent';

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
    };
    cow: {
        name: string;
        cowTypeEntity: {
            name: string;
        };
        cowOrigin: string;
    };
}
const ModalMilkBatchDetail: React.FC<ModalMilkBatchDetailProps> = ({ modal, milkBatchId, mutate }) => {
    const { data, error, isLoading, mutate: localMutate } = useFetcher<any>(`MilkBatch/${milkBatchId}`, 'GET');
    console.log("check data by milkBatchID: ", data)
    const { trigger } = useFetcher<any>(`MilkBatch/${milkBatchId}`, 'PUT');

    const [isEditing, setIsEditing] = useState(false);
    const [editedDetails, setEditedDetails] = useState({ dailyMilkIdsToAdd: [], dailyMilkIdsToRemove: [] });

    useEffect(() => {
        if (data) {
            setEditedDetails({ dailyMilkIdsToAdd: [], dailyMilkIdsToRemove: [] });
        }
    }, [data, milkBatchId, modal.open, mutate]);


    const onClose = () => {
        modal.closeModal();
        setIsEditing(false);
    };
    const refreshData = async () => {
        try {
            await localMutate(); // Gọi mutate() để làm mới dữ liệu
            // message.success('Milk batch refreshed successfully!');
        } catch (err) {
            message.error('Error refreshing milk batch data.');
            console.error('Error refreshing data:', err);
        }
    };
    const handleSave = async () => {
        if (
            editedDetails.dailyMilkIdsToAdd.length === 0 ||
            editedDetails.dailyMilkIdsToRemove.length === 0
        ) {
            message.error('Please fill in at least one of the fields before saving.');
            return;
        }
        try {
            const payload: any = {};
            if (editedDetails.dailyMilkIdsToAdd.length > 0) {
                payload.dailyMilkIdsToAdd = editedDetails.dailyMilkIdsToAdd;
            }
            if (editedDetails.dailyMilkIdsToRemove.length > 0) {
                payload.dailyMilkIdsToRemove = editedDetails.dailyMilkIdsToRemove;
            }

            await trigger({ body: payload });
            message.success('Milk batch updated successfully!');
            await refreshData(); // Làm mới dữ liệu sau khi chỉnh sửa thành công
            // mutate(); // Fetch lại dữ liệu sau khi update
            setIsEditing(false);
        } catch (err) {
            message.error('Error updating milk batch. Please try again.');
            console.error('Error updating milk batch:', err);
        }
    };

    const handleInputChange = (key: string, value: any) => {
        setEditedDetails((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <ModalComponent
            footer={
                isEditing ? (
                    <>
                        <Button onClick={handleSave} type="primary">
                            Save
                        </Button>
                        <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                    </>
                ) : (
                    <Button onClick={() => setIsEditing(true)} type="primary">
                        Edit
                    </Button>
                )
            }
            open={modal.open}
            onCancel={onClose}
            title={`MilkBatch Details`}
            width={1000}
        >
            {isEditing ? (
                <div>
                    <Input.TextArea
                        rows={4}
                        placeholder="Enter Daily Milk IDs to Add (e.g., 1, 2, 3)"
                        value={editedDetails.dailyMilkIdsToAdd.join(', ')}
                        onChange={(e) =>
                            handleInputChange(
                                'dailyMilkIdsToAdd',
                                e.target.value.split(',').map((id) => id.trim())
                            )
                        }
                    />
                    <Divider>OR</Divider>
                    <Input.TextArea
                        rows={4}
                        placeholder="Enter Daily Milk IDs to Remove (e.g., 4, 5, 6)"

                        value={editedDetails.dailyMilkIdsToRemove.join(', ')}
                        onChange={(e) =>
                            handleInputChange(
                                'dailyMilkIdsToRemove',
                                e.target.value.split(',').map((id) => id.trim())
                            )
                        }
                    />
                </div>
            ) : data?.dailyMilks?.length > 0 ? (
                data.dailyMilks.map((milk: Milk) => (
                    <div key={milk.dailyMilkId}>
                        <Descriptions bordered column={3}>
                            <Descriptions.Item label="Daily Milk ID">{milk.dailyMilkId}</Descriptions.Item>
                            <Descriptions.Item label="Shift">{milk.shift}</Descriptions.Item>
                            <Descriptions.Item label="Milk Date">{milk.milkDate}</Descriptions.Item>
                            <Descriptions.Item label="Worker Name">{milk.worker?.name}</Descriptions.Item>
                            <Descriptions.Item label="Phone Number">{milk.worker?.phoneNumber}</Descriptions.Item>
                            <Descriptions.Item label="Role">{milk.worker?.roleId?.name}</Descriptions.Item>
                            <Descriptions.Item label="Cow Name">{milk.cow?.name}</Descriptions.Item>
                            <Descriptions.Item label="Cow Type">{milk.cow?.cowTypeEntity?.name}</Descriptions.Item>
                            <Descriptions.Item label="Cow Origin">{milk.cow?.cowOrigin}</Descriptions.Item>
                        </Descriptions>
                        <Divider />
                    </div>
                ))
            ) : (
                <p>No data available for this Milk Batch.</p>
            )}
        </ModalComponent>
    );
};

export default ModalMilkBatchDetail;
