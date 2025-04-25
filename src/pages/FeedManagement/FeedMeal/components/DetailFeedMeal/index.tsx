import { useParams } from 'react-router-dom';
import useFetcher from '@hooks/useFetcher';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import { Divider, Spin, message } from 'antd';
import FeedMealInformation from './components/FeedMealInformation';
import {  FeedMeals } from '@model/Feed/Feed';
import Title from '@components/UI/Title';
import FeedMealDetailsInformation from './components/FeedMealDetailsInformation';
import { FEED_PATH } from '@service/api/Feed/feedApi';
import { useTranslation } from 'react-i18next';

const DetailFeedMeal = () => {
  const { t } = useTranslation();
  const { id } = useParams(); // id is string | undefined

  // Validate and convert id to number
  if (!id) {
    message.error(t('Missing feed meal ID in URL'));
    return null; // Optionally redirect or show an error page
  }

  const feedMealId = !isNaN(parseInt(id, 10)) ? parseInt(id, 10) : 0;
  if (feedMealId === 0) {
    message.error(t('Invalid feed meal ID in URL'));
    return null;
  }

  const { data: detailFeedMeal, isLoading, mutate } = useFetcher<FeedMeals>(
    FEED_PATH.DETAIL_FEED_MEALS(id), // id is now guaranteed to be a string
    'GET'
  );

  if (isLoading) {
    return (
      <AnimationAppear>
        <WhiteBackground>
          <Spin />
        </WhiteBackground>
      </AnimationAppear>
    );
  }

  if (!detailFeedMeal) {
    return (
      <AnimationAppear>
        <WhiteBackground>
          <div>{t('No data found')}</div>
        </WhiteBackground>
      </AnimationAppear>
    );
  }

  return (
    <AnimationAppear>
      <WhiteBackground>
        <div className="flex flex-col gap-5">
          <div>
            <Title>{detailFeedMeal.name ?? t('Unnamed Feed Meal')}</Title>
            <Divider className="!my-3" />
          </div>
          <FeedMealInformation
            data={detailFeedMeal} // detailFeedMeal is now guaranteed to be FeedMeals
            feedMealId={feedMealId}
            mutate={mutate}
          />
          <FeedMealDetailsInformation
            detailData={detailFeedMeal.feedMealDetails ?? []}
            feedMealId={feedMealId}
            mutate={mutate}
          />
        </div>
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default DetailFeedMeal;