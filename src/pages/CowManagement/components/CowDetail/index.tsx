import {
  FunnelPlotOutlined,
  PlusCircleOutlined,
  ProfileOutlined,
  SaveOutlined,
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
import DailyMilkRecord from './TabsItem/DailyMilkRecord';
import HealthRecordCow from './TabsItem/HealthRecordCow';
import { Cow, HealthResponse } from '../../../../model/Cow/Cow';

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
  } = useFetcher<Cow>(`cows/${id}`, 'GET');

  // const { data: dataDetailQR, isLoading: isLoadingDetailQR } = useFetcher<any>(
  //   `cows/qr/${id}`,
  //   'GET'
  // );
  const items: TabsItemProps['items'] = [
    {
      key: 'information',
      label: 'General Information',
      children: (
        <CowGeneralInformation
          id={id as string}
          dataDetail={dataDetail as Cow}
          isLoadingDetail={isLoadingDetail}
          mutateDetail={mutateDetail}
        />
      ),
      icon: <ProfileOutlined />,
    },
    {
      key: 'health',
      label: 'Health Record',
      children: (
        <HealthRecordCow
          mutate={mutateDetail}
          data={dataDetail?.healthInfoResponses as HealthResponse[]}
        />
      ),
      icon: <PlusCircleOutlined />,
    },
    {
      key: 'milk',
      label: 'Daily Milk',
      children: (
        <DailyMilk
          detailCow={dataDetail as Cow}
          dataMilk={dataMilk ? dataMilk : []}
          isLoading={isLoadingDaily}
          mutateDaily={mutateDaily}
          id={id as string}
        />
      ),
      icon: <FunnelPlotOutlined />,
    },
    {
      key: 'record',
      label: 'Daily Milk Record',
      children: <DailyMilkRecord id={id} />,
      icon: <SaveOutlined />,
    },
  ];
  return (
    <AnimationAppear>
      <WhiteBackground className="min-h-[70vh]">
        <p className="text-4xl font-bold !h-fit my-4 text-primary">
          {dataDetail?.name}
        </p>
        <TabsComponent
          items={items}
          destroyInactiveTabPane
          className="!h-full"
        />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default CowDetail;
