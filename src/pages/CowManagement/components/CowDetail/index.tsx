import {
  FunnelPlotOutlined,
  PlusCircleOutlined,
  ProfileOutlined,
  RetweetOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import TabsComponent, { TabsItemProps } from '@components/Tabs/TabsComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import { Cow, HealthResponse } from '@model/Cow/Cow';
import { DailyMilkModel } from '@model/DailyMilk/DailyMilk';
import DailyMilk from './TabsItem/DailyMilk';
import CowGeneralInformation from './TabsItem/GeneralInformation';
import HealthRecordCow from './TabsItem/HealthRecordCow';
import HistoryMoveCow from './TabsItem/HistoryMoveCow';
import { COW_PATH } from '@service/api/Cow/cowApi';
import { DAILY_MILK_PATH } from '@service/api/DailyMilk/dailyMilkApi';
const CowDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  const {
    data: dataMilk,
    isLoading: isLoadingDaily,
    mutate: mutateDaily,
  } = useFetcher<DailyMilkModel[]>(
    DAILY_MILK_PATH.DAILY_MILKS_COWS(id ? id : ''),
    'GET'
  );
  const {
    data: dataDetail,
    isLoading: isLoadingDetail,
    mutate: mutateDetail,
  } = useFetcher<Cow>(COW_PATH.COW_DETAIL(id ? id : ''), 'GET');

  // const { data: dataDetailQR, isLoading: isLoadingDetailQR } = useFetcher<any>(
  //   `cows/qr/${id}`,
  //   'GET'
  // );
  const items: TabsItemProps['items'] = [
    {
      key: 'information',
      label: t('General information'),
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
      label: t('Health record'),
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
      label: t('Daily milk'),
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
      key: 'history',
      label: t('Move cow'),
      children: (
        <HistoryMoveCow id={id as string} isLoadingHistory={isLoadingDetail} />
      ),
      icon: <RetweetOutlined />,
    },
  ];
  return (
    <AnimationAppear>
      <WhiteBackground className="min-h-[70vh]">
        <div className="flex items-center justify-between my-4">
          <p className="text-4xl font-bold text-primary">{dataDetail?.name}</p>
        </div>

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
