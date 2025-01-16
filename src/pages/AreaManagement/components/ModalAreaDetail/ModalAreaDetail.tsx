import React, { useState } from 'react';
import { Descriptions, Input, Button } from 'antd';
import useFetcher from '../../../../hooks/useFetcher';
import { Area } from '../../../../model/Area/Area';
import ButtonComponent from '../../../../components/Button/ButtonComponent';
import ModalComponent from '../../../../components/Modal/ModalComponent';

interface ModalAreaDetailProps {
  area: Area; // The ID of the area to fetch details for
  modal: any; // Controls the visibility of the modal
}

const ModalAreaDetail: React.FC<ModalAreaDetailProps> = ({ modal, area }) => {
  const { trigger } = useFetcher<any>(
    `areas/${area.areaId}`,
    'PUT' // Or 'PATCH', depending on your API's convention
  );

  const [areaDetails, setAreaDetails] = useState<Area | null>(area);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [editedDetails, setEditedDetails] = useState<Partial<Area> | null>(null);

  const onClose = () => {
    modal.closeModal();
    setIsEditing(false); // Reset edit mode on close
    setAreaDetails(null);
  };

  const handleEdit = () => {
    setIsEditing(true); // Enable edit mode
  };

  const handleSave = async () => {
    try {
      // Optimistically update the local state
      setAreaDetails((prev) => ({ ...prev, ...editedDetails } as Area));

      // Use mutate to update SWR cache and trigger a revalidation

      const updatedArea = await trigger({
        params: area.areaId,
        body: editedDetails,
      });

      setIsEditing(false);
      console.log('Updated successfully:', editedDetails);
      return updatedArea; // Return the updated data for SWR cache
    } catch (err) {
      console.error('Error updating area:', err);
    }
  };

  const handleInputChange = (key: keyof Area, value: string | number) => {
    setEditedDetails((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <ButtonComponent onClick={modal.openModal} type='primary'>
        View Details
      </ButtonComponent>
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
        title={`Area Details`}
      >
        {areaDetails && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label='ID'>{areaDetails.areaId}</Descriptions.Item>
            <Descriptions.Item label='Name'>
              {isEditing ? (
                <Input
                  value={editedDetails?.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              ) : (
                areaDetails.name
              )}
            </Descriptions.Item>
            <Descriptions.Item label='Description'>
              {isEditing ? (
                <Input
                  value={editedDetails?.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              ) : (
                areaDetails.description
              )}
            </Descriptions.Item>
            <Descriptions.Item label='Length'>
              {isEditing ? (
                <Input
                  type='number'
                  value={editedDetails?.length || 0}
                  onChange={(e) => handleInputChange('length', Number(e.target.value))}
                />
              ) : (
                `${areaDetails.length} m`
              )}
            </Descriptions.Item>
            <Descriptions.Item label='Width'>
              {isEditing ? (
                <Input
                  type='number'
                  value={editedDetails?.width || 0}
                  onChange={(e) => handleInputChange('width', Number(e.target.value))}
                />
              ) : (
                `${areaDetails.width} m`
              )}
            </Descriptions.Item>
            <Descriptions.Item label='Area Type'>
              {isEditing ? (
                <Input
                  value={editedDetails?.areaType || ''}
                  onChange={(e) => handleInputChange('areaType', e.target.value)}
                />
              ) : (
                areaDetails.areaType
              )}
            </Descriptions.Item>
            <Descriptions.Item label='Created At'>
              {new Date(areaDetails.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label='Updated At'>
              {new Date(areaDetails.updatedAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </ModalComponent>
    </>
  );
};

export default ModalAreaDetail;
