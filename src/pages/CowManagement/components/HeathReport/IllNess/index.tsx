import ButtonComponent from '@components/Button/ButtonComponent';
import PopconfirmComponent from '@components/Popconfirm/PopconfirmComponent';
import TableComponent, { Column } from '@components/Table/TableComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import useModal from '@hooks/useModal';
import useToast from '@hooks/useToast';
import { Health } from '@model/Cow/HealthReport';
import { cowOrigin } from '@service/data/cowOrigin';
import {
  formatAreaType,
  formatDateHour,
  formatStatusWithCamel,
  formatSTT,
} from '@utils/format';
import { getLabelByValue } from '@utils/getLabel';
import { Divider, Tooltip } from 'antd';
import { useEffect, useState } from 'react';

import TagComponents from '@components/UI/TagComponents';
import useFetch from '@hooks/useFetcher';
import { HEALTH_RECORD_PATH } from '@service/api/HealthRecord/healthRecordApi';
import { useTranslation } from 'react-i18next';
import ModalCreateIllNess from './components/ModalCreateIllNess';
import ModalViewDetail from './components/ModalViewDetail';
const IllNess = () => {
  const [healthReport, setHealthReport] = useState<Health[]>([]);
  const { data, error, isLoading, mutate } = useFetch<Health[]>(
    HEALTH_RECORD_PATH.ILLNESS,
    'GET'
  );
  const { t } = useTranslation();
  const { trigger, isLoading: loadingDelete } = useFetcher('illness', 'DELETE');
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();

  const onConfirm = async (id: string) => {
    try {
      await trigger({ url: HEALTH_RECORD_PATH.DELETE_ILLNESS(id) });
      toast.showSuccess('Delete success');
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };
  const [id, setId] = useState('');
  const modalViewDetail = useModal();

  const handleOpenModalDetail = (id: string) => {
    setId(id);
    modalViewDetail.openModal();
  };
  const statusColor = {
    pending: 'blue',
    processing: 'orange',
    complete: 'green',
    cancel: 'pink',
    fail: 'red',
  };
  const columns: Column[] = [
    {
      dataIndex: 'cowEntity',
      key: 'cowEntity',
      title: t('Cow'),
      render: (data) => (
        <Tooltip
          color="#87d068"
          placement="top"
          title={
            <div className="cowEntity">
              <p>
                <strong>ID:</strong> {data.cowId}
              </p>
              <p>
                <strong>{t('Status')}:</strong> {formatAreaType(data.cowStatus)}
              </p>
              <p>
                <strong>{t('Gender')}:</strong> {formatAreaType(data.gender)}
              </p>
              <p>
                <strong>{t('Date of Birth')}:</strong>{' '}
                {formatDateHour(data.dateOfBirth)}
              </p>
              <p>
                <strong>{t('Date of Enter')}:</strong>{' '}
                {formatDateHour(data.dateOfEnter)}
              </p>
              <p>
                <strong>{t('Origin')}:</strong>{' '}
                {getLabelByValue(data.cowOrigin, cowOrigin())}
              </p>
              <p>
                <strong>{t('Description')}:</strong>{' '}
                {stripHtml(data.description)}
              </p>
            </div>
          }
        >
          <span className="text-blue-500 ">{data.name}</span>
        </Tooltip>
      ),
    },
    {
      dataIndex: 'startDate',
      key: 'startDate',
      title: t('Start Date'),
      render: (data) => formatDateHour(data),
    },
    {
      dataIndex: 'endDate',
      key: 'endDate',
      title: t('End Date'),
      render: (data) => (data ? formatDateHour(data) : '-'),
    },

    {
      dataIndex: 'userEntity',
      key: 'userEntity',
      title: t('user'),
      render: (data) => (
        <Tooltip
          color="#87d068"
          placement="top"
          title={
            <div className="userEntity">
              <p>
                <strong>ID:</strong> {data.id}
              </p>
              <p>
                <strong>{t('Employee Number')}:</strong>{' '}
                {formatAreaType(data.employeeNumber)}
              </p>
              <p>
                <strong>{t('Email')}:</strong> {data.email}
              </p>
              <p>
                <strong>{t('Date Of Enter')}:</strong>{' '}
                {formatDateHour(data.dateOfEnter)}
              </p>
              <p>
                <strong>{t('Role')}:</strong> {data.roleId.name}
              </p>
            </div>
          }
        >
          <span className="text-blue-500 ">{data.name}</span>
        </Tooltip>
      ),
    },
    {
      dataIndex: 'illnessStatus',
      key: 'illnessStatus',
      title: t('Status'),
      render: (status: string) => (
        <TagComponents
          color={statusColor[status as keyof typeof statusColor] || 'default'}
        >
          {t(formatStatusWithCamel(status))}
        </TagComponents>
      ),
    },
    {
      dataIndex: 'illnessId',
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
          <PopconfirmComponent
            title={'Delete?'}
            onConfirm={() => onConfirm(data)}
          >
            <ButtonComponent type="primary" loading={loadingDelete} danger>
              {t('Delete')}
            </ButtonComponent>
          </PopconfirmComponent>
        </div>
      ),
    },
  ];
  useEffect(() => {
    if (data) {
      setHealthReport(data);
    }
    if (error) {
      toast.showError(error);
    }
  }, [data, error, toast]);
  return (
    <AnimationAppear duration={0.5}>
      <WhiteBackground>
        <ButtonComponent type="primary" onClick={() => setModalOpen(true)}>
          {t('Create IllNess')}
        </ButtonComponent>
        <Divider className="my-4" />
        <TableComponent
          loading={isLoading}
          columns={columns}
          dataSource={formatSTT(healthReport)}
        />
        {/* Modal Create Health Report */}
        <ModalCreateIllNess
          modal={{ open: modalOpen, closeModal: () => setModalOpen(false) }}
          mutate={mutate}
        />
        {id !== '' && (
          <ModalViewDetail id={id} modal={modalViewDetail} mutate={mutate} />
        )}
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default IllNess;
