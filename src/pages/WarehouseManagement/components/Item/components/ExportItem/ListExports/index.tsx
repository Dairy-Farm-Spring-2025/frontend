import { useState } from 'react';
import { formatDate } from '@fullcalendar/core/index.js';
import { Divider, Dropdown, Menu, Pagination, Tag, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import useToast from '../../../../../../../hooks/useToast';
import useFetcher from '../../../../../../../hooks/useFetcher';
import useModal from '../../../../../../../hooks/useModal';
import TableComponent, { Column } from '../../../../../../../components/Table/TableComponent';
import SelectComponent from '../../../../../../../components/Select/SelectComponent';
import ButtonComponent from '../../../../../../../components/Button/ButtonComponent';
// import PopconfirmComponent from '../../../../../../../components/Popconfirm/PopconfirmComponent';
import AnimationAppear from '../../../../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../../../../components/UI/WhiteBackground';
import { EXPORT_STATUS_OPTIONS } from '../../../../../../../service/data/exportStatus';
import { Key } from 'antd/es/table/interface';

const ListExports = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { data, isLoading, mutate } = useFetcher<any[] | []>('export_items', 'GET');
  // const { isLoading: deleteLoading, trigger } = useFetcher(`export_items/delete`, 'DELETE');
  const { isLoading: updateLoading, trigger: triggerUpdate } = useFetcher(
    'export_items/update',
    'PUT'
  );
  const modal = useModal();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  // const isBulkActionDisabled =
  //   selectedRowKeys.length === 0 ||
  //   (Array.isArray(data) &&
  //     data.some(
  //       (item: any) => selectedRowKeys.includes(item.exportItemId) && item.status !== 'pending'
  //     ));

  // Handle bulk actions
  // const handleBulkAction = async (action: string) => {
  //   try {
  //     // Validate selected items
  //     const selectedItems =
  //       Array.isArray(data) &&
  //       data?.filter((item: any) => selectedRowKeys.includes(item.exportItemId));
  //     const hasNonPendingItems =
  //       Array.isArray(selectedItems) &&
  //       selectedItems.some((item: any) => item.status !== 'pending');

  //     if (hasNonPendingItems) {
  //       toast.showError('Bulk actions can only be performed on items with "pending" status.');
  //       return;
  //     }

  //     // Proceed with the bulk action
  //     const response = await triggerUpdate({
  //       url: `export_items/bulk/${action}`,
  //       data: { ids: selectedRowKeys },
  //     });

  //     toast.showSuccess(response.message);
  //     mutate();
  //     setSelectedRowKeys([]); // Clear selection
  //   } catch (error: any) {
  //     toast.showError(error.message);
  //   }
  // };

  // Handle individual actions
  const handleAction = async (id: number, action: string) => {
    try {
      const response = await triggerUpdate({
        url: `export_items/${action}/${id}`,
      });
      toast.showSuccess(response.message);
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  // Bulk action menu
  // const bulkActionMenu = (
  //   <Menu onClick={({ key }) => handleBulkAction(key)}>
  //     <Menu.Item key='approve'>Approve Selected</Menu.Item>
  //     <Menu.Item key='reject'>Reject Selected</Menu.Item>
  //     <Menu.Item key='cancel'>Cancel Selected</Menu.Item>
  //     <Menu.Item key='export'>Export Selected</Menu.Item>
  //   </Menu>
  // );

  // Columns for the table
  const column: Column[] = [
    {
      dataIndex: 'exportItemId',
      key: 'exportItemId',
      title: '#',
      render: (_, __, index) => index + 1,
    },
    {
      dataIndex: 'quantity',
      key: 'quantity',
      title: 'Quantity',
      render: (data) => `${data} liters`,
    },
    {
      dataIndex: 'itemBatchEntity',
      key: 'itemBatchEntity',
      title: 'Item Details',
      render: (data) => (
        <div>
          <div>{data?.itemEntity?.name}</div>
          <div className='text-sm text-gray-500'>{data?.itemEntity?.categoryEntity?.name}</div>
        </div>
      ),
    },
    {
      dataIndex: 'itemBatchEntity',
      key: 'warehouseLocation',
      title: 'Warehouse Location',
      render: (data) => data?.itemEntity?.warehouseLocationEntity?.name,
    },
    {
      dataIndex: 'itemBatchEntity',
      key: 'expiryDate',
      title: 'Expiry Date',
      render: (data) => (data?.expiryDate ? formatDate(data.expiryDate) : 'N/A'),
    },
    {
      dataIndex: 'exportDate',
      key: 'exportDate',
      title: 'Export Date',
      render: (data) => formatDate(data),
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: 'Status',
      render: (data, record) => {
        // Only show SelectComponent if status is NOT "cancel"
        if (data == 'pending') {
          return (
            <SelectComponent
              className='w-full'
              options={EXPORT_STATUS_OPTIONS}
              defaultValue={data}
              onChange={(value) => handleAction(record?.exportItemId, value)}
              loading={updateLoading}
            />
          );
        }

        // Show simple text when status is "cancel"
        return <Tag color='red'>{data}</Tag>;
      },
    },
    {
      dataIndex: 'received',
      key: 'received',
      title: 'Received',
      render: (data) => (data ? 'Yes' : 'No'),
    },
    {
      dataIndex: 'exportItemId',
      key: 'action',
      title: 'Action',
      render: (data) => (
        <div className='flex gap-4'>
          <ButtonComponent type='primary' onClick={() => navigate(`${data}`)}>
            View Detail
          </ButtonComponent>
          {/* <PopconfirmComponent
            title='Are you sure to delete this export?'
            onConfirm={() => handleDeleteExport(data)}
          >
            <ButtonComponent type='primary' danger loading={deleteLoading}>
              Delete
            </ButtonComponent>
          </PopconfirmComponent> */}
        </div>
      ),
    },
  ];

  return (
    <AnimationAppear>
      <WhiteBackground>
        <div className='flex justify-between items-center mb-4'>
          <ButtonComponent type='primary' onClick={modal.openModal}>
            Create Export
          </ButtonComponent>
          {/* <Tooltip
            title={
              isBulkActionDisabled
                ? 'Bulk actions can only be performed on items with "pending" status.'
                : ''
            }
          >
            <Dropdown overlay={bulkActionMenu} disabled={isBulkActionDisabled}>
              <ButtonComponent type='primary'>Bulk Actions</ButtonComponent>
            </Dropdown>
          </Tooltip> */}
        </div>
        <Divider className='!my-4' />
        <TableComponent
          columns={column}
          dataSource={data}
          loading={isLoading}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
        />
        {/* <CreateExportModal modal={modal} mutate={mutate} /> */}
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ListExports;
