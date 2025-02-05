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

interface ListCowNotInPenProps {
  availablePens: PenEntity[];
  mutate: any;
}

const ListCowNotInPen: React.FC<ListCowNotInPenProps> = ({ availablePens, mutate }) => {
  const { data, error, isLoading, mutate: mutateCows } = useFetcher<Cow[]>('cows', 'GET');
  const [cow, setCow] = useState<Cow[]>([]);
  const toast = useToast();
  const modal = useModal();

  const columns: Column[] = [
    {
      dataIndex: 'cowId',
      key: 'cowId',
      title: '#',
    },
    {
      dataIndex: 'image',
      key: 'image',
      title: 'Image',
      render: () => <Image width={200} src={cowImage} />,
      width: 200,
    },
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: 'Created At',
      render: (data) => formatDateHour(data),
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: 'Name',
      render: (element: string, data) => (
        <TextLink to={`/dairy/cow-management/${data.cowId}`}>{element}</TextLink>
      ),
      width: 200,
    },
    {
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      title: 'Date Of Birth',
      render: (data) => formatDateHour(data),
    },
    {
      dataIndex: 'dateOfEnter',
      key: 'dateOfEnter',
      title: 'Date Of Enter',
      render: (data) => formatDateHour(data),
    },
    {
      dataIndex: 'dateOfOut',
      key: 'dateOfOut',
      title: 'Date Of Out',
      render: (data) => (data ? formatDateHour(data) : 'Not Out'),
    },
    {
      dataIndex: 'cowOrigin',
      key: 'cowOrigin',
      title: 'Origin',
      render: (data) => getLabelByValue(data, cowOrigin),
    },
    {
      dataIndex: 'gender',
      key: 'gender',
      title: 'Gender',
      render: (data) => (data === 'male' ? 'Male' : 'Female'),
    },
    {
      dataIndex: 'cowType',
      key: 'cowType',
      title: 'Cow Type',
      render: (data) => <p>{data.name}</p>,
    },
    {
      dataIndex: 'inPen',
      key: 'inPen',
      title: 'In Pen',
      render: (data) => (data ? 'Yes' : 'No'),
    },
    {
      dataIndex: 'cowStatus',
      key: 'cowStatus',
      title: 'Cow Status',
      render: (data) => getLabelByValue(data, cowStatus),
    },
    {
      dataIndex: 'cowId',
      key: 'action',
      title: 'Action',
      render: () => (
        <ButtonComponent type='primary' danger>
          Delete
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
