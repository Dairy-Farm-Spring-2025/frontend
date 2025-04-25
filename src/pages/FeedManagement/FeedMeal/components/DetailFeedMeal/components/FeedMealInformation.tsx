import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DescriptionComponent, {
  DescriptionPropsItem,
} from '../../../../../../components/Description/DescriptionComponent';
import QuillRender from '../../../../../../components/UI/QuillRender';
import Title from '../../../../../../components/UI/Title';
import { FeedMeals } from '../../../../../../model/Feed/Feed';
import { formatAreaType } from '../../../../../../utils/format';
import EditFeedMealInformation from './EditFeedMealInformation';
import ButtonComponent from '@components/Button/ButtonComponent';

interface FeedMealInformationProps {
  data: FeedMeals; // Non-nullable, as expected
  feedMealId: number;
  mutate?: () => void;
}

const FeedMealInformation = ({ data, feedMealId, mutate }: FeedMealInformationProps) => {
  const { t } = useTranslation();
  const [editVisible, setEditVisible] = useState(false);

  const items: DescriptionPropsItem['items'] = [
    {
      label: t('Status'),
      children: data.status ? t(data.status) : t('Unknown'),
      span: 3,
    },
    {
      label: t('Cow Type'),
      children: data.cowTypeEntity
        ? `${data.cowTypeEntity.name} - ${data.cowTypeEntity.maxWeight}`
        : t('Unknown'),
      span: 3,
    },
    {
      label: t('Cow Status'),
      children: data.cowStatus ? formatAreaType(t(data.cowStatus)) : t('Unknown'),
      span: 3,
    },
  ];

  const handleEditSuccess = () => {
    mutate?.();
    setEditVisible(false);
  };

  const handleEditCancel = () => {
    setEditVisible(false);
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-5">
        <Title className="text-xl">{t('Feed meal information')}:</Title>
        <ButtonComponent type="primary" onClick={() => setEditVisible(true)}>
          {t('Edit')}
        </ButtonComponent>
      </div>
      <div className="flex gap-5 w-full">
        <DescriptionComponent
          className="w-2/5 !h-fit"
          items={items}
          layout="horizontal"
        />
        <div className="!h-full w-3/5">
          <QuillRender description={data.description ?? ''} />
        </div>
      </div>

      <EditFeedMealInformation
        visible={editVisible}
        data={data}
        feedMealId={feedMealId}
        onCancel={handleEditCancel}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default FeedMealInformation;