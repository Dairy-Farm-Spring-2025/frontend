import { formatDate } from '@fullcalendar/core/index.js';
import { Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import ButtonComponent from '../../../../../../../components/Button/ButtonComponent';
import TableComponent, {
  Column,
} from '../../../../../../../components/Table/TableComponent';
import useFetcher from '../../../../../../../hooks/useFetcher';
// import PopconfirmComponent from '../../../../../../../components/Popconfirm/PopconfirmComponent';
import TagComponents from '@components/UI/TagComponents';
import { formatStatusWithCamel } from '@utils/format';
import { useTranslation } from 'react-i18next';
import AnimationAppear from '../../../../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../../../../components/UI/WhiteBackground';

const ListExports = () => {
  const navigate = useNavigate();
  // const toast = useToast();
  const { data, isLoading } = useFetcher<any[] | []>('export_items', 'GET');
  // const { isLoading: deleteLoading, trigger } = useFetcher(`export_items/delete`, 'DELETE');
  // const { isLoading: updateLoading, trigger: triggerUpdate } = useFetcher(
  //   'export_items/update',
  //   'PUT'
  // );
  // const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const { t } = useTranslation();
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
      dataIndex: 'quantity',
      key: 'quantity',
      title: t('Quantity'),
      render: (data) => `${data}`,
    },
    {
      dataIndex: 'itemBatchEntity',
      key: 'itemBatchEntity',
      title: t('Item Details'),
      render: (data) => (
        <div>
          <div>{data?.itemEntity?.name}</div>
          <div className="text-sm text-gray-500">
            {data?.itemEntity?.categoryEntity?.name}
          </div>
        </div>
      ),
    },
    {
      dataIndex: 'itemBatchEntity',
      key: 'warehouseLocation',
      title: t('Storage Location'),
      render: (data) => data?.itemEntity?.warehouseLocationEntity?.name,
    },
    {
      dataIndex: 'itemBatchEntity',
      key: 'expiryDate',
      title: t('Expiry Date'),
      render: (data) =>
        data?.expiryDate ? formatDate(data.expiryDate) : 'N/A',
    },
    {
      dataIndex: 'exportDate',
      key: 'exportDate',
      title: t('Export Date'),
      render: (data) => formatDate(data),
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: t('Status'),
      render: (data) => (
        <TagComponents>{t(formatStatusWithCamel(data))}</TagComponents>
      ),
    },
    {
      dataIndex: 'received',
      key: 'received',
      title: t('Received'),
      render: (data) => (data ? t('Yes') : t('No')),
    },
    {
      dataIndex: 'exportItemId',
      key: 'action',
      title: t('Action'),
      render: (data) => (
        <div className="flex gap-4">
          <ButtonComponent type="primary" onClick={() => navigate(`${data}`)}>
            {t('View Detail')}
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
        <div className="flex justify-between items-center mb-4">
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
        <Divider className="!my-4" />
        <TableComponent
          columns={column}
          dataSource={data || []}
          loading={isLoading}
        />
        {/* <CreateExportModal modal={modal} mutate={mutate} /> */}
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ListExports;
