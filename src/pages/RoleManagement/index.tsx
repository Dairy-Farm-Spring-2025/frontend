import { useTranslation } from 'react-i18next';

import TableComponent, { Column } from '../../components/Table/TableComponent';
import WhiteBackground from '../../components/UI/WhiteBackground';
import useFetcher from '../../hooks/useFetcher';

const ListRole = () => {
  const { data, isLoading } = useFetcher<any>('users/roles', 'GET');

  console.log('check data: ', data);

  const { t } = useTranslation();

  const columns: Column[] = [
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Role Name'),
      render: (element: string) => t(element),
    },
  ];

  return (
    <WhiteBackground>
      {/* <ModalCreateRole modal={modalCreate} mutate={mutate} />
      <Divider className="my-4" /> */}
      <TableComponent
        columns={columns}
        dataSource={data || []}
        loading={isLoading}
      />
    </WhiteBackground>
  );
};

export default ListRole;
