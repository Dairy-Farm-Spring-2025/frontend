import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import TableComponent, { Column } from '@components/Table/TableComponent';
import Title from '@components/UI/Title';
import api from '@config/axios/axios';
import useFetcher from '@hooks/useFetcher';
import { FeedMealDetails } from '@model/Feed/Feed';
import { Item } from '@model/Warehouse/items';
import { Button, Divider, message, Popconfirm } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddDetail from './AddDetail';
import EditDetail from './EditDetail';

interface FeedMealDetailsInformationProps {
  detailData: FeedMealDetails[];
  feedMealId: number;
  mutate: () => void;
  feedMealData?: { cowStatus: string; status: string };
}

const FeedMealDetailsInformation = ({
  detailData,
  feedMealId,
  mutate,
}: FeedMealDetailsInformationProps) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<FeedMealDetails | null>(
    null
  );

  // Fetch items for the AddDetail component
  const { data: items, isLoading: isLoadingItems } = useFetcher<Item[]>(
    'items',
    'GET'
  );

  // Calculate total quantity for all items
  const calculateTotalQuantity = (array: any[]) => {
    const total = array?.reduce(
      (total, item) => total + (item?.quantity || 0),
      0
    );
    return total ? total.toFixed(2) : 0;
  };

  // Function to handle delete API call
  const handleDelete = async (feedMealDetailId: number) => {
    try {
      const response = await api.delete(`feedmeals/detail/${feedMealDetailId}`);
      if (response.status === 200) {
        message.success(t('Deleted successfully'));
        mutate();
      } else {
        message.error(t('Failed to delete'));
      }
    } catch (error) {
      console.error('Error deleting feed meal detail:', error);
      message.error(t('Error occurred while deleting'));
    }
  };

  // Function to open the edit modal
  const openEditModal = (detail: FeedMealDetails) => {
    setSelectedDetail(detail);
    setIsModalVisible(true);
  };

  // Function to close the edit modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedDetail(null);
  };

  // Function to handle successful edit
  const handleEditSuccess = () => {
    mutate(); // Refresh the data after a successful edit
  };

  // Function to handle the "Add" button click (no navigation, just a placeholder for AddDetail)
  const handleAddClick = () => {
    // This will be handled by AddDetail's internal logic
  };

  // Define columns for the TableComponent
  const columns: Column[] = [
    {
      title: t('Name'),
      dataIndex: 'itemEntity',
      key: 'itemEntity',
      render: (itemEntity) => itemEntity?.name || 'N/A',
      searchable: true, // Enable search for item name
    },
    {
      title: t('Cow Type'),
      dataIndex: 'itemEntity',
      key: 'category',
      render: (itemEntity) => itemEntity?.categoryEntity?.name || 'N/A',
      filterable: true,
      objectKeyFilter: 'categoryEntity.name', // Specify the nested path for filtering
      filterOptions: [
        { text: 'Cỏ Khô', value: 'Cỏ Khô' },
        { text: 'Thức ăn tinh', value: 'Thức ăn tinh' },
        { text: 'Thức ăn ủ chua', value: 'Thức ăn ủ chua' },
        { text: 'Khoáng chất', value: 'Khoáng chất' },
      ],
    },
    {
      title: t('Quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => quantity || '0',
      align: 'right',
    },
    {
      title: t('Unit'),
      dataIndex: 'itemEntity',
      key: 'unit',
      render: (itemEntity) => itemEntity?.unit || 'N/A',
    },
    {
      title: t('Actions'),
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record: FeedMealDetails) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            size="small"
            type="primary"
          />
          <Popconfirm
            title={t('Are you sure you want to delete this item?')}
            onConfirm={() => handleDelete(record.feedMealDetailId)}
            okText={t('Yes')}
            cancelText={t('No')}
            placement="topRight"
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-5">
        <Title className="text-xl">{t('Feed meal details')}:</Title>
        <AddDetail
          feedMealId={feedMealId}
          category=""
          items={items || []}
          isLoadingItems={isLoadingItems}
          mutate={mutate}
          onAddClick={handleAddClick}
        />
      </div>
      <Divider className="my-6" />
      <TableComponent
        columns={columns}
        dataSource={detailData}
        pagination={{ pageSize: 5 }}
      />
      <p className="text-xl mt-5">
        {t('Total feed meal details quantity')}:{' '}
        <span className="font-bold text-orange-600">
          {calculateTotalQuantity(detailData)} (kilogram)
        </span>
      </p>

      {/* Edit Modal Component */}
      <EditDetail
        visible={isModalVisible}
        detail={selectedDetail}
        onCancel={handleCancel}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default FeedMealDetailsInformation;
