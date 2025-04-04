import { Divider } from 'antd';
import TableComponent, { Column } from '@components/Table/TableComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import useModal from '@hooks/useModal';
import { formatStatusWithCamel, formatSTT } from '@utils/format';

import { useTranslation } from 'react-i18next';
import BanUnbanUser from '../../UserManagement/components/BanUnBanUser/BanUnBanUser';
import ModalCreateHuman from '../components/ModalCreateHuman';
import { USER_PATH } from '@service/api/User/userApi';
import TagComponents from '@components/UI/TagComponents';

const ListVeterinarian = () => {
  const { data, isLoading, mutate } = useFetcher<any>(
    USER_PATH.VETERINARIANS,
    'GET'
  );
  const modal = useModal();
  const defaultRole = 3;
  const { t } = useTranslation();

  const columns: Column[] = [
    {
      dataIndex: 'employeeNumber',
      key: 'employeeNumber',
      title: t('Employee Number'),
      searchable: true,
      width: '15%',
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Name'),
      searchable: true,
      width: '25%',
    },
    {
      dataIndex: 'email',
      key: 'email',
      title: 'Email',
      searchable: true,
      width: '25%',
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: t('Status'),
      width: '10%',
      align: 'center',
      render: (data) => (
        <TagComponents
          color={data === 'active' ? 'green-inverse' : 'red-inverse'}
        >
          {t(formatStatusWithCamel(data))}
        </TagComponents>
      ),
    },
    {
      dataIndex: 'action',
      key: 'action',
      title: t('Action'),
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <BanUnbanUser
          userId={record.id}
          isActive={record.status === 'active'}
          onStatusChange={mutate}
        />
      ),
    },
  ];

  return (
    <AnimationAppear duration={0.5}>
      <WhiteBackground>
        <ModalCreateHuman
          modal={modal}
          mutate={mutate}
          title={t('Create Veterinarian')}
          defaultValues={{ roleId: defaultRole }}
        />
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

export default ListVeterinarian;
