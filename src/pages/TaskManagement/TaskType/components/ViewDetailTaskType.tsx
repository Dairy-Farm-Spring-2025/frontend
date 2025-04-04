import TagComponents from '@components/UI/TagComponents';
import { TaskType } from '@model/Task/task-type';
import { getColorByRole } from '@utils/statusRender/roleRender';
import { useTranslation } from 'react-i18next';
import DescriptionComponent, {
  DescriptionPropsItem,
} from '@components/Description/DescriptionComponent';
import ModalComponent from '@components/Modal/ModalComponent';
import useFetcher from '@hooks/useFetcher';

interface ModalDetailApplicationProps {
  modal: any;
  mutate: any;
  id: string;
}

const ModalDetailTaskType = ({ modal, id }: ModalDetailApplicationProps) => {
  const { t } = useTranslation();

  const { data, isLoading } = useFetcher<TaskType>(`task_types/${id}`, 'GET');
  const handleClose = () => {
    modal.closeModal();
  };

  const items: DescriptionPropsItem['items'] = [
    {
      key: 'name',
      label: t('Task Type'),
      children: data?.name || 'N/A',
      span: 3,
    },
    {
      key: 'roleId',
      label: t('Role'),
      children: (
        <TagComponents color={getColorByRole(data?.roleId?.name as any)}>
          {t(data?.roleId?.name || 'N/A')}
        </TagComponents>
      ),
      span: 3,
    },
    {
      key: 'description',
      label: t('Description'),
      children: (
        <div dangerouslySetInnerHTML={{ __html: data?.description || 'N/A' }} />
      ),
      span: 3,
    },
  ];

  return (
    <ModalComponent
      title={t('{{taskTypes}} detail', { taskTypes: data?.name })}
      open={modal.open}
      onCancel={handleClose}
      loading={isLoading}
      width={800}
      footer={[]}
    >
      <DescriptionComponent items={items} layout="horizontal" />
    </ModalComponent>
  );
};

export default ModalDetailTaskType;
