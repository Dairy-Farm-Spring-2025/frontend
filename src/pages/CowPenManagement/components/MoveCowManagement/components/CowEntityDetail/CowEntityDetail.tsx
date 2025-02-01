import React from 'react';
import { Descriptions } from 'antd';
import Title from 'antd/es/typography/Title';

interface CowEntityDetailProps {
  cowEntity: {
    cowId: number;
    name: string;
    cowStatus: string;
    dateOfBirth: string;
    dateOfEnter: string;
    dateOfOut: string | null;
    description: string;
    cowOrigin: string;
    gender: string;
    cowTypeEntity: {
      cowTypeId: number;
      name: string;
      description: string;
      status: string;
    };
  };
}

const CowEntityDetail: React.FC<CowEntityDetailProps> = ({ cowEntity }) => {
  return (
    <div className='w-1/2'>
      <Title level={3}>Cow Details</Title>
      <Descriptions bordered column={1}>
        <Descriptions.Item label='ID'>{cowEntity.cowId}</Descriptions.Item>
        <Descriptions.Item label='Name'>{cowEntity.name}</Descriptions.Item>
        <Descriptions.Item label='Status'>{cowEntity.cowStatus}</Descriptions.Item>
        <Descriptions.Item label='Date of Birth'>{cowEntity.dateOfBirth}</Descriptions.Item>
        <Descriptions.Item label='Date of Enter'>{cowEntity.dateOfEnter}</Descriptions.Item>
        <Descriptions.Item label='Date of Out'>{cowEntity.dateOfOut || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label='Description'>{cowEntity.description}</Descriptions.Item>
        <Descriptions.Item label='Origin'>{cowEntity.cowOrigin}</Descriptions.Item>
        <Descriptions.Item label='Gender'>{cowEntity.gender}</Descriptions.Item>
        <Descriptions.Item label='Cow Type'>{cowEntity.cowTypeEntity.name}</Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default CowEntityDetail;
