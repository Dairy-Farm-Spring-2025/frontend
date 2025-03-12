import { Divider } from 'antd';

import useFetcher from '../../../hooks/useFetcher';

import TableComponent, {
  Column,
} from '../../../components/Table/TableComponent';

import AnimationAppear from '../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../components/UI/WhiteBackground';

import React from 'react';
import { useTranslation } from 'react-i18next';
import ButtonComponent from '../../../components/Button/ButtonComponent';
import useModal from '../../../hooks/useModal';
import { MilkBatch } from '../../../model/DailyMilk/MilkBatch';
import {
  formatAreaType,
  formatDateHour,
  formatSTT,
} from '../../../utils/format';
import CreateMilkBatchModal from './components/ModalCreateMilkBatch/CreateMilkBatchModal';
import ModalMilkBatchDetail from './components/ModalMilkBatchDetail';

const MilkBatchManagement = () => {
  const modalBatch = useModal();
  const { data, isLoading, mutate } = useFetcher<MilkBatch[]>(
    'MilkBatch',
    'GET'
  );
  console.log('check data: ', data);
  const modalViewDetail = useModal();
  const { t } = useTranslation();
  const [milkBatchId, setMilkBatchId] = React.useState<number>(0);

  const handleOpenEdit = (record: any) => {
    setMilkBatchId(record.milkBatchId);
    modalViewDetail.openModal();
  };

  // const handleDelete = async (milkBatchId: number) => {
  //   try {
  //     await fetch(`MilkBatch/${milkBatchId}`, {
  //       method: 'DELETE',
  //     });
  //     message.success('Milk batch deleted successfully!');
  //     mutate(); // Refresh the data
  //   } catch (error) {
  //     message.error('Failed to delete milk batch.');
  //     console.error(error);
  //   }
  // };
  const columns: Column[] = [
    {
      dataIndex: 'milkBatchId',
      key: 'milkBatchId',
      title: '#',
    },
    {
      dataIndex: 'totalVolume',
      key: 'totalVolume',
      title: t('Total Volume'),
    },
    {
      dataIndex: 'date',
      key: 'date',
      title: t('Date'),
      render: (data) => formatDateHour(data),
    },
    {
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      title: t('Expiry Date'),
      render: (data) => formatDateHour(data),
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: t('Status'),
      render: (data) => formatAreaType(data),
    },
    {
      dataIndex: 'action',
      key: 'action',
      title: t('Action'),
      render: (_, record) => (
        <div>
          <ButtonComponent onClick={() => handleOpenEdit(record)}>
            {t(' View Detail')}
          </ButtonComponent>
          <ButtonComponent
            danger
            onClick={() => console.log(record.milkBatchId)}
            style={{ marginLeft: 8 }}
          >
            {t('Delete')}
          </ButtonComponent>
        </div>
      ),
    },
  ];

  const openModalBatch = () => {
    modalBatch.openModal();
  };

  return (
    <AnimationAppear duration={0.5}>
      <WhiteBackground>
        <ModalMilkBatchDetail
          modal={modalViewDetail}
          milkBatchId={milkBatchId}
          mutate={mutate}
        />
        <CreateMilkBatchModal modal={modalBatch} mutate={mutate} />
        <ButtonComponent onClick={openModalBatch} type="primary">
          {t('Create Milk Batch')}
        </ButtonComponent>
        <Divider className="my-4" />
        <TableComponent
          columns={columns}
          dataSource={data ? formatSTT(data) : []}
          loading={isLoading}
        />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default MilkBatchManagement;
