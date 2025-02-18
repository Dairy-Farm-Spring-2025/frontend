import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Descriptions, Input, Button, Select } from 'antd';
import useFetcher from '../../../../hooks/useFetcher';
import { Area } from '../../../../model/Area/Area';
import ModalComponent from '../../../../components/Modal/ModalComponent';
import { AreaType } from '../../../../model/Area/AreaType';
import { useTranslation } from 'react-i18next';


const areaTypes: { label: string; value: AreaType }[] = [

  { label: 'Cow Housing', value: 'cowHousing' },
  { label: 'Milking Parlor', value: 'milkingParlor' },
  { label: 'Warehouse', value: 'warehouse' },
];

interface ModalAreaDetailProps {
  areaId: number; // The ID of the area to fetch details for
  modal: any; // Controls the visibility of the modal
  mutate: any;
}

const ModalAreaDetail: React.FC<ModalAreaDetailProps> = ({ modal, areaId, mutate }) => {
  const { t } = useTranslation();
  const { data } = useFetcher<any>(`areas/${areaId}`, 'GET');
  console.log("check data by areaId: ", data)
  const { trigger } = useFetcher<any>(
    `areas/${areaId}`,
    'PUT' // Or 'PATCH', depending on your API's convention
  );

  const [areaDetails, setAreaDetails] = useState<Area | null>(data);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [editedDetails, setEditedDetails] = useState<Partial<Area> | null>(null);

  useEffect(() => {
    if (data) {
      setAreaDetails(data);
      console.log('this is datat', data);
    }
  }, [areaId, data, modal.open]);

  const onClose = () => {
    modal.closeModal();
    setIsEditing(false); // Reset edit mode on close
    setAreaDetails(null);
  };

  const handleEdit = () => {
    setIsEditing(true); // Enable edit mode
    setEditedDetails({ ...areaDetails });
  };

  const handleSave = async () => {
    try {
      // Validation: Ensure penWidth and penLength are positive numbers greater than zero
      if (
        (editedDetails?.penWidth !== undefined && editedDetails?.penWidth <= 0) ||
        (editedDetails?.penLength !== undefined && editedDetails?.penLength <= 0)
      ) {
        toast.error('Pen width and pen length must be positive numbers greater than zero.');
        return; // Stop saving if validation fails
      }

      // Validation: Ensure penWidth and penLength do not exceed area dimensions
      if (
        (editedDetails?.penWidth !== undefined &&
          editedDetails?.penWidth > (areaDetails?.width || 0)) ||
        (editedDetails?.penLength !== undefined &&
          editedDetails?.penLength > (areaDetails?.length || 0))
      ) {
        toast.error(
          `Pen dimensions cannot exceed the area's dimensions (Width: ${areaDetails?.width} m, Length: ${areaDetails?.length} m).`
        );
        return; // Stop saving if validation fails
      }

      // Validation: Ensure penWidth is smaller than or equal to penLength
      if (
        editedDetails?.penWidth !== undefined &&
        editedDetails?.penLength !== undefined &&
        editedDetails.penWidth > editedDetails.penLength
      ) {
        toast.error('Width of the pen must be smaller than or equal to the length of the pen.');
        return; // Stop saving if validation fails
      }

      // Optimistically update the local state
      setAreaDetails((prev) => ({ ...prev, ...editedDetails } as Area));

      // Use mutate to update SWR cache and trigger a revalidation
      const updatedArea = await trigger({
        params: areaId,
        body: editedDetails,
      });

      setAreaDetails(updatedArea.data);

      setIsEditing(false);
      // Trigger a re-fetch after successful update
      mutate();
      toast.success('Area updated successfully!');
      return updatedArea; // Return the updated data for SWR cache
    } catch (err) {
      toast.error('Error updating area. Please try again.');
      console.error('Error updating area:', err);
    }
  };

  const handleInputChange = (key: keyof Area, value: string | number) => {
    setEditedDetails((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <ModalComponent
        footer={
          isEditing ? (
            <>
              <Button onClick={handleSave} type='primary'>
                {t("Save")}
              </Button>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </>
          ) : (
            <Button onClick={handleEdit} type='primary'>
              {t("Edit")}
            </Button>
          )
        }
        open={modal.open}
        onCancel={onClose}
        title={t(`Area Details`)}
      >
        {areaDetails && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label='ID'>{areaDetails.areaId}</Descriptions.Item>
            <Descriptions.Item label={t('Name')}>
              {isEditing ? (
                <Input
                  value={editedDetails?.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              ) : (
                areaDetails.name
              )}
            </Descriptions.Item>
            <Descriptions.Item label={t('Description')}>
              {isEditing ? (
                <Input
                  value={editedDetails?.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              ) : (
                areaDetails.description
              )}
            </Descriptions.Item>
            <Descriptions.Item label={t('Length (m)')}>
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
            <Descriptions.Item label={t('Width (m)')}>
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
            <Descriptions.Item label={t('Pen Length')}>
              {isEditing ? (
                <Input
                  type='number'
                  value={editedDetails?.penLength || 0}
                  onChange={(e) => handleInputChange('penLength', Number(e.target.value))}
                />
              ) : (
                `${areaDetails.penLength} m`
              )}
            </Descriptions.Item>
            <Descriptions.Item label={t('Pen Width')}>
              {isEditing ? (
                <Input
                  type='number'
                  value={editedDetails?.penWidth || 0}
                  onChange={(e) => handleInputChange('penWidth', Number(e.target.value))}
                />
              ) : (
                `${areaDetails.penWidth} m`
              )}
            </Descriptions.Item>
            <Descriptions.Item label={t('Area Type')}>
              {isEditing ? (
                <Select
                  value={editedDetails?.areaType || ''}
                  onChange={(value) => handleInputChange('areaType', value)}
                  options={areaTypes}
                />
              ) : (
                areaTypes.find((type) => type.value === areaDetails.areaType)?.label
              )}
            </Descriptions.Item>
            <Descriptions.Item label={t('Created At')}>
              {new Date(areaDetails.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label={t('Updated At')}>
              {new Date(areaDetails.updatedAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </ModalComponent>
    </>
  );
};

export default ModalAreaDetail;
