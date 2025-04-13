import React, { useState } from 'react';
import { Tabs, Modal, Tag } from 'antd';
import useFetcher from '../../../../hooks/useFetcher';
import MoveCowToPenForm from './components/MoveCowToPen/MoveCowToPenForm';
import TableComponent, {
  Column,
} from '../../../../components/Table/TableComponent';
import useModal from '../../../../hooks/useModal';
import dayjs from 'dayjs';
import ModalPenDetail from './components/PenEntityDetail/ModalPenDetail';
import ButtonComponent from '../../../../components/Button/ButtonComponent';
import { getLabelByValue } from '../../../../utils/getLabel';
import { penStatus, penType } from '../../../../service/data/pen';
import { cowStatus } from '../../../../service/data/cowStatus';
import ListCowNotInPen from './components/ListCowNotInPen/ListCowNotInPen';
import { useTranslation } from 'react-i18next';

const { TabPane } = Tabs;
const { confirm } = Modal;

const MoveCowManagement: React.FC = () => {
  const { data: cowPenData, mutate } = useFetcher<any>('cow-pens', 'GET');
  const { data: availablePens } = useFetcher<any>('pens/available', 'GET');
  const { trigger } = useFetcher('cow-pens', 'POST');
  const { t } = useTranslation();
  const [selectedCow, setSelectedCow] = useState<string | null>(null);
  const [selectedPen, setSelectedPen] = useState<string | null>(null);
  const [penId, setPenId] = useState<number>(0);
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
      title: t('Cow Name'),
      dataIndex: ['cowEntity', 'name'] as any,
      key: 'cowName',
      sorter: (a, b) => a.cowEntity.name.localeCompare(b.cowEntity.name),
      searchable: true,
    },
    {
      title: t('In Pen Name'),
      dataIndex: ['penEntity', 'name'] as any,
      key: 'penName',
      searchable: true,
    },
    {
      title: t('Pen Type'),
      dataIndex: ['penEntity', 'penType'] as any,
      key: 'penType',
      render: (data) => getLabelByValue(data, penType),
      searchable: true,
    },
    {
      title: t('Cow Status'),
      dataIndex: ['cowEntity', 'cowStatus'] as any,
      key: 'cowStatus',
      render: (status: string) => (
        <Tag color={status === 'healthy' ? 'green' : 'red'}>
          {getLabelByValue(status, cowStatus())}
        </Tag>
      ),
      searchable: true,
    },
    {
      title: t('Pen Status'),
      dataIndex: ['penEntity', 'penStatus'] as any,
      key: 'penStatus',
      render: (status: string) => (
        <Tag color={status === 'occupied' ? 'red' : 'green'}>
          {getLabelByValue(status, penStatus)}
        </Tag>
      ),
      searchable: true,
    },
    {
      title: t('Action'),
      key: 'action',
      dataIndex: 'action',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ButtonComponent onClick={() => handleOpenEdit(record)}>
            View Detail
          </ButtonComponent>
        </div>
      ),
    },
  ];

  const handleMove = (
    fromDate: dayjs.Dayjs | null,
    toDate: dayjs.Dayjs | null
  ) => {
    if (selectedCow && selectedPen && fromDate) {
      confirm({
        title: t('Are you sure you want to move this cow?'),
        content: 'This action will move the selected cow to the chosen pen.',
        onOk() {
          console.log(
            `Moving Cow ${selectedCow} to Pen ${selectedPen} from ${fromDate?.format(
              'YYYY-MM-DD'
            )} to ${toDate?.format('YYYY-MM-DD')}`
          );

          // Add API call here
          trigger({
            body: {
              cowId: selectedCow,
              penId: selectedPen,
              fromDate: fromDate.format('YYYY-MM-DD'), // Ensure it's formatted correctly
              toDate: toDate ? toDate.format('YYYY-MM-DD') : null, // Handle optional toDate
            },
          });
          mutate();
        },
        onCancel() {
          console.log('Move canceled');
        },
      });
    } else {
      alert('Please select a cow, a pen, and a valid fromDate.');
    }
  };

  return (
    <Tabs defaultActiveKey="1">
      {/* Tab 1: View Data */}
      <TabPane tab="View Cows & Pens" key="1">
        {penId != 0 && <ModalPenDetail penId={penId} modal={modal} />}
        <TableComponent
          columns={columns}
          dataSource={cowPenData}
          rowKey={(record: any) => record.cowEntity.id}
          onRow={(record: any) => ({
            onClick: () => setSelectedCow(record.cowEntity.id),
          })}
        />
      </TabPane>

      <TabPane
        className="flex justify-center items-center"
        tab="Move Bulk to Pen"
        key="2"
      >
        <ListCowNotInPen mutate={mutate} availablePens={availablePens} />
      </TabPane>
      {/* Tab 2: Move Cow to Pen */}
      <TabPane
        className="flex justify-center items-center"
        tab="Move Cow to Pen"
        key="3"
      >
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

export default MoveCowManagement;
