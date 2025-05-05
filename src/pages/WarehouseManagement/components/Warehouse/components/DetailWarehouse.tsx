import InputComponent from '@components/Input/InputComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import { Item } from '@model/Warehouse/items';
import { WarehouseType, WarehouseTypeName } from '@model/Warehouse/warehouse';
import { STORAGE_PATH } from '@service/api/Storage/storageApi';
import { Divider, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import GeneralDetailWarehouse from './components/GeneralDetailWarehouse';
import ItemWarehouse from './components/ItemWarehouse';
import { useState } from 'react';
import { t } from 'i18next';
import Title from '@components/UI/Title';
import { EquipmentType } from '@model/Warehouse/equipment';

const DetailWarehouse = () => {
  const { id } = useParams();
  const [textSearch, setTextSearch] = useState('');
  const {
    data,
    isLoading: isLoadingDetail,
    mutate: mutateEdit,
  } = useFetcher<WarehouseType>(
    STORAGE_PATH.STORAGE_DETAIL(id ? id : ''),
    'GET',
    'application/json'
  );
  const { data: dataItems, mutate: mutateItem } = useFetcher<Item[]>(
    STORAGE_PATH.ITEMS_STORAGE(id ? id : ''),
    'GET',
    'application/json',
    data && data?.type !== 'equipment'
  );

  const { data: dataEquipment, mutate: mutateEquipment } = useFetcher<
    EquipmentType[]
  >(
    STORAGE_PATH.EQUIPMENT_STORAGE(id ? id : ''),
    'GET',
    'application/json',
    data && data?.type === 'equipment'
  );
  return (
    <AnimationAppear>
      <WhiteBackground>
        {isLoadingDetail ? (
          <div className="flex justify-center items-center">
            <Spin />
          </div>
        ) : (
          <>
            <Title>
              {t('Detail information of')}{' '}
              <span className="text-black">
                {data?.name
                  ? data.name.charAt(0).toLowerCase() + data.name.slice(1)
                  : ''}
              </span>
            </Title>
            <Divider className="!my-2" />
            <div className="flex flex-col xl:flex-row 2xl:flex-row gap-5">
              <div className="w-full xl:w-1/2 2xl:w-1/2">
                <GeneralDetailWarehouse
                  data={data as WarehouseType}
                  mutate={mutateEdit}
                  mutateEquipment={mutateEquipment}
                  mutateItem={mutateItem}
                />
              </div>
              <div className="w-full xl:w-1/2 2xl:w-1/2">
                <InputComponent.Search
                  value={textSearch}
                  onChange={(e) => setTextSearch(e.target.value)}
                />
                <div className="h-[75vh] flex flex-col gap-5 overflow-y-auto py-5">
                  <ItemWarehouse
                    mutateEquipment={mutateEquipment}
                    typeWarehouse={data?.type as WarehouseTypeName}
                    mutateItem={mutateItem}
                    data={
                      dataItems?.filter((item) =>
                        item.name
                          .toLowerCase()
                          .includes(textSearch.toLowerCase())
                      ) || []
                    }
                    dataEquipment={
                      dataEquipment?.filter((item) =>
                        item.name
                          .toLowerCase()
                          .includes(textSearch.toLowerCase())
                      ) || []
                    }
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default DetailWarehouse;
