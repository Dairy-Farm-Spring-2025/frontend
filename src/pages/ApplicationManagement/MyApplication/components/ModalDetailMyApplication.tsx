import { Card, Form, Tag } from 'antd'; // 🆕 Thêm Input
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DescriptionComponent, {
  DescriptionPropsItem,
} from '../../../../components/Description/DescriptionComponent';
import FormComponent from '../../../../components/Form/FormComponent';
import ModalComponent from '../../../../components/Modal/ModalComponent';
import useFetcher from '../../../../hooks/useFetcher';
import { Application } from '../../../../model/ApplicationType/application';
import { formatDateHour } from '../../../../utils/format';
import { APPLICATION_PATH } from '@service/api/Application/applicationApi';

interface ModalDetailMyApplicationProps {
  modal: any;
  mutate: any;
  id: string;
}

const ModalDetailMyApplication = ({
  modal,
  mutate,
  id,
}: ModalDetailMyApplicationProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const {
    data,
    isLoading: isLoadingDetail,
    mutate: mutateEdit,
  } = useFetcher<Application>(APPLICATION_PATH.APPLICATION_DETAIL(id), 'GET');

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        title: data.title,
        content: data.content,
        fromDate: data.fromDate,
        toDate: data.toDate,
        type: data.type,
        status: data.status,
        requestBy: data.requestBy?.name,
        approveBy: data.approveBy?.name,
      });
    }
    if (modal.open) {
      form.resetFields();
    }
    if (id) {
      mutateEdit();
    }
  }, [modal.open, data, form, id]);

  const handleClose = () => {
    form.resetFields();
    mutate();
    modal.closeModal();
  };

  const statusColor = {
    processing: 'orange',
    complete: 'green',
    cancel: 'red',
  };

  const items: DescriptionPropsItem['items'] = [
    {
      key: 'type',
      label: t('Application Type'),
      children: data?.type?.name || 'N/A',
      span: 2,
    },
    {
      key: 'title',
      label: t('Title'),
      children: data?.title || 'N/A',
      span: 2,
    },
    {
      key: 'content',
      label: t('Content'),
      children: (
        <div dangerouslySetInnerHTML={{ __html: data?.content || 'N/A' }} />
      ),
      span: 2,
    },

    {
      key: 'fromDate',
      label: t('From Date'),
      children: data?.fromDate ? formatDateHour(data.fromDate) : 'N/A',
      span: 1,
    },
    {
      key: 'toDate',
      label: t('To Date'),
      children: data?.toDate ? formatDateHour(data.toDate) : 'N/A',
      span: 1,
    },
    {
      key: 'requestBy',
      label: t('Requested By'),
      children: data?.requestBy?.name || 'N/A',
      span: 1,
    },
    {
      key: 'approveBy',
      label: t('Approved By'),
      children: data?.approveBy?.name || '',
      span: 1,
    },
    {
      key: 'status',
      label: t('Status'),
      children: (
        <Tag color={statusColor[data?.status as keyof typeof statusColor]}>
          {data?.status || ''}
        </Tag>
      ),
      span: 2,
    },
  ];

  return (
    <ModalComponent
      title={t('Application Details')}
      open={modal.open}
      onCancel={handleClose}
      loading={isLoadingDetail}
      width={800}
      footer={[]}
    >
      <Card>
        <FormComponent form={form}>
          <DescriptionComponent items={items} column={2} />
        </FormComponent>
      </Card>
    </ModalComponent>
  );
};

export default ModalDetailMyApplication;
