import TabsComponent, { TabsItemProps } from '@components/Tabs/TabsComponent';
import { t } from 'i18next';
import AreaList, { DataGroupAreaPen } from './AreaList/AreaList';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import { ClusterOutlined, UnorderedListOutlined } from '@ant-design/icons';
import AreaMap from './AreaMap/AreaMap';
import useFetcher from '@hooks/useFetcher';
import { Pen } from '@model/Pen';
import { PEN_PATH } from '@service/api/Pen/penApi';
import { AREA_PATH } from '@service/api/Area/areaApi';
import { Area } from '@model/Area';
import { useEffect, useState } from 'react';

const AreaAndPenTab = () => {
  const { data, isLoading, mutate } = useFetcher<Pen[]>(PEN_PATH.PENS, 'GET');
  const { data: dataArea } = useFetcher<Area[]>(AREA_PATH.AREAS, 'GET');
  const [dataGroup, setDataGroup] = useState<DataGroupAreaPen[]>([]);

  useEffect(() => {
    if (dataArea) {
      const groupedData: DataGroupAreaPen[] = dataArea.map((area) => ({
        area,
        pens: data?.filter((pen) => pen.area?.areaId === area.areaId) || [],
      }));
      setDataGroup(groupedData);
    }
  }, [data, dataArea]);
  const tabItems: TabsItemProps['items'] = [
    {
      key: 'list-area',
      label: t('Area list'),
      children: (
        <AreaList dataGroup={dataGroup} mutate={mutate} isLoading={isLoading} />
      ),
      icon: <UnorderedListOutlined />,
    },
    {
      key: 'map-area',
      label: t('Area map'),
      children: <AreaMap dataGroup={dataGroup} />,
      icon: <ClusterOutlined />,
    },
  ];
  return (
    <AnimationAppear>
      <WhiteBackground>
        <TabsComponent destroyInactiveTabPane items={tabItems} />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default AreaAndPenTab;
