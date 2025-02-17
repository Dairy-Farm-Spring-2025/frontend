import { Image } from 'antd';
import { useEffect, useState } from 'react';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import cowImage from '../../../../assets/cow.jpg';
import ButtonComponent from '../../../../components/Button/ButtonComponent';
import TableComponent, {
  Column,
} from '../../../../components/Table/TableComponent';
import AnimationAppear from '../../../../components/UI/AnimationAppear';
import TextLink from '../../../../components/UI/TextLink';
import WhiteBackground from '../../../../components/UI/WhiteBackground';
import useFetch from '../../../../hooks/useFetcher';
import useToast from '../../../../hooks/useToast';
import { Cow } from '../../../../model/Cow/Cow';
import { cowOrigin } from '../../../../service/data/cowOrigin';
import { cowStatus } from '../../../../service/data/cowStatus';
import { formatDateHour, formatSTT } from '../../../../utils/format';
import { getLabelByValue } from '../../../../utils/getLabel';
import { useTranslation } from 'react-i18next';
const ListCow = () => {
  const { t } = useTranslation();
  const [cow, setCow] = useState<Cow[]>([]);
  const { data, error, isLoading } = useFetch<Cow[]>('cows', 'GET');
  console.log(isLoading);
  const toast = useToast();
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
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: t('Created At'),
      render: (data) => formatDateHour(data),
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
    },
    {
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      title: t('Date Of Birth'),
      render: (data) => formatDateHour(data),
    },
    {
      dataIndex: 'dateOfEnter',
      key: 'dateOfEnter',
      title: t('Date Of Enter'),
      render: (data) => formatDateHour(data),
    },
    {
      dataIndex: 'dateOfOut',
      key: 'dateOfOut',
      title: t('Date Of Out'),
      render: (data) => (data ? formatDateHour(data) : 'Not Out'),
    },
    {
      dataIndex: 'cowOrigin',
      key: 'cowOrigin',
      title: t('Origin'),
      render: (data) => getLabelByValue(data, cowOrigin),
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
      dataIndex: 'cowId',
      key: 'action',
      title: t('Action'),
      render: () => (
        <ButtonComponent type="primary" danger>
          {t("Delete")}
        </ButtonComponent>
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
  return (
    <AnimationAppear duration={0.5}>
      <WhiteBackground>
        <TableComponent
          loading={isLoading}
          columns={columns}
          dataSource={formatSTT(cow)}
        />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ListCow;
