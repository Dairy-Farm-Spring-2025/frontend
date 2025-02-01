import React, { useState } from 'react';
import { Tabs, Modal, Tag } from 'antd';
import useFetcher from '../../../../hooks/useFetcher';
import { CowPen } from '../../../../model/CowPen/CowPen';
import MoveCowToPenForm from './components/MoveCowToPenForm';
import TableComponent, { Column } from '../../../../components/Table/TableComponent';
import useModal from '../../../../hooks/useModal';
import ModalPenDetail from './components/PenEntityDetail/ModalPenDetail';
import ButtonComponent from '../../../../components/Button/ButtonComponent';

const { TabPane } = Tabs;
const { confirm } = Modal;

export const MoveCowManagement: React.FC = () => {
  const { data: cowPenData, mutate } = useFetcher<any>('cow-pens', 'GET');
  const [selectedCow, setSelectedCow] = useState<string | null>(null);
  const [selectedPen, setSelectedPen] = useState<string | null>(null);
  const [penId, setPenId] = React.useState<number>(0);
  const modal = useModal();
  const handleOpenEdit = (record: any) => {
    if (record.penEntity) {
      setPenId(record.penEntity.penId);
      console.log(record);
      modal.openModal();
    } else {
      console.error('penEntity is undefined in the record:', record);
    }
  };

  const columns: Column[] = [
    {
      title: 'Cow Name',
      dataIndex: ['cowEntity', 'name'],
      key: 'cowName',
      sorter: (a, b) => a.cowEntity.name.localeCompare(b.cowEntity.name),
      searchable: true,
    },
    {
      title: 'Pen Name',
      dataIndex: ['penEntity', 'name'],
      key: 'penName',
      sorter: (a, b) => a.penEntity.name.localeCompare(b.penEntity.name),
      searchable: true,
    },
    {
      title: 'Pen Type',
      dataIndex: ['penEntity', 'penType'],
      key: 'penType',
      searchable: true,
    },
    {
      title: 'Cow Status',
      dataIndex: ['cowEntity', 'cowStatus'],
      key: 'cowStatus',
      render: (status: string) => (
        <Tag color={status === 'healthy' ? 'green' : 'red'}>{status}</Tag>
      ),
      searchable: true,
    },
    {
      title: 'Pen Status',
      dataIndex: ['penEntity', 'penStatus'],
      key: 'penStatus',
      render: (status: string) => (
        <Tag color={status === 'occupied' ? 'red' : 'green'}>{status}</Tag>
      ),
      searchable: true,
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ButtonComponent onClick={() => handleOpenEdit(record)}>View Detail</ButtonComponent>
        </div>
      ),
    },
  ];

  const handleMove = () => {
    if (selectedCow && selectedPen) {
      confirm({
        title: 'Are you sure you want to move this cow?',
        content: 'This action will move the selected cow to the chosen pen.',
        onOk() {
          console.log(`Moving Cow ${selectedCow} to Pen ${selectedPen}`);
          // Add API call here
        },
        onCancel() {
          console.log('Move canceled');
        },
      });
    } else {
      alert('Please select both a cow and a pen.');
    }
  };

  const availablePens =
    cowPenData?.filter((item: CowPen) => item.penEntity.penStatus !== 'occupied') ?? [];

  return (
    <Tabs defaultActiveKey='1'>
      {/* Tab 1: View Data */}
      <TabPane tab='View Cows & Pens' key='1'>
        {penId != 0 && <ModalPenDetail penId={penId} modal={modal} mutate={mutate} />}
        <TableComponent
          columns={columns}
          dataSource={cowPenData}
          rowKey={(record: any) => record.cowEntity.id}
          onRow={(record: any) => ({
            onClick: () => setSelectedCow(record.cowEntity.id),
          })}
        />
      </TabPane>

      {/* Tab 2: Move Cow to Pen */}
      <TabPane tab='Move Cow to Pen' key='2'>
        <MoveCowToPenForm
          cowPenData={cowPenData}
          availablePens={availablePens}
          selectedCow={selectedCow}
          setSelectedCow={setSelectedCow}
          selectedPen={selectedPen}
          setSelectedPen={setSelectedPen}
          handleMove={handleMove}
        />
      </TabPane>
    </Tabs>
  );
};
