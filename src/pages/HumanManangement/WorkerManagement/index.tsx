import TableComponent, { Column } from '@components/Table/TableComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import useModal from '@hooks/useModal';
import { USER_PATH } from '@service/api/User/userApi';
import { formatStatusWithCamel, formatSTT } from '@utils/format';
import { Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import BanUnbanUser from '../../UserManagement/components/BanUnBanUser/BanUnBanUser';
import ModalCreateHuman from '../components/ModalCreateHuman';
import TagComponents from '@components/UI/TagComponents';

const ListWorker = () => {
  const { data, isLoading, mutate } = useFetcher<any>(USER_PATH.WORKER, 'GET');
  const modal = useModal();
  const defaultRole = 4;

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
      title: t('Email'),
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
          title={t('Create Worker')}
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

export default ListWorker;
