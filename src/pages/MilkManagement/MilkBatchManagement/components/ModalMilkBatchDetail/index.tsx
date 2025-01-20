import React, { useEffect, useState } from 'react';
import { Descriptions, Input, Button, Divider } from 'antd';
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
    const { data } = useFetcher<any>(`MilkBatch/${milkBatchId}`, 'GET');
    console.log('check data by milkbatchID: ', data);
    const { trigger } = useFetcher<any>(`MilkBatch/${milkBatchId}`, 'PUT');

    const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
    const [editedDetails, setEditedDetails] = useState({ dailyMilkIdsToAdd: [], dailyMilkIdsToRemove: [] });

    useEffect(() => {
        if (data) {
            setEditedDetails({ dailyMilkIdsToAdd: [], dailyMilkIdsToRemove: [] });
        }
    }, [data, milkBatchId]);

    const onClose = () => {
        modal.closeModal();
        setIsEditing(false); // Reset edit mode on close
    };

    const handleSave = async () => {
        try {
            await trigger({ body: editedDetails });
            setIsEditing(false);
            mutate();
        } catch (err) {
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
                        placeholder="Daily Milk IDs to Add"
                        value={editedDetails.dailyMilkIdsToAdd.join(', ')}
                        onChange={(e) =>
                            handleInputChange(
                                'dailyMilkIdsToAdd',
                                e.target.value.split(',').map((id) => id.trim())
                            )
                        }
                    />
                    <Input.TextArea
                        rows={4}
                        placeholder="Daily Milk IDs to Remove"
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
