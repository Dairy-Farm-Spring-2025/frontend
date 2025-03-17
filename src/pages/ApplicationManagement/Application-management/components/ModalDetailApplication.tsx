import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Card, Form, Space, Tag } from 'antd'; // 🆕 Thêm Input
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonComponent from '../../../../components/Button/ButtonComponent';
import DescriptionComponent, {
  DescriptionPropsItem,
} from '../../../../components/Description/DescriptionComponent';
import FormComponent from '../../../../components/Form/FormComponent';
import ModalComponent from '../../../../components/Modal/ModalComponent';
import ReactQuillComponent from '../../../../components/ReactQuill/ReactQuillComponent';
import useFetcher from '../../../../hooks/useFetcher';
import useToast from '../../../../hooks/useToast';
import { Application } from '../../../../model/ApplicationType/application';
import { formatDateHour } from '../../../../utils/format';
import { APPLICATION_PATH } from '@service/api/Application/applicationApi';

interface ModalDetailApplicationProps {
  modal: any;
  mutate: any;
  id: string;
}

const ModalDetailApplication = ({
  modal,
  mutate,
  id,
}: ModalDetailApplicationProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [comment, setComment] = useState(''); // 🆕 State lưu comment
  const toast = useToast();

  const { trigger: approvalRequest, isLoading } = useFetcher(
    APPLICATION_PATH.APPLICATION_APPROVE(id),
    'PUT'
  );
  // const { trigger: cancelRequest } = useFetcher(`application/cancel-request/${id}`, 'PUT');
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
      setComment('');
    }
    if (id) {
      mutateEdit();
    }
  }, [modal.open, data, form, id]);

  const handleApprove = async () => {
    if (!id) {
      toast.showError(t('Application ID is missing!'));
      return;
    }

    try {
      await approvalRequest({
        body: {
          approvalStatus: 'approve',
          commentApprove: comment,
        },
      });
      toast.showSuccess(t('Approve success'));

      mutateEdit();
      handleClose();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const handleReject = async () => {
    try {
      await approvalRequest({
        body: {
          approvalStatus: 'reject',
          commentApprove: comment,
        },
      });
      toast.showSuccess(t('Reject success'));

      mutateEdit();
      handleClose();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setComment(''); // 🆕 Reset comment khi đóng modal
    mutate();
    modal.closeModal();
  };

  const statusColor = {
    processing: 'orange',
    complete: 'green',
    cancel: 'pink',
    reject: 'red',
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
      footer={
        <Space key="footer-buttons">
          <ButtonComponent
            key="cancel"
            danger
            onClick={handleReject}
            icon={<CloseOutlined />}
            size="large"
            disabled={data?.status === 'complete' || data?.status === 'cancel'}
          >
            {t('Cancel')}
          </ButtonComponent>
          <ButtonComponent
            key="approve"
            type="primary"
            loading={isLoading}
            onClick={handleApprove}
            icon={<CheckOutlined />}
            size="large"
            disabled={data?.status === 'complete' || data?.status === 'cancel'}
          >
            {t('Approve')}
          </ButtonComponent>
        </Space>
      }
    >
      <Card>
        <FormComponent form={form}>
          <DescriptionComponent items={items} column={2} />

          <Form.Item label={t('Comment')} name="commentApprove">
            <ReactQuillComponent
              placeholder={t('Enter your comment here...')}
              value={comment}
            />
          </Form.Item>
        </FormComponent>
      </Card>
    </ModalComponent>
  );
};

export default ModalDetailApplication;
