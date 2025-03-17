import ModalComponent from '@components/Modal/ModalComponent';
import useFetcher from '@hooks/useFetcher';
import { ModalActionProps } from '@hooks/useModal';
import { REPORT_TASK_PATH } from '@service/api/Task/reportTaskApi';
import { formatDateHour } from '@utils/format';
import { useEffect } from 'react';

interface ReportTasksModalProps {
  modal: ModalActionProps;
  taskId: number;
  mutate: any;
  day: string;
}

const ReportTasksModal = ({ modal, taskId, day }: ReportTasksModalProps) => {
  console.log(day, taskId);
  const { data, isLoading } = useFetcher(
    REPORT_TASK_PATH.REPORT_TASK_DATE(taskId, day),
    'GET'
  );
  useEffect(() => {
    if (modal.open) {
      console.log(data);
    }
  }, [data, modal.open]);
  return (
    <ModalComponent
      title={formatDateHour(day)}
      loading={isLoading}
      open={modal.open}
      onCancel={modal.closeModal}
    >
      ReportTaskModal
    </ModalComponent>
  );
};

export default ReportTasksModal;
