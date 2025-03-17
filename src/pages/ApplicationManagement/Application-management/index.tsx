import { APPLICATION_PATH } from '@service/api/Application/applicationApi';
import { Tag } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonComponent from '../../../components/Button/ButtonComponent';
import TableComponent, {
  Column,
} from '../../../components/Table/TableComponent';
import WhiteBackground from '../../../components/UI/WhiteBackground';
import useFetcher from '../../../hooks/useFetcher';
import useModal from '../../../hooks/useModal';
import { formatAreaType } from '../../../utils/format';
import ModalDetailApplication from './components/ModalDetailApplication';

const Application = () => {
  const { data, isLoading, mutate } = useFetcher<any>(
    APPLICATION_PATH.APPLICATION,
    'GET'
  );
  const { t } = useTranslation();
  const [id, setId] = useState('');
  const modalDetail = useModal();

  const handleOpenModalDetail = (id: string) => {
    setId(id);
    modalDetail.openModal();
  };

  const statusColor = {
    processing: 'orange',
    complete: 'green',
    cancel: 'pink',
    reject: 'red',
  };
  const columns: Column[] = [
    {
      dataIndex: 'type',
      key: 'type',
      title: t('Type'),
      render: (data) => data.name,
    },
    {
      dataIndex: 'title',
      key: 'title',
      title: t('Title'),
      render: (data) => formatAreaType(data),
    },
    {
      dataIndex: 'fromDate',
      key: 'fromDate',
      title: t('From Date'),
      // render: (element: string) => <TextLink to={""}>{element}</TextLink>,
    },
    {
      dataIndex: 'toDate',
      key: 'toDate',
      title: t('To Date'),
      // render: (element: string) => <TextLink to={""}>{element}</TextLink>,
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: t('Status'),
      render: (status: string) => (
        <Tag
          color={statusColor[status as keyof typeof statusColor] || 'default'}
        >
          {t(status)}
        </Tag>
      ),
    },
    {
      dataIndex: 'applicationId',
      key: 'action',
      title: t('Action'),
      render: (data) => (
        <div className="flex gap-5">
          <ButtonComponent
            type="primary"
            onClick={() => handleOpenModalDetail(data)}
          >
            {t('View Detail')}
          </ButtonComponent>
          {/* <PopconfirmComponent
                        title={'Delete?'}
                        onConfirm={() => onConfirm(data)}
                    >
                        <ButtonComponent type="primary" danger>
                            {t("Delete")}
                        </ButtonComponent>
                    </PopconfirmComponent> */}
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
        <ModalDetailApplication id={id} modal={modalDetail} mutate={mutate} />
      )}
    </WhiteBackground>
  );
};

export default Application;
