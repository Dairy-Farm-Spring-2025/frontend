import React, { useState } from 'react';
import { Table, Tabs } from 'antd';
import useFetcher from '../../../../hooks/useFetcher';
import { CowPen } from '../../../../model/CowPen/CowPen';
import MoveCowToPenForm from './components/MoveCowToPenForm';

const { TabPane } = Tabs;

const columns = [
  { title: 'Cow Name', dataIndex: ['cowEntity', 'name'], key: 'cowName' },
  { title: 'Pen Name', dataIndex: ['penEntity', 'name'], key: 'penName' },
  { title: 'Pen Type', dataIndex: ['penEntity', 'penType'], key: 'penType' },
  { title: 'Cow Status', dataIndex: ['cowEntity', 'cowStatus'], key: 'cowStatus' },
  { title: 'Pen Status', dataIndex: ['penEntity', 'penStatus'], key: 'penStatus' },
];

export const MoveCowManagement: React.FC = () => {
  const { data: cowPenData } = useFetcher<any>('cow-pens', 'GET');
  const [selectedCow, setSelectedCow] = useState<string | null>(null);
  const [selectedPen, setSelectedPen] = useState<string | null>(null);

  const handleMove = () => {
    if (selectedCow && selectedPen) {
      console.log(`Moving Cow ${selectedCow} to Pen ${selectedPen}`);
      // Add API call here
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
        <Table
          dataSource={cowPenData}
          columns={columns}
          rowKey={(record) => record.cowEntity.cowId.toString()}
        />{' '}
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
