import React from 'react';
import { Descriptions, Input, Select } from 'antd';
import { PenEntity } from '../../../../../../model/CowPen/CowPen';
import Title from 'antd/es/typography/Title';
import { getLabelByValue } from '../../../../../../utils/getLabel';
import { areaType } from '../../../../../../service/data/areaType';

interface PenEntityDetailProps {
  penEntity: PenEntity;
  isEditing: boolean;
  editedDetails: Partial<{
    name: string;
    description: string;
    penType: string;
    penStatus: string;
  }>;
  handleInputChange: (key: string, value: string | number) => void;
  penTypes: { label: string; value: string }[];
  penStatuses: { label: string; value: string }[];
}

const PenEntityDetail: React.FC<PenEntityDetailProps> = ({
  penEntity,
  isEditing,
  editedDetails,
  handleInputChange,
  penTypes,
  penStatuses,
}) => {
  return (
    <div className='w-1/2'>
      <Title level={3}>Pen Details</Title>
      <Descriptions bordered column={1}>
        <Descriptions.Item label='ID'>{penEntity.penId}</Descriptions.Item>
        <Descriptions.Item label='Name'>
          {isEditing ? (
            <Input
              value={editedDetails?.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          ) : (
            penEntity.name
          )}
        </Descriptions.Item>
        <Descriptions.Item label='Description'>
          {isEditing ? (
            <Input
              value={editedDetails?.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          ) : (
            penEntity.description
          )}
        </Descriptions.Item>
        <Descriptions.Item label='Pen Type'>
          {isEditing ? (
            <Select
              value={editedDetails?.penType || ''}
              onChange={(value) => handleInputChange('penType', value)}
              options={penTypes}
            />
          ) : (
            penTypes.find((type) => type.value === penEntity.penType)?.label
          )}
        </Descriptions.Item>
        <Descriptions.Item label='Pen Status'>
          {isEditing ? (
            <Select
              value={editedDetails?.penStatus || ''}
              onChange={(value) => handleInputChange('penStatus', value)}
              options={penStatuses}
            />
          ) : (
            penStatuses.find((status) => status.value === penEntity.penStatus)?.label
          )}
        </Descriptions.Item>
        <Descriptions.Item label='Area Belong To'>{penEntity.areaBelongto?.name}</Descriptions.Item>
        <Descriptions.Item label='Area Type'>
          {getLabelByValue(penEntity.areaBelongto?.areaType, areaType)}
        </Descriptions.Item>
        <Descriptions.Item label='Area Description'>
          {penEntity.areaBelongto?.description}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default PenEntityDetail;
