import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ErrorComponent from '@components/Error/ErrorComponent';
import TableComponent, { Column } from '@components/Table/TableComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import TextLink from '@components/UI/TextLink';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import useModal from '@hooks/useModal';
import { Cow } from '@model/Cow/Cow';
import { CowType } from '@model/Cow/CowType';
import CreateBulkModal from '@pages/CowPenManagement/components/MoveCowManagement/components/ListCowNotInPen/components/CreateBulk/CreateBulk';
import { COW_PATH } from '@service/api/Cow/cowApi';
import { COW_TYPE_PATH } from '@service/api/CowType/cowType';
import { cowOrigin, cowOriginFiltered } from '@service/data/cowOrigin';
import { COW_STATUS_FILTER, cowStatus } from '@service/data/cowStatus';
import { formatDateHour, formatSTT } from '@utils/format';
import { getLabelByValue } from '@utils/getLabel';
import { Divider } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdFemale, IoMdMale } from 'react-icons/io';

const ListCow = () => {
  const { t } = useTranslation();
  const [optionsCowTypes, setOptionCowTypes] = useState<any[]>([]);
  const {
    data,
    error,
    isLoading,
    mutate: mutateCows,
  } = useFetcher<Cow[]>(COW_PATH.COWS, 'GET');
  const { data: dataCowType } = useFetcher<CowType[]>(
    COW_TYPE_PATH.COW_TYPES,
    'GET'
  );

  useEffect(() => {
    if (dataCowType) {
      setOptionCowTypes(
        dataCowType.map((element) => ({
          value: element.name,
          text: element.name,
        }))
      );
    }
  }, [dataCowType]);

  const modal = useModal();
  const columns: Column[] = [
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Name'),
      render: (element: string, data) => (
        <TextLink
          to={`/dairy/cow-management/${data.cowId}`}
          className="!text-base font-bold"
        >
          {element}
        </TextLink>
      ),
      searchText: true,
    },
    {
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      title: t('Date Of Birth'),
      render: (data) => formatDateHour(data),
      sorter: (a: any, b: any) =>
        new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime(),
      filteredDate: true,
    },
    {
      dataIndex: 'dateOfEnter',
      key: 'dateOfEnter',
      title: t('Date Of Enter'),
      render: (data) => formatDateHour(data),
      sorter: (a: any, b: any) =>
        new Date(a.dateOfEnter).getTime() - new Date(b.dateOfEnter).getTime(),
      filteredDate: true,
    },
    {
      dataIndex: 'dateOfOut',
      key: 'dateOfOut',
      title: t('Date Of Out'),
      render: (data) => (data ? formatDateHour(data) : '-'),
      sorter: (a: any, b: any) =>
        new Date(a.dateOfEnter).getTime() - new Date(b.dateOfEnter).getTime(),
      filteredDate: true,
    },
    {
      dataIndex: 'cowOrigin',
      key: 'cowOrigin',
      title: t('Origin'),
      render: (data) => getLabelByValue(data, cowOrigin()),
      filterable: true,
      filterOptions: cowOriginFiltered(),
    },
    {
      dataIndex: 'gender',
      key: 'gender',
      title: t('Gender'),
      render: (data) => (
        <div className="flex justify-center items-center">
          {data === 'male' ? (
            <IoMdMale className="text-blue-600" size={20} />
          ) : (
            <IoMdFemale className="text-pink-600" size={20} />
          )}
        </div>
      ),
      filterable: true, // Enables dropdown filter
      filterOptions: [
        { text: t('Male'), value: 'male' },
        { text: t('Female'), value: 'female' },
      ],
    },
    {
      dataIndex: 'cowType',
      key: 'cowType',
      title: t('Cow Type'),
      render: (data) => <p>{data.name}</p>,
      filterable: true,
      filterOptions: optionsCowTypes,
      objectKeyFilter: 'name',
    },
    {
      dataIndex: 'cowStatus',
      key: 'cowStatus',
      title: t('Cow Status'),
      render: (data) => getLabelByValue(data, cowStatus()),
      filterable: true,
      filterOptions: COW_STATUS_FILTER(),
    },
    {
      dataIndex: 'inPen',
      key: 'inPen',
      title: t('In Pen'),
      render: (data) =>
        data ? (
          <CheckCircleOutlined style={{ color: 'green' }} />
        ) : (
          <CloseCircleOutlined style={{ color: 'red' }} />
        ),
      filterable: true,
      filterOptions: [
        {
          text: t('In pen'),
          value: true,
        },
        {
          text: t('Not in pen'),
          value: false,
        },
      ],
    },
  ];

  const filteredCows: Cow[] = useMemo(
    () => (data ? data.filter((item) => !item.inPen) : []),
    [data]
  );

  return (
    <AnimationAppear duration={0.5}>
      <WhiteBackground>
        {error ? (
          <ErrorComponent
            status={error.code}
            title={t('Error')}
            subTitle={error.message}
          />
        ) : (
          <>
            <CreateBulkModal
              modal={modal}
              availableCows={filteredCows}
              mutateCows={mutateCows}
            />
            <Divider className="my-4" />
            <TableComponent
              loading={isLoading}
              columns={columns}
              dataSource={data ? formatSTT(data) : []}
              // rowSelection={rowSelection} // Thêm tính năng chọn hàng
              // rowKey="cowId" // Định danh duy nhất cho từng dòng
            />
          </>
        )}
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ListCow;
