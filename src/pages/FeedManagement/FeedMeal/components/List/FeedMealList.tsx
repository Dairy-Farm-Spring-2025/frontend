import ButtonComponent from '@components/Button/ButtonComponent';
import PopconfirmComponent from '@components/Popconfirm/PopconfirmComponent';
import TableComponent, { Column } from '@components/Table/TableComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { CowType } from '@model/Cow/CowType';
import { FeedType } from '@model/Feed/Feed';
import { COW_TYPE_PATH } from '@service/api/CowType/cowType';
import { FEED_PATH } from '@service/api/Feed/feedApi';
import { COW_STATUS_FILTER } from '@service/data/cowStatus';
import { SHIFT_FEED_MEAL_FILTER } from '@service/data/shiftData';
import { formatStatusWithCamel } from '@utils/format';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const FeedMealList = () => {
  const { data, isLoading, mutate } = useFetcher<FeedType[]>(
    FEED_PATH.FEED_MEALS,
    'GET'
  );
  const [optionCowTypes, setCowTypes] = useState<any[]>([]);
  const toast = useToast();
  const navigate = useNavigate();
  const { trigger, isLoading: loadingDelete } = useFetcher(
    'feedmeals',
    'DELETE'
  );
  const { data: dataCowTypes } = useFetcher<CowType[]>(
    COW_TYPE_PATH.COW_TYPES,
    'GET'
  );
  const { t } = useTranslation();

  useEffect(() => {
    if (dataCowTypes) {
      setCowTypes(
        dataCowTypes.map((element) => ({
          text: `${formatStatusWithCamel(element.name)} - ${
            element.maxWeight
          } (kg)`,
          value: element.name,
        }))
      );
    }
  }, [dataCowTypes]);

  const onConfirm = async (id: string) => {
    try {
      const response = await trigger({ url: FEED_PATH.DELETE_FEED_MEALS(id) });
      toast.showSuccess(response.message);
      mutate();
    } catch (error: any) {
      toast.showError(t(error.message));
    }
  };

  const column: Column[] = [
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Name'),
      searchable: true,
      // render: (data) => <p className="text-base font-bold">{data}</p>,
    },
    {
      dataIndex: 'cowTypeEntity',
      key: 'cowTypeEntity',
      title: t('Cow Type'),
      render: (data) => `${data.name} - ${data.maxWeight}(kg)`,
      filterable: true,
      filterOptions: optionCowTypes,
      objectKeyFilter: 'name',
      sorter: (a: CowType, b: CowType) => a.maxWeight - b.maxWeight,
    },
    {
      title: t('Cow Status'),
      dataIndex: 'cowStatus',
      key: 'cowStatus',
      render: (data) => t(formatStatusWithCamel(data ? data : t('No status'))),
      filterable: true,
      filterOptions: COW_STATUS_FILTER(),
    },
    {
      title: t('Shift Feed Meal'),
      dataIndex: 'shift',
      key: 'shift',
      render: (data) => t(formatStatusWithCamel(data ? data : t('No shift'))),
      filterable: true,
      filterOptions: SHIFT_FEED_MEAL_FILTER(),
    },
    {
      dataIndex: 'feedMealId',
      key: 'action',
      title: t('Action'),
      render: (data) => (
        <div className="flex gap-5">
          <ButtonComponent
            type="primary"
            onClick={() => navigate(`../${data}`)}
          >
            {t('View Detail')}
          </ButtonComponent>
          <PopconfirmComponent
            onConfirm={() => onConfirm(data)}
            title={undefined}
          >
            <ButtonComponent type="primary" danger>
              {t('Delete')}
            </ButtonComponent>
          </PopconfirmComponent>
        </div>
      ),
    },
  ];

  return (
    <AnimationAppear>
      <WhiteBackground>
        {loadingDelete ? (
          <Spin />
        ) : (
          <div className="flex flex-col gap-5">
            <TableComponent
              dataSource={data || []}
              columns={column}
              loading={isLoading}
            />
          </div>
        )}
        {/* <ModalAddSupplier modal={modal} mutate={mutate} />
                {id !== '' && (
                    <ModalDetailSupplier id={id} modal={modalDetail} mutate={mutate} />
                )} */}
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default FeedMealList;
