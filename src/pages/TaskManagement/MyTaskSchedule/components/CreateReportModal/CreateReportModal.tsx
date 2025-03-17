import ModalComponent from '@components/Modal/ModalComponent';
import { ModalActionProps } from '@hooks/useModal';
import { t } from 'i18next';

interface CreateReportModalProps {
  modal: ModalActionProps;
  mutate: any;
  taskId: number;
}
const CreateReportModal = ({
  modal,
  mutate,
  taskId,
}: CreateReportModalProps) => {
  const handleClose = () => {
    modal.closeModal();
  };
  console.log(mutate);
  console.log(taskId);
  return (
    <ModalComponent
      open={modal.open}
      onCancel={handleClose}
      title={t('Create report')}
    >
      CreateReportModal
    </ModalComponent>
  );
};

export default CreateReportModal;
