import { useParams } from 'react-router-dom';
import AnimationAppear from '../../../../../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../../../../../components/UI/WhiteBackground';
import useFetcher from '../../../../../../../../hooks/useFetcher';
import { ItemBatch } from '../../../../../../../../model/Warehouse/itemBatch';
import { Spin } from 'antd';
import ItemBatchInformation from './components/ItemBatchInformation';

const DetailItemBatch = () => {
  const { id } = useParams();
  const { data, isLoading } = useFetcher<ItemBatch>(`itembatchs/${id}`, 'GET');
  if (isLoading) return <Spin />;
  return (
    <AnimationAppear>
      <WhiteBackground>
        <ItemBatchInformation data={data as ItemBatch} />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default DetailItemBatch;
