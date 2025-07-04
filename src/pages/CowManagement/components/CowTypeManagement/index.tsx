import TableComponent, { Column } from '@components/Table/TableComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import useModal from '@hooks/useModal';
import { CowType } from '@model/Cow/CowType';
import { COW_TYPE_PATH } from '@service/api/CowType/cowType';
import { formatDateHour, formatSTT } from '@utils/format';
import { Divider, Tag } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalTypes from './components/ModalAddTypes/ModalTypes';
import ModalEditTypes from './components/ModalEditTypes/ModalEditTypes';
import useGetRole from '@hooks/useGetRole';

const CowTypeManagement = () => {
  const { t } = useTranslation();
  const role = useGetRole();
  const modal = useModal();
  const modalEdit = useModal();
  const { data, isLoading, mutate } = useFetcher<CowType[]>(
    COW_TYPE_PATH.COW_TYPES,
    'GET'
  );
  const [id, setId] = useState<string>('');

  const handleEdit = (id: string) => {
    setId(id);
    modalEdit.openModal();
  };

  const columns: Column[] = [
    {
      dataIndex: 'createdAt',
      key: 'createdAt',
      title: t('Created Date'),
      render: (data) => formatDateHour(data),
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Name'),
      render: (element: string, data) => (
        <p
          onClick={() => handleEdit(data.cowTypeId)}
          className="text-blue-600 underline underline-offset-1 cursor-pointer"
        >
          {element}
        </p>
      ),
    },
    {
      dataIndex: 'maxWeight',
      key: 'maxWeight',
      title: t('Max weight'),
      render: (data) => <p>{data} (kg)</p>,
    },
    {
      dataIndex: 'maxHeight',
      key: 'maxHeight',
      title: t('Max height'),
      render: (data) => <p>{data} (m)</p>,
    },
    {
      dataIndex: 'maxLength',
      key: 'maxLength',
      title: t('Max length'),
      render: (data) => <p>{data} (m)</p>,
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: t('Status'),
      render: (status) => (
        <Tag color={status === 'exist' ? 'green' : 'volcano'}>
          {status === 'exist' ? t('Exist') : t('Not Exist')}
        </Tag>
      ),
    },
  ];
  return (
    <AnimationAppear duration={0.5}>
      <WhiteBackground>
        {role !== 'Veterinarians' && (
          <ModalTypes modal={modal} mutate={mutate} />
        )}
        <ModalEditTypes id={id} modal={modalEdit} mutate={mutate} />
        <Divider className="my-4" />
        <TableComponent
          columns={columns}
          dataSource={data ? formatSTT(data) : []}
          loading={isLoading}
        />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default CowTypeManagement;
