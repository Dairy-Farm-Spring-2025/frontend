import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import useModal from '@hooks/useModal';
import CreateBulkModal from '@pages/CowPenManagement/components/MoveCowManagement/components/ListCowNotInPen/components/CreateBulk/CreateBulk';
import { COW_PATH } from '@service/api/Cow/cowApi';
import { Divider, Image } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import cowImage from '../../../../assets/cow.jpg';
import TableComponent, { Column } from '@components/Table/TableComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import TextLink from '@components/UI/TextLink';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetch from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { Cow } from '@model/Cow/Cow';
import { cowOrigin, cowOriginFiltered } from '@service/data/cowOrigin';
import { cowStatus } from '@service/data/cowStatus';
import { formatDateHour, formatSTT } from '@utils/format';
import { getLabelByValue } from '@utils/getLabel';

const ListCow = () => {
  const { t } = useTranslation();
  const [cow, setCow] = useState<Cow[]>([]);
  const {
    data,
    error,
    isLoading,
    mutate: mutateCows,
  } = useFetch<Cow[]>(COW_PATH.COWS, 'GET');
  const toast = useToast();
  const modal = useModal();
  const columns: Column[] = [
    {
      dataIndex: 'cowId',
      key: 'cowId',
      title: '#',
      render: (__, _, index) => <p className="text-base">{index + 1}</p>,
    },
    {
      dataIndex: 'image',
      key: 'image',
      title: t('Image'),
      render: () => <Image width={200} src={cowImage} />,
      width: 200,
    },
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
    },
    {
      dataIndex: 'cowOrigin',
      key: 'cowOrigin',
      title: t('Origin'),
      render: (data) => getLabelByValue(data, cowOrigin),
      filterable: true,
      filterOptions: cowOriginFiltered,
    },
    {
      dataIndex: 'gender',
      key: 'gender',
      title: t('Gender'),
      render: (data) =>
        data === 'male' ? (
          <IoMdMale className="text-blue-600" size={20} />
        ) : (
          <IoMdFemale className="text-pink-600" size={20} />
        ),
      filterable: true, // Enables dropdown filter
      filterOptions: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ],
    },
    {
      dataIndex: 'cowType',
      key: 'cowType',
      title: t('Cow Type'),
      render: (data) => <p>{data.name}</p>,
    },
    {
      dataIndex: 'cowStatus',
      key: 'cowStatus',
      title: t('Cow Status'),
      render: (data) => getLabelByValue(data, cowStatus),
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
    },
  ];
  useEffect(() => {
    if (data) {
      setCow(data);
    }
    if (error) {
      toast.showError(error);
    }
  }, [data, error, toast]);
  const filteredCows: Cow[] = useMemo(
    () => (data ? data.filter((item) => !item.inPen) : []),
    [data]
  );

  useEffect(() => {
    setCow(filteredCows);
  }, [filteredCows]);
  return (
    <AnimationAppear duration={0.5}>
      <WhiteBackground>
        <CreateBulkModal
          modal={modal}
          availableCows={filteredCows}
          mutateCows={mutateCows}
        />
        <Divider className="my-4" />
        <TableComponent
          loading={isLoading}
          columns={columns}
          dataSource={formatSTT(cow)}
          // rowSelection={rowSelection} // Thêm tính năng chọn hàng
          // rowKey="cowId" // Định danh duy nhất cho từng dòng
        />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ListCow;
