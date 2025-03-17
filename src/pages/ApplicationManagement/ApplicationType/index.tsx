import { useTranslation } from 'react-i18next';
import TableComponent, {
  Column,
} from '../../../components/Table/TableComponent';
import WhiteBackground from '../../../components/UI/WhiteBackground';
import useFetcher from '../../../hooks/useFetcher';
import { APPLICATION_TYPE_PATH } from '@service/api/Application/applicationTypeApi';

const ApplicationType = () => {
  const { data, isLoading } = useFetcher<any>(
    APPLICATION_TYPE_PATH.APPLICATION_TYPE,
    'GET'
  );
  console.log('check data: ', data);
  const { t } = useTranslation();
  const columns: Column[] = [
    {
      dataIndex: 'name',
      key: 'name',
      title: t('Name'),
      // render: (element: string) => <TextLink to={""}>{element}</TextLink>,
    },
  ];

  return (
    <WhiteBackground>
      <TableComponent
        columns={columns}
        dataSource={data || []}
        loading={isLoading}
      />
    </WhiteBackground>
  );
};

export default ApplicationType;
