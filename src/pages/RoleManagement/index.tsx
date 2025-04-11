import { Divider } from 'antd';
import { useTranslation } from 'react-i18next';

import TableComponent, { Column } from '../../components/Table/TableComponent';
import TextLink from '../../components/UI/TextLink';
import WhiteBackground from '../../components/UI/WhiteBackground';
import useFetcher from '../../hooks/useFetcher';
import useModal from '../../hooks/useModal';

import ModalCreateRole from './components/ModalCreateRole/ModalCreateRole';

const ListRole = () => {
  const { data, isLoading, mutate } = useFetcher<any>('users/roles', 'GET');

  console.log('check data: ', data);

  const { t } = useTranslation();
  const modalCreate = useModal();


  const columns: Column[] = [
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Role Name'),
      render: (element: string) => <TextLink to={''}>{element}</TextLink>,
    },

    {
      dataIndex: 'name',
      key: 'name',
      title: t('Role Name'),
      render: (element: string) => <TextLink to={''}>{element}</TextLink>,
    },

  ];

  return (
    <WhiteBackground>
      <ModalCreateRole modal={modalCreate} mutate={mutate} />
      <Divider className="my-4" />
      <TableComponent
        columns={columns}
        dataSource={data || []}
        loading={isLoading}
      />
    </WhiteBackground>
  );
};

export default ListRole;
