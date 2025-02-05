import React, { useEffect, useState } from 'react';
import { Descriptions, Input, Button, Select, DatePicker } from 'antd';
import useFetcher from '../../../../../../hooks/useFetcher';
import ModalComponent from '../../../../../../components/Modal/ModalComponent';
import { getLabelByValue } from '../../../../../../utils/getLabel';
import { cowStatus } from '../../../../../../service/data/cowStatus';

const cowStatuses = [
  { label: 'Milking Cow', value: 'milkingCow' },
  { label: 'Pregnant Cow', value: 'pregnantCow' },
  { label: 'Calf', value: 'calf' },
];

const cowOrigins = [
  { label: 'Australian', value: 'australian' },
  { label: 'American', value: 'american' },
  { label: 'European', value: 'european' },
];

const genders = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

interface ModalCowDetailProps {
  cowId: number;
  modal: any;
  mutate: any;
}

const ModalCowDetail: React.FC<ModalCowDetailProps> = ({ modal, cowId, mutate }) => {
  const { data } = useFetcher<any>(`cows/${cowId}`, 'GET');
  const { trigger } = useFetcher<any>(`cows/${cowId}`, 'PUT');

  const [cowDetails, setCowDetails] = useState<any>(data);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState<Partial<any>>(null);

  useEffect(() => {
    if (data) {
      setCowDetails(data);
    }
  }, [cowId, data, modal.open]);

  const onClose = () => {
    modal.closeModal();
    setIsEditing(false);
    setCowDetails(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedDetails({ ...cowDetails });
  };

  const handleSave = async () => {
    try {
      setCowDetails((prev: any) => ({ ...prev, ...editedDetails }));
      const updatedCow = await trigger({
        params: cowId,
        body: editedDetails,
      });
      setCowDetails(updatedCow.data);
      setIsEditing(false);
      mutate();
      return updatedCow;
    } catch (err) {
      console.error('Error updating cow:', err);
    }
  };

  const handleInputChange = (key: string, value: string | number | Date) => {
    setEditedDetails((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <ModalComponent
      footer={
        isEditing ? (
          <>
            <Button onClick={handleSave} type='primary'>
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </>
        ) : (
          <Button onClick={handleEdit} type='primary'>
            Edit
          </Button>
        )
      }
      open={modal.open}
      onCancel={onClose}
      title={`Cow Details`}
    >
      {cowDetails && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label='ID'>{cowDetails.cowEntity.cowId}</Descriptions.Item>
          <Descriptions.Item label='Name'>
            {isEditing ? (
              <Input
                value={editedDetails?.cowEntity?.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            ) : (
              cowDetails.cowEntity.name
            )}
          </Descriptions.Item>
          <Descriptions.Item label='Status'>
            {isEditing ? (
              <Select
                value={editedDetails?.cowEntity?.cowStatus || ''}
                onChange={(value) => handleInputChange('cowStatus', value)}
                options={cowStatuses}
              />
            ) : (
              getLabelByValue(cowDetails.cowEntity.cowStatus, cowStatus)
            )}
          </Descriptions.Item>
          <Descriptions.Item label='Date of Birth'>
            {isEditing ? (
              <DatePicker
                value={editedDetails?.cowEntity?.dateOfBirth || ''}
                onChange={(date) => handleInputChange('dateOfBirth', date)}
              />
            ) : (
              cowDetails.cowEntity.dateOfBirth
            )}
          </Descriptions.Item>
          <Descriptions.Item label='Date of Enter'>
            {isEditing ? (
              <DatePicker
                value={editedDetails?.cowEntity?.dateOfEnter || ''}
                onChange={(date) => handleInputChange('dateOfEnter', date)}
              />
            ) : (
              cowDetails.cowEntity.dateOfEnter
            )}
          </Descriptions.Item>
          <Descriptions.Item label='Date of Out'>
            {isEditing ? (
              <DatePicker
                value={editedDetails?.cowEntity?.dateOfOut || ''}
                onChange={(date) => handleInputChange('dateOfOut', date)}
              />
            ) : (
              cowDetails.cowEntity.dateOfOut
            )}
          </Descriptions.Item>
          <Descriptions.Item label='Description'>
            {isEditing ? (
              <Input
                value={editedDetails?.cowEntity?.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            ) : (
              cowDetails.cowEntity.description
            )}
          </Descriptions.Item>
          <Descriptions.Item label='Origin'>
            {isEditing ? (
              <Select
                value={editedDetails?.cowEntity?.cowOrigin || ''}
                onChange={(value) => handleInputChange('cowOrigin', value)}
                options={cowOrigins}
              />
            ) : (
              cowOrigins.find((origin) => origin.value === cowDetails.cowEntity.cowOrigin)?.label
            )}
          </Descriptions.Item>
          <Descriptions.Item label='Gender'>
            {isEditing ? (
              <Select
                value={editedDetails?.cowEntity?.gender || ''}
                onChange={(value) => handleInputChange('gender', value)}
                options={genders}
              />
            ) : (
              genders.find((gender) => gender.value === cowDetails.cowEntity.gender)?.label
            )}
          </Descriptions.Item>
          <Descriptions.Item label='Cow Type'>
            {cowDetails.cowEntity.cowTypeEntity.name}
          </Descriptions.Item>
          <Descriptions.Item label='Created At'>
            {new Date(cowDetails.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label='Updated At'>
            {new Date(cowDetails.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      )}
    </ModalComponent>
  );
};

export default ModalCowDetail;
