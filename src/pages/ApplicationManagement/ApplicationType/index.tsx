import { useTranslation } from 'react-i18next';
import TableComponent, {
  Column,
} from '../../../components/Table/TableComponent';
import WhiteBackground from '../../../components/UI/WhiteBackground';
import useFetcher from '../../../hooks/useFetcher';
import { APPLICATION_TYPE_PATH } from '@service/api/Application/applicationTypeApi';
import ButtonComponent from '@components/Button/ButtonComponent';
import useModal from '@hooks/useModal';
import { Divider } from 'antd';
import ModalCreateApplicationType from './components/CreateApplicationType';

const ApplicationType = () => {
  const modal = useModal();
  const { data, isLoading, mutate } = useFetcher<any>(
    APPLICATION_TYPE_PATH.APPLICATION_TYPE,
    'GET'
  );
  const { t } = useTranslation();
  const columns: Column[] = [
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Name'),
    },
  ];

  const handleOpenModalAdd = () => {
    modal.openModal();
  };
  return (
    <WhiteBackground>
      <ButtonComponent type="primary" onClick={handleOpenModalAdd}>
        {t('Create Application Type')}
      </ButtonComponent>
      <Divider className="my-4"></Divider>
      <TableComponent
        columns={columns}
        dataSource={data || []}
        loading={isLoading}
      />
      <ModalCreateApplicationType modal={modal} mutate={mutate} />
    </WhiteBackground>
  );
};

export default ApplicationType;
