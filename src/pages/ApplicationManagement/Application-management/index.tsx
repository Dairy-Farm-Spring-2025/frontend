import TagComponents from '@components/UI/TagComponents';
import { Application } from '@model/ApplicationType/application';
import { APPLICATION_PATH } from '@service/api/Application/applicationApi';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonComponent from '../../../components/Button/ButtonComponent';
import TableComponent, {
  Column,
} from '../../../components/Table/TableComponent';
import WhiteBackground from '../../../components/UI/WhiteBackground';
import useFetcher from '../../../hooks/useFetcher';
import useModal from '../../../hooks/useModal';
import { formatDateHour, formatStatusWithCamel } from '../../../utils/format';
import ModalDetailApplication from './components/ModalDetailApplication';

const ApplicationListing = () => {
  const { data, isLoading, mutate } = useFetcher<Application[]>(
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
      searchable: true,
      objectKeyFilter: 'name',
    },
    {
      dataIndex: 'title',
      key: 'title',
      title: t('Title'),
      render: (data) => data,
      width: '20%',
      searchable: true,
    },
    {
      dataIndex: 'content',
      key: 'content',
      title: t('Content'),
      render: (data) => data,
      width: '20%',
    },
    {
      dataIndex: 'fromDate',
      key: 'fromDate',
      title: t('From Date'),
      render: (data) => formatDateHour(data),
      filteredDate: true,
    },
    {
      dataIndex: 'toDate',
      key: 'toDate',
      title: t('To Date'),
      render: (data) => formatDateHour(data),
      filteredDate: true,
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: t('Status'),
      render: (status: string) => (
        <TagComponents
          color={statusColor[status as keyof typeof statusColor] || 'default'}
        >
          {t(formatStatusWithCamel(status))}
        </TagComponents>
      ),
      filterable: true,
      filterOptions: [
        { value: 'processing', text: t('Processing') },
        { value: 'complete', text: t('Complete') },
        { value: 'cancel', text: t('Cancel') },
        { value: 'reject', text: t('Reject') },
      ],
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
      <ModalDetailApplication id={id} modal={modalDetail} mutate={mutate} />
    </WhiteBackground>
  );
};

export default ApplicationListing;
