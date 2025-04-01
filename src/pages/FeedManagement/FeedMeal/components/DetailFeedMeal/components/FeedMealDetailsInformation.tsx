import { List } from 'antd';
import { useTranslation } from 'react-i18next';
import DescriptionComponent from '@components/Description/DescriptionComponent';
import ListComponent from '@components/List/ListComponent';
import Title from '@components/UI/Title';
import { FeedMealDetails } from '@model/Feed/Feed';
import useFetcher from '@hooks/useFetcher';
import { Item } from '@model/Warehouse/items';
import AddDetail from './AddDetail';

interface FeedMealDetailsInformationProps {
  detailData: FeedMealDetails[];
  feedMealId: number; // Add feedMealId prop
  mutate: () => void; // Add mutate prop
}

const FeedMealDetailsInformation = ({
  detailData,
  feedMealId,
  mutate,
}: FeedMealDetailsInformationProps) => {
  const { t } = useTranslation();

  // Fetch items for the dropdown in AddDetail
  const { data: items, isLoading: isLoadingItems } = useFetcher<Item[]>('items', 'GET');

  const filteredHay = detailData?.filter(
    (element) => element?.itemEntity?.categoryEntity?.name === 'Cỏ Khô'
  );
  const filteredRefined = detailData?.filter(
    (element) => element?.itemEntity?.categoryEntity?.name === 'Thức ăn tinh'
  );
  const filteredSilage = detailData?.filter(
    (element) => element?.itemEntity?.categoryEntity?.name === 'Thức ăn ủ chua'
  );
  const filteredMineral = detailData?.filter(
    (element) => element?.itemEntity?.categoryEntity?.name === 'Khoáng chất'
  );

  const calculateTotalQuantity = (array: any[]) => {
    const total = array?.reduce(
      (total, item) => total + (item?.quantity || 0),
      0
    );
    return total ? total.toFixed(2) : 0;
  };

  const handleAddClick = () => {
    // Optional: Add any logic needed when "Add more" is clicked
  };

  return (
    <div className="p-2">
      <Title className="text-xl mb-5">{t('Feed meal details')}:</Title>
      <div className="grid grid-cols-2 gap-5">
        {/* Hay */}
        <ListComponent
          header={<Title className="font-black text-xl">{t('hay')}</Title>}
          dataSource={filteredHay}
          renderItem={(items: FeedMealDetails, index) => (
            <List.Item key={index}>
              <DescriptionComponent
                className="!shadow-md"
                items={[
                  {
                    label: t('Item'),
                    children: items?.itemEntity?.name,
                  },
                  {
                    label: t('Quantity'),
                    children: `${items?.quantity} (kilogram)`,
                  },
                ]}
              />
            </List.Item>
          )}
          footer={
            <div>
              <p className="text-base">
                {t('Total')}:{' '}
                <span className="font-bold text-orange-600">
                  {calculateTotalQuantity(filteredHay)} (kilogram)
                </span>
              </p>
              <AddDetail
                feedMealId={feedMealId}
                category="Cỏ Khô"
                items={items || []}
                isLoadingItems={isLoadingItems}
                mutate={mutate}
                onAddClick={handleAddClick}
              />
            </div>
          }
        />
        {/* Refined */}
        <ListComponent
          header={<Title className="font-black text-xl">{t('refined')}</Title>}
          dataSource={filteredRefined}
          renderItem={(items: FeedMealDetails, index) => (
            <List.Item key={index}>
              <DescriptionComponent
                items={[
                  {
                    label: t('Item'),
                    children: items?.itemEntity?.name,
                  },
                  {
                    label: t('Quantity'),
                    children: `${items?.quantity} (kilogram)`,
                  },
                ]}
              />
            </List.Item>
          )}
          footer={
            <div>
              <p className="text-base">
                {t('Total')}:{' '}
                <span className="font-bold text-orange-600">
                  {calculateTotalQuantity(filteredRefined)} (kilogram)
                </span>
              </p>
              <AddDetail
                feedMealId={feedMealId}
                category="Thức ăn tinh"
                items={items || []}
                isLoadingItems={isLoadingItems}
                mutate={mutate}
                onAddClick={handleAddClick}
              />
            </div>
          }
        />
        {/* Silage */}
        <ListComponent
          header={<Title className="font-black text-xl">{t('silage')}</Title>}
          dataSource={filteredSilage}
          renderItem={(items: FeedMealDetails, index) => (
            <List.Item key={index}>
              <DescriptionComponent
                items={[
                  {
                    label: t('Item'),
                    children: items?.itemEntity?.name,
                  },
                  {
                    label: t('Quantity'),
                    children: `${items?.quantity} (kilogram)`,
                  },
                ]}
              />
            </List.Item>
          )}
          footer={
            <div>
              <p className="text-base">
                {t('Total')}:{' '}
                <span className="font-bold text-orange-600">
                  {calculateTotalQuantity(filteredSilage)} (kilogram)
                </span>
              </p>
              <AddDetail
                feedMealId={feedMealId}
                category="Thức ăn ủ chua"
                items={items || []}
                isLoadingItems={isLoadingItems}
                mutate={mutate}
                onAddClick={handleAddClick}
              />
            </div>
          }
        />
        {/* Minerals */}
        <ListComponent
          header={<Title className="font-black text-xl">{t('minerals')}</Title>}
          dataSource={filteredMineral}
          renderItem={(items: FeedMealDetails, index) => (
            <List.Item key={index}>
              <DescriptionComponent
                items={[
                  {
                    label: t('Item'),
                    children: items?.itemEntity?.name,
                  },
                  {
                    label: t('Quantity'),
                    children: `${items?.quantity} (kilogram)`,
                  },
                ]}
              />
            </List.Item>
          )}
          footer={
            <div>
              <p className="text-base">
                {t('Total')}:{' '}
                <span className="font-bold text-orange-600">
                  {calculateTotalQuantity(filteredMineral)} (kilogram)
                </span>
              </p>
              <AddDetail
                feedMealId={feedMealId}
                category="Khoáng chất"
                items={items || []}
                isLoadingItems={isLoadingItems}
                mutate={mutate}
                onAddClick={handleAddClick}
              />
            </div>
          }
        />
      </div>
      <p className="text-xl mt-5">
        {t('Total feed meal details quantity')}:{' '}
        <span className="font-bold text-orange-600">
          {calculateTotalQuantity(detailData)} (kilogram)
        </span>
      </p>
    </div>
  );
};

export default FeedMealDetailsInformation;