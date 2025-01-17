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
import ButtonComponent from '../../components/Button/ButtonComponent';

const areaTypes: { label: string; value: AreaType }[] = [
  { label: 'Cow Housing', value: 'cowHousing' },
  { label: 'Milking Parlor', value: 'milkingParlor' },
  { label: 'Warehouse', value: 'warehouse' },
];

const AreaManagement: React.FC = () => {
  const { data, isLoading, mutate } = useFetcher<any>('areas', 'GET');
  const [areaId, setAreaId] = React.useState<number>(0);
  const modalCreate = useModal();
  const modalViewDetail = useModal();

  const handleOpenEdit = (record: any) => {
    setAreaId(record.areaId);
    modalViewDetail.openModal();
  };

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
          <ButtonComponent onClick={() => handleOpenEdit(record)}>View Detail</ButtonComponent>
        </div>
      ),
    },
  ];

  return (
    <WhiteBackground>
      <ModalCreateArea modal={modalCreate} mutate={mutate} />
      <ModalAreaDetail modal={modalViewDetail} areaId={areaId} />
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
