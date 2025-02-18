import React, { useEffect, useMemo, useState } from 'react';
import useFetcher from '../../../../../../hooks/useFetcher';
import { Cow } from '../../../../../../model/Cow/Cow'; // Import the correct Cow type
import TableComponent, { Column } from '../../../../../../components/Table/TableComponent';
import cowImage from '../../../../../../assets/cow.jpg';
import { Image } from 'antd';
import { formatDateHour, formatSTT } from '../../../../../../utils/format';
import TextLink from '../../../../../../components/UI/TextLink';
import { getLabelByValue } from '../../../../../../utils/getLabel';
import { cowOrigin } from '../../../../../../service/data/cowOrigin';
import { cowStatus } from '../../../../../../service/data/cowStatus';
import ButtonComponent from '../../../../../../components/Button/ButtonComponent';
import AnimationAppear from '../../../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../../../components/UI/WhiteBackground';
import useToast from '../../../../../../hooks/useToast';
import CreateBulkModal from './components/CreateBulk/CreateBulk';
import useModal from '../../../../../../hooks/useModal';
import { Pen } from '../../../../../../model/Pen';
import { PenEntity } from '../../../../../../model/CowPen/CowPen';
import { useTranslation } from 'react-i18next';

interface ListCowNotInPenProps {
  availablePens: PenEntity[];
  mutate: any;
}

const ListCowNotInPen: React.FC<ListCowNotInPenProps> = ({ availablePens, mutate }) => {
  const { data, error, isLoading, mutate: mutateCows } = useFetcher<Cow[]>('cows', 'GET');
  const [cow, setCow] = useState<Cow[]>([]);
  const toast = useToast();
  const modal = useModal();
  const { t } = useTranslation();
  const columns: Column[] = [
    {
      dataIndex: 'cowId',
      key: 'cowId',
      title: '#',
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
        <TextLink to={`/dairy/cow-management/${data.cowId}`}>{element}</TextLink>
      ),
      width: 200,
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
      render: (data) => (data === 'male' ? 'Male' : 'Female'),
    },
    {
      dataIndex: 'cowType',
      key: 'cowType',
      title: t('Cow Type'),
      render: (data) => <p>{data.name}</p>,
    },
    {
      dataIndex: 'inPen',
      key: 'inPen',
      title: t('In Pen'),
      render: (data) => (data ? 'Yes' : 'No'),
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
        <ButtonComponent type='primary' danger>
          {t("Delete")}
        </ButtonComponent>
      ),
    },
  ];
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
          avalableCows={filteredCows}
          availablePens={availablePens || []}
          mutate={mutate}
          mutateCows={mutateCows}
        />
        <TableComponent loading={isLoading} columns={columns} dataSource={formatSTT(cow)} />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default ListCowNotInPen;
