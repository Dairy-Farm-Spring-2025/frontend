import {
  FunnelPlotOutlined,
  PlusCircleOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import TabsComponent, {
  TabsItemProps,
} from '../../../../components/Tabs/TabsComponent';
import AnimationAppear from '../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../components/UI/WhiteBackground';
import DailyMilk from './TabsItem/DailyMilk';
import CowGeneralInformation from './TabsItem/GeneralInformation';
import useFetcher from '../../../../hooks/useFetcher';
import { DailyMilkModel } from '../../../../model/DailyMilk/DailyMilk';

const CowDetail = () => {
  const { id } = useParams();
  const {
    data: dataMilk,
    isLoading: isLoadingDaily,
    mutate: mutateDaily,
  } = useFetcher<DailyMilkModel[]>(`dailymilks/cow/${id}`, 'GET');
  const {
    data: dataDetail,
    isLoading: isLoadingDetail,
    mutate: mutateDetail,
  } = useFetcher<any>(`cows/${id}`, 'GET');
  const items: TabsItemProps['items'] = [
    {
      key: 'information',
      label: 'General Information',
      children: (
        <CowGeneralInformation
          id={id as string}
          dataDetail={dataDetail}
          isLoadingDetail={isLoadingDetail}
          mutateDetail={mutateDetail}
        />
      ),
      icon: <ProfileOutlined />,
    },
    {
      key: 'health',
      label: 'Health Record',
      children: <p>Health</p>,
      icon: <PlusCircleOutlined />,
    },
    {
      key: 'milk',
      label: 'Daily Milk',
      children: (
        <DailyMilk
          detailCow={dataDetail}
          dataMilk={dataMilk ? dataMilk : []}
          isLoading={isLoadingDaily}
          mutateDaily={mutateDaily}
          id={id as string}
        />
      ),
      icon: <FunnelPlotOutlined />,
    },
  ];
  return (
    <AnimationAppear>
      <WhiteBackground>
        <TabsComponent items={items} destroyInactiveTabPane />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default CowDetail;
