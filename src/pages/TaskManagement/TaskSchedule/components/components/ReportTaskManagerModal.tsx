import ModalComponent from '@components/Modal/ModalComponent';
import QuillRender from '@components/UI/QuillRender';
import TextTitle from '@components/UI/TextTitle';
import useFetcher from '@hooks/useFetcher';
import { ModalActionProps } from '@hooks/useModal';
import { ReportTaskByDate } from '@model/Task/ReportTask';
import { REPORT_TASK_PATH } from '@service/api/Task/reportTaskApi';
import { formatDateHour } from '@utils/format';
import { Empty } from 'antd';
import { t } from 'i18next';
import { useEffect } from 'react';

interface ReportTaskManagerModalProps {
  modal: ModalActionProps;
  taskId: number;
  mutate: any;
  day: string;
}

const ReportTaskManagerModal = ({
  modal,
  taskId,
  day,
}: ReportTaskManagerModalProps) => {
  const { data, isLoading } = useFetcher<ReportTaskByDate>(
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
      title={formatDateHour(data ? data?.startTime : new Date())}
      loading={isLoading}
      open={modal.open}
      onCancel={modal.closeModal}
      width={1000}
    >
      {data ? (
        <div>
          <TextTitle
            title="Time to do this task"
            description={`${
              data.startTime ? formatDateHour(data?.startTime) : t('Not start')
            } - ${data.endTime ? formatDateHour(data.endTime) : t('Not yet')}`}
          />
          <TextTitle
            title={t('Description')}
            description={
              <QuillRender
                description={data.description ? data.description : 'N/A'}
              />
            }
          />
        </div>
      ) : (
        <Empty />
      )}
    </ModalComponent>
  );
};

export default ReportTaskManagerModal;
