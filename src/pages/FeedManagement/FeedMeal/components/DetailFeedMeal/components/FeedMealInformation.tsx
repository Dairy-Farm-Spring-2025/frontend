import { useTranslation } from 'react-i18next';
import DescriptionComponent, {
  DescriptionPropsItem,
} from '../../../../../../components/Description/DescriptionComponent';
import QuillRender from '../../../../../../components/UI/QuillRender';
import Title from '../../../../../../components/UI/Title';
import { FeedMeals } from '../../../../../../model/Feed/Feed';
import { formatStatusWithCamel } from '../../../../../../utils/format';

interface FeedMealInformationProps {
  data: FeedMeals;
}
const FeedMealInformation = ({ data }: FeedMealInformationProps) => {
  const { t } = useTranslation();
  const items: DescriptionPropsItem['items'] = [
    {
      label: t('Cow Type'),
      children: `${data?.cowTypeEntity?.name} - ${data?.cowTypeEntity?.maxWeight}`,
      span: 3,
    },
    {
      label: t('Cow Status'),
      children: formatStatusWithCamel(data?.cowStatus),
      span: 3,
    },
    {
      label: t('Shift'),
      children: formatStatusWithCamel(data?.shift),
      span: 3,
    },
  ];
  return (
    <div className="p-2">
      <Title className="text-xl mb-5">{t('Feed meal information')}:</Title>
      <div className="flex gap-5 w-full">
        <DescriptionComponent
          className="w-2/5 !h-fit"
          items={items}
          layout="horizontal"
        />
        <div className="!h-full w-3/5">
          <QuillRender description={data?.description} />
        </div>{' '}
      </div>
    </div>
  );
};

export default FeedMealInformation;
