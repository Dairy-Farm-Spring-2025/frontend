import { Divider, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonComponent from '../../../components/Button/ButtonComponent';
import TableComponent, {
  Column,
} from '../../../components/Table/TableComponent';
import useFetcher from '../../../hooks/useFetcher';
import useModal from '../../../hooks/useModal';
import { formatAreaType, formatDateHour } from '../../../utils/format';
import ModalDetailMyApplication from './components/ModalDetailMyApplication';
import ModalRequestMyApplication from './components/ModalRequestApplication';
import { APPLICATION_PATH } from '@service/api/Application/applicationApi';

const MyApplication = () => {
  const { t } = useTranslation();
  const { data, isLoading, mutate } = useFetcher<any>(
    APPLICATION_PATH.APPLICATION_MY_REQUEST,
    'GET'
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const modal = useModal();
  const modalDetail = useModal();

  const handleOpenModalRequest = () => modal.openModal();
  const handleOpenModalDetail = (id: string) => {
    setSelectedId(id);
    modalDetail.openModal();
  };

  const statusColor = useMemo(
    () => ({
      processing: 'orange',
      complete: 'green',
      cancel: 'red',
    }),
    []
  );

  const columns: Column[] = useMemo(
    () => [
      {
        dataIndex: 'applicationId',
        key: 'applicationId',
        title: '#',
        render: (_, __, index) => index + 1,
      },
      {
        dataIndex: 'type',
        key: 'type',
        title: t('Type'),
        render: (type) => type?.name || '-',
      },
      {
        dataIndex: 'title',
        key: 'title',
        title: t('Title'),
        render: (title) => formatAreaType(title),
      },
      {
        dataIndex: 'fromDate',
        key: 'fromDate',
        title: t('From Date'),
        render: (data) => formatDateHour(data),
      },
      {
        dataIndex: 'toDate',
        key: 'toDate',
        title: t('To Date'),
        render: (data) => formatDateHour(data),
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
        render: (id: string) => (
          <ButtonComponent onClick={() => handleOpenModalDetail(id)}>
            {t('View Detail')}
          </ButtonComponent>
        ),
      },
    ],
    [t, statusColor]
  );

  return (
    <div>
      <div>
        <ButtonComponent
          colorButton="orange"
          className="!text-white"
          onClick={handleOpenModalRequest}
        >
          {t('Create Application')}
        </ButtonComponent>
      </div>
      <Divider className="my-4" />
      <TableComponent
        columns={columns}
        dataSource={data || []}
        loading={isLoading}
      />
      <ModalRequestMyApplication modal={modal} mutate={mutate} />
      {selectedId && (
        <ModalDetailMyApplication
          id={selectedId}
          modal={modalDetail}
          mutate={mutate}
        />
      )}
    </div>
  );
};

export default MyApplication;
