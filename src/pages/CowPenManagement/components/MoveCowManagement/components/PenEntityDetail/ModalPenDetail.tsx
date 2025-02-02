import React, { useEffect, useState } from 'react';
import useFetcher from '../../../../../../hooks/useFetcher';
import ModalComponent from '../../../../../../components/Modal/ModalComponent';
import PenEntityDetail from './PenEntityDetail';
import CowEntityDetail from '../CowEntityDetail/CowEntityDetail';

const penTypes = [
  { label: 'Calf Pen', value: 'calfPen' },
  { label: 'Heifer Pen', value: 'heiferPen' },
  { label: 'Dry Cow Pen', value: 'dryCowPen' },
  { label: 'Lactating Cow Pen', value: 'lactatingCowPen' },
  { label: 'Maternity Pen', value: 'maternityPen' },
  { label: 'Isolation Pen', value: 'isolationPen' },
  { label: 'Holding Pen', value: 'holdingPen' },
];

const penStatuses = [
  { label: 'Occupied', value: 'occupied' },
  { label: 'Empty', value: 'empty' },
  { label: 'Reserved', value: 'reserved' },
  { label: 'Under Maintenance', value: 'underMaintenance' },
  { label: 'Decommissioned', value: 'decommissioned' },
];

interface ModalPenDetailProps {
  penId: number;
  modal: any;
}

const ModalPenDetail: React.FC<ModalPenDetailProps> = ({ modal, penId }) => {
  const { data } = useFetcher<any>(`cow-pens/pen/${penId}`, 'GET');

  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState<Partial<any>>({});

  useEffect(() => {
    if (data) {
      console.log(data);
      setEditedDetails(data[0]);
    } else {
      setEditedDetails({});
    }
  }, [data]);

  const onClose = () => {
    modal.closeModal();
    setIsEditing(false);
  };

  const handleInputChange = (key: string, value: string | number) => {
    setEditedDetails((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ModalComponent
      footer={<></>}
      width={1000}
      open={modal.open}
      onCancel={onClose}
      title={`Pen Details`}
    >
      {data != null ? (
        <div className='flex justify-around'>
          <PenEntityDetail
            penEntity={data[0].penEntity}
            isEditing={isEditing}
            editedDetails={editedDetails}
            handleInputChange={handleInputChange}
            penTypes={penTypes}
            penStatuses={penStatuses}
          />
          <CowEntityDetail cowEntity={data[0].cowEntity} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </ModalComponent>
  );
};

export default ModalPenDetail;
