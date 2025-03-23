import { Form, Space, Card, Badge, Tag, Input } from 'antd'; // 🆕 Thêm Input
import { useEffect, useState } from 'react';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import useToast from '../../../../hooks/useToast';
import useFetcher from '../../../../hooks/useFetcher';
import { Application } from '../../../../model/ApplicationType/application';
import DescriptionComponent, {
  DescriptionPropsItem,
} from '../../../../components/Description/DescriptionComponent';
import ModalComponent from '../../../../components/Modal/ModalComponent';
import ButtonComponent from '../../../../components/Button/ButtonComponent';
import FormComponent from '../../../../components/Form/FormComponent';
import { formatDateHour } from '../../../../utils/format';
import ReactQuillComponent from '../../../../components/ReactQuill/ReactQuillComponent';
import { TaskType } from '@model/Task/task-type';

interface ModalDetailApplicationProps {
  modal: any;
  mutate: any;
  id: string;
}

const ModalDetailTaskType = ({
  modal,
  mutate,
  id,
}: ModalDetailApplicationProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [comment, setComment] = useState('');
  const toast = useToast();

  const { data, isLoading } = useFetcher<TaskType>(`task_types/${id}`, 'GET');
  console.log('Check data: ', data);
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data?.name,
        role: data.roleId?.name,
        description: data.description,
      });
    }
    if (modal.open) {
      form.resetFields();
      setComment('');
    }
    if (id) {
      mutate();
    }
  }, [modal.open, data, form, id]);

  const handleClose = () => {
    form.resetFields();

    mutate();
    modal.closeModal();
  };

  const items: DescriptionPropsItem['items'] = [
    {
      key: 'name',
      label: t('Task Type'),
      children: data?.name || 'N/A',
      span: 2,
    },
    {
      key: 'roleId',
      label: t('Role'),
      children: data?.roleId?.name || 'N/A',
      span: 2,
    },
    {
      key: 'description',
      label: t('Description'),
      children: (
        <div dangerouslySetInnerHTML={{ __html: data?.description || 'N/A' }} />
      ),
      span: 2,
    },
  ];

  return (
    <ModalComponent
      title={t('Task Type Details')}
      open={modal.open}
      onCancel={handleClose}
      loading={isLoading}
      width={800}
      footer={[
        <ButtonComponent
          onClick={handleClose}
          variant="solid"
          color="danger"
          key={'cancel'}
        >
          {t('Cancel')}
        </ButtonComponent>,
      ]}
    >
      <Card>
        <DescriptionComponent items={items} column={2} />
      </Card>
    </ModalComponent>
  );
};

export default ModalDetailTaskType;
