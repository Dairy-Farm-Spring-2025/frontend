import React, { useEffect, useState } from 'react';
import useFetcher from '../../../../../../hooks/useFetcher';
import ModalComponent from '../../../../../../components/Modal/ModalComponent';
import PenEntityDetail from './PenEntityDetail';
import CowEntityDetail from '../CowEntityDetail/CowEntityDetail';
import { penStatus, penType } from '../../../../../../service/data/pen';

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
            penTypes={penType}
            penStatuses={penStatus}
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
