import { message, Popconfirm, Button, Divider, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import Title from '@components/UI/Title';
import { FeedMealDetails } from '@model/Feed/Feed';
import useFetcher from '@hooks/useFetcher';
import { Item } from '@model/Warehouse/items';
import AddDetail from './AddDetail';
import EditDetail from './EditDetail';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import api from '@config/axios/axios';
import { useState, useCallback, useMemo } from 'react';
import TableComponent, { Column } from '@components/Table/TableComponent';

interface FeedMealDetailsInformationProps {
  detailData: FeedMealDetails[];
  feedMealId: number;
  mutate: () => void;
  feedMealData?: { cowStatus: string; status: string };
}

const FeedMealDetailsInformation = ({
  detailData = [],
  feedMealId,
  mutate,
  feedMealData,
}: FeedMealDetailsInformationProps) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<FeedMealDetails | null>(null);

  const { data: items = [], isLoading: isLoadingItems } = useFetcher<Item[]>('items', 'GET');

  // Nhóm dữ liệu theo category
  const groupedData = useMemo(() => {
    const categoryMap: { [key: string]: FeedMealDetails[] } = {};
    detailData.forEach((detail) => {
      const categoryName = detail.itemEntity?.categoryEntity?.name || 'Uncategorized';
      if (!categoryMap[categoryName]) {
        categoryMap[categoryName] = [];
      }
      categoryMap[categoryName].push(detail);
    });
    return categoryMap;
  }, [detailData]);

  const calculateTotalQuantity = useCallback((array: FeedMealDetails[]) => {
    const total = array.reduce((sum, item) => sum + (item.quantity || 0), 0);
    return total.toFixed(2);
  }, []);



  const toggleModal = useCallback((detail?: FeedMealDetails) => {
    setIsModalVisible((prev) => !prev);
    setSelectedDetail(detail || null);
  }, []);



  // Cột cho mỗi bảng con (chỉ có Name và Quantity)
  const columns: Column[] = [
    {
      title: t('Name'),
      dataIndex: 'itemEntity',
      key: 'itemEntity',
      render: (itemEntity) => itemEntity?.name || 'N/A',
    },
    {
      title: t('Quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => `${(quantity || 0).toFixed(2)} (${t('kilogram')})`,
      align: 'right',
    },

  ];

  // Lấy danh sách category và giới hạn tối đa 4 category
  const categories = Object.keys(groupedData).slice(0, 4);

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
      {/* Tiêu đề và nút thêm */}
      <div className="flex justify-between items-center mb-6">
        <Title className="text-xl font-semibold text-gray-800">
          {t('Feed meal details')}:
        </Title>
        <AddDetail
          feedMealId={feedMealId}
          category=""
          items={items}
          isLoadingItems={isLoadingItems}
          mutate={mutate}
        />
      </div>
      <Divider className="my-6 border-gray-200" />

      {/* Bố cục 4 bảng con với CSS Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {categories.map((categoryName) => {
          const items = groupedData[categoryName];
          const total = calculateTotalQuantity(items);

          return (
            <div key={categoryName} className="bg-white rounded-lg shadow-sm p-4">
              {/* Tiêu đề category và tổng số lượng */}
              <div className="flex justify-between items-center mb-3">
                <Title className="text-lg font-medium text-gray-700">
                  {categoryName}
                </Title>
                <span className="text-base font-semibold text-orange-600">
                  {t('Total')}: {total} ({t('kilogram')})
                </span>
              </div>

              {/* Bảng con */}
              <Table
                columns={columns}
                dataSource={items.map((item, index) => ({
                  ...item,
                  key: item.feedMealDetailId || index,
                }))}
                pagination={false}
                className="rounded-md overflow-hidden"
              />


            </div>
          );
        })}

        {/* Nếu không đủ 4 category, hiển thị placeholder */}
        {categories.length < 4 &&
          Array.from({ length: 4 - categories.length }).map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-center text-gray-500"
            >
              {t('No data')}
            </div>
          ))}
      </div>

      {/* Tổng số lượng toàn bộ */}
      <p className="text-xl font-medium text-gray-800">
        {t('Total feed meal details quantity')}:{' '}
        <span className="font-bold text-orange-600">
          {calculateTotalQuantity(detailData)} ({t('kilogram')})
        </span>
      </p>


    </div>
  );
};

export default FeedMealDetailsInformation;