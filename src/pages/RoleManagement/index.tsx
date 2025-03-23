import { Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import ButtonComponent from '../../components/Button/ButtonComponent';
import PopconfirmComponent from '../../components/Popconfirm/PopconfirmComponent';
import TableComponent, { Column } from '../../components/Table/TableComponent';
import TextLink from '../../components/UI/TextLink';
import WhiteBackground from '../../components/UI/WhiteBackground';
import useFetcher from '../../hooks/useFetcher';
import useModal from '../../hooks/useModal';
import useToast from '../../hooks/useToast';
import ModalCreateRole from './components/ModalCreateRole/ModalCreateRole';

const ListRole = () => {
  const { data, isLoading, mutate } = useFetcher<any>('users/roles', 'GET');
  const { trigger, isLoading: loadingDelete } = useFetcher(
    'warehouses',
    'DELETE'
  );
  console.log('check data: ', data);
  const toast = useToast();
  const { t } = useTranslation();
  const modalCreate = useModal();
  const onConfirm = async (id: string) => {
    try {
      await trigger({ url: `roles/${id}` });
      toast.showSuccess('Delete success');
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const columns: Column[] = [
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Role Name'),
      render: (element: string) => <TextLink to={''}>{element}</TextLink>,
    },
    // {
    //     dataIndex: 'id',
    //     key: 'action',
    //     title: t('Action'),
    //     render: (id: string) => (
    //         <ButtonComponent type="primary" danger onClick={() => onConfirm(id)}>
    //             {t("Delete")}
    //         </ButtonComponent>
    //     ),
    // },
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Role Name'),
      render: (element: string) => <TextLink to={''}>{element}</TextLink>,
    },
    {
      dataIndex: 'id',
      key: 'action',
      title: t('Action'),
      render: (_: any, record: any) => (
        <PopconfirmComponent
          title={t('')}
          onConfirm={() => onConfirm(record.id)}
          okText={t('Yes')}
          cancelText={t('No')}
        >
          <ButtonComponent type="primary" danger loading={loadingDelete}>
            {t('Delete')}
          </ButtonComponent>
        </PopconfirmComponent>
      ),
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
