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
import useFetcher from '../../../../hooks/useFetcher';
import { Cow, HealthResponse } from '../../../../model/Cow/Cow';
import { DailyMilkModel } from '../../../../model/DailyMilk/DailyMilk';
import DailyMilk from './TabsItem/DailyMilk';
import CowGeneralInformation from './TabsItem/GeneralInformation';
import HealthRecordCow from './TabsItem/HealthRecordCow';
import { useState } from 'react';
import MoveCow from './TabsItem/components/MoveCow';
import ButtonComponent from '@components/Button/ButtonComponent';

const CowDetail = () => {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
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
          cowId={id as string}
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
  ];
  return (
    <AnimationAppear>
      <WhiteBackground className="min-h-[70vh]">
        <p className="text-4xl font-bold !h-fit my-4 text-primary">
          {dataDetail?.name}
        </p>
        <ButtonComponent onClick={() => setIsOpen(true)}>Open MoveCow Modal</ButtonComponent>
        <MoveCow isOpen={isOpen} onClose={() => setIsOpen(false)} />
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
