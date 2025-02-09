import { formatDate } from '@fullcalendar/core/index.js';
import TableComponent, {
  Column,
} from '../../../../../../../../components/Table/TableComponent';
import AnimationAppear from '../../../../../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../../../../../components/UI/WhiteBackground';
import useFetcher from '../../../../../../../../hooks/useFetcher';
import { ItemBatch } from '../../../../../../../../model/Warehouse/itemBatch';
import { Item } from '../../../../../../../../model/Warehouse/items';
import { Supplier } from '../../../../../../../../model/Warehouse/supplier';
import ButtonComponent from '../../../../../../../../components/Button/ButtonComponent';
import { Divider } from 'antd';
import useModal from '../../../../../../../../hooks/useModal';
import CreateItemBatchModal from './components/CreateItemBatchModal';
import { useNavigate } from 'react-router-dom';

const ListItemBatch = () => {
  const navigate = useNavigate();
  const { data, isLoading, mutate } = useFetcher<ItemBatch[]>(
    'itembatchs',
    'GET'
  );
  const modal = useModal();
  const column: Column[] = [
    {
      dataIndex: 'itemBatchId',
      key: 'itemBatchId',
      title: '#',
      render: (_, __, index) => index + 1,
    },
    {
      dataIndex: 'quantity',
      key: 'quantity',
      title: 'Quantity',
    },
    {
      dataIndex: 'importDate',
      key: 'importDate',
      title: 'Import Date',
      render: (data) => formatDate(data),
    },
    {
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      title: 'Expired Date',
      render: (data) => (data ? formatDate(data) : 'Not Yet'),
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: 'Status',
    },
    {
      dataIndex: 'itemEntity',
      key: 'itemEntity',
      title: 'Item',
      render: (data: Item) => data?.name,
    },
    {
      dataIndex: 'supplierEntity',
      key: 'supplierEntity',
      title: 'Supplier',
      render: (data: Supplier) => data?.name,
    },
    {
      dataIndex: 'itemBatchId',
      key: 'action',
      title: 'Action',
      render: (data) => (
        <ButtonComponent type="primary" onClick={() => navigate(`${data}`)}>
          View Detail
        </ButtonComponent>
      ),
    },
  ];
  return (
    <AnimationAppear>
      <WhiteBackground>
        <ButtonComponent type="primary" onClick={modal.openModal}>
          Create Item Batch
        </ButtonComponent>
        <Divider className="!my-4" />
        <TableComponent
          columns={column}
          dataSource={data as ItemBatch[]}
          loading={isLoading}
        />
        <CreateItemBatchModal modal={modal} mutate={mutate} />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ListItemBatch;
