import { useTranslation } from 'react-i18next';
import useFetcher from '../../../hooks/useFetcher';
import TableComponent, {
  Column,
} from '../../../components/Table/TableComponent';
import TextLink from '../../../components/UI/TextLink';
import WhiteBackground from '../../../components/UI/WhiteBackground';
import ModalDetailTaskType from './components/ViewDetailTaskType';
import { useState } from 'react';
import useModal from '@hooks/useModal';
import ButtonComponent from '@components/Button/ButtonComponent';

const TaskType = () => {
  const { data, isLoading, mutate } = useFetcher<any>('task_types', 'GET');
  console.log('check data: ', data);
  const { t } = useTranslation();
  const [id, setId] = useState('');
  const modal = useModal();
  const modalDetail = useModal();

  const handleOpenModalDetail = (id: string) => {
    setId(id);
    modalDetail.openModal();
  };

  const columns: Column[] = [
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Name'),
      // render: (element: string) => <TextLink to={""}>{element}</TextLink>,
    },
    {
      dataIndex: 'roleId',
      key: 'roleId',
      title: t('Role'),
      render: (data) => data.name,
    },
    {
      dataIndex: 'taskTypeId',
      key: 'taskTypeId',
      title: t('Action'),
      render: (data) => (
        <div className="flex gap-5">
          <ButtonComponent
            type="primary"
            onClick={() => handleOpenModalDetail(data)}
          >
            {t('View Detail')}
          </ButtonComponent>
        </div>
      ),
    },
  ];

  return (
    <WhiteBackground>
      <TableComponent
        columns={columns}
        dataSource={data || []}
        loading={isLoading}
      />

      {id !== '' && (
        <ModalDetailTaskType id={id} modal={modalDetail} mutate={mutate} />
      )}
    </WhiteBackground>
  );
};

export default TaskType;
