import React from 'react';
import useFetcher from '../../hooks/useFetcher';
import useModal from '../../hooks/useModal';
import TableComponent, { Column } from '../../components/Table/TableComponent';
import WhiteBackground from '../../components/UI/WhiteBackground';
import { Divider } from 'antd';
import { formatSTT } from '../../utils/format';
import ModalCreateArea from './components/ModalCreateArea/ModalCreateArea';
import { AreaType } from '../../model/Area/AreaType';
import ModalAreaDetail from './components/ModalAreaDetail/ModalAreaDetail';

const areaTypes: { label: string; value: AreaType }[] = [
  { label: 'Cow Housing', value: 'cowHousing' },
  { label: 'Milking Parlor', value: 'milkingParlor' },
  { label: 'Warehouse', value: 'wareHouse' },
];

const AreaManagement: React.FC = () => {
  const { data, isLoading, mutate } = useFetcher<any>('areas', 'GET');
  const modalCreate = useModal();
  const modalViewDetail = useModal();

  const columns: Column[] = [
    {
      dataIndex: 'areaId',
      key: 'areaId',
      title: '#',
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: 'Name',
    },
    {
      dataIndex: 'description',
      key: 'description',
      title: 'Description',
    },
    {
      dataIndex: 'length',
      key: 'length',
      title: 'Length (m)',
    },
    {
      dataIndex: 'width',
      key: 'width',
      title: 'Width (m)',
    },
    {
      dataIndex: 'areaType',
      key: 'areaType',
      title: 'Area Type',
      render: (value: AreaType) => {
        const type = areaTypes.find((type) => type.value === value);
        return type ? type.label : value;
      },
    },
    {
      dataIndex: 'action',
      key: 'action',
      title: 'Action',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ModalAreaDetail modal={modalViewDetail} areaId={record.areaId} />
        </div>
      ),
    },
  ];

  return (
    <WhiteBackground>
      <ModalCreateArea modal={modalCreate} mutate={mutate} />
      <Divider className='my-4' />
      <TableComponent
        columns={columns}
        dataSource={data ? formatSTT(data) : []}
        loading={isLoading}
      />
    </WhiteBackground>
  );
};

export default AreaManagement;
