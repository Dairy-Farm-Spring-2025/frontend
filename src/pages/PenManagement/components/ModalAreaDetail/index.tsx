import React, { useEffect } from 'react';
import { Modal, Spin, Alert } from 'antd';
import { Area } from "../../../../model/Area";
import useFetcher from "../../../../hooks/useFetcher";
import LabelForm from "../../../../components/LabelForm/LabelForm";
import ModalComponent from '../../../../components/Modal/ModalComponent';

interface ModalAreaDetailsProps {
    modal: any;
    areaId: number | null;
}

const ModalAreaDetails = ({ modal, areaId }: ModalAreaDetailsProps) => {
    const { data, isLoading, error } = useFetcher<Area>(`areas/${areaId}`, "GET");

    useEffect(() => {
        console.log("ModalAreaDetails opened with areaId:", areaId);  // Debugging log
    }, [areaId]);

    const onClose = () => {
        modal.closeModal();
    };

    return (
        <ModalComponent
            open={modal.open}
            onCancel={onClose}
            title="Area Details"
            footer={null}
            width={800}
        >
            {isLoading ? (
                <Spin tip="Loading area details..." />
            ) : error ? (
                <Alert message="Error" description={error.message} type="error" showIcon />
            ) : (
                <div className="area-details">
                    {data ? (
                        <>
                            <p>
                                <LabelForm>Description:</LabelForm> {data.description}
                            </p>
                            <p>
                                <LabelForm>Dimensions:</LabelForm> {data.length} x {data.width} cm
                            </p>
                            <p>
                                <LabelForm>Type:</LabelForm> {data.areaType}
                            </p>
                        </>
                    ) : (
                        <p>No details available for this area</p>
                    )}
                </div>
            )}
        </ModalComponent>
    );
};

export default ModalAreaDetails;
