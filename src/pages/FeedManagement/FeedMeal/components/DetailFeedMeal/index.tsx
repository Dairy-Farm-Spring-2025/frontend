import { useParams } from 'react-router-dom';
import useFetcher from '@hooks/useFetcher';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import { Divider, Spin } from 'antd';
import FeedMealInformation from './components/FeedMealInformation';
import { FeedMealDetails, FeedMeals } from '@model/Feed/Feed';
import Title from '@components/UI/Title';
import FeedMealDetailsInformation from './components/FeedMealDetailsInformation';
import { FEED_PATH } from '@service/api/Feed/feedApi';

const DetailFeedMeal = () => {
  const { id } = useParams();
  const { data: detailFeedMeal, isLoading: isLoading } = useFetcher<FeedMeals>(
    FEED_PATH.DETAIL_FEED_MEALS(id ? id : ''),
    'GET'
  );
  return (
    <AnimationAppear>
      <WhiteBackground>
        {isLoading ? (
          <Spin />
        ) : (
          <div className="flex flex-col gap-5">
            <div>
              <Title>{detailFeedMeal?.name}</Title>
              <Divider className="!my-3" />
            </div>
            <FeedMealInformation data={detailFeedMeal as FeedMeals} />
            <FeedMealDetailsInformation
              detailData={detailFeedMeal?.feedMealDetails as FeedMealDetails[]}
            />
          </div>
        )}
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default DetailFeedMeal;
