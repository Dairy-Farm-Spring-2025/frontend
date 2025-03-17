import { Divider } from 'antd';
import ButtonComponent from '@components/Button/ButtonComponent';
import TableComponent, { Column } from '@components/Table/TableComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import useModal from '@hooks/useModal';
import { formatDateHour, formatSTT } from '@utils/format';
import ModalTypes from './components/ModalAddTypes/ModalTypes';
import { useState } from 'react';
import ModalEditTypes from './components/ModalEditTypes/ModalEditTypes';
import { CowType } from '@model/Cow/CowType';
import { useTranslation } from 'react-i18next';
import { COW_TYPE_PATH } from '@service/api/CowType/cowType';

const CowTypeManagement = () => {
  const { t } = useTranslation();
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
      dataIndex: 'status',
      key: 'status',
      title: t('Status'),
      render: (data) => (data === 'exist' ? 'Exist' : 'Not Exist'),
    },
    {
      dataIndex: 'cowTypeId',
      key: 'action',
      title: t('Action'),
      render: (data) => (
        <ButtonComponent
          key={'deleteButton'}
          onClick={() => console.log(data)}
          danger
          type="primary"
        >
          {t('Delete')}
        </ButtonComponent>
      ),
    },
  ];
  return (
    <AnimationAppear duration={0.5}>
      <WhiteBackground>
        <ModalTypes modal={modal} mutate={mutate} />
        {modalEdit.open && (
          <ModalEditTypes id={id} modal={modalEdit} mutate={mutate} />
        )}
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
