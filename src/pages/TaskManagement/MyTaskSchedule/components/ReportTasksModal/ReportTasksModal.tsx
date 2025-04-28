import DescriptionComponent from '@components/Description/DescriptionComponent';
import EmptyComponent from '@components/Error/EmptyComponent';
import ModalComponent from '@components/Modal/ModalComponent';
import QuillRender from '@components/UI/QuillRender';
import TagComponents from '@components/UI/TagComponents';
import TextTitle from '@components/UI/TextTitle';
import Title from '@components/UI/Title';
import useFetcher from '@hooks/useFetcher';
import { ModalActionProps } from '@hooks/useModal';
import { Task } from '@model/Task/Task';
import { TASK_PATH } from '@service/api/Task/taskApi';
import { formatDateHour, formatStatusWithCamel } from '@utils/format';
import { priorityColors } from '@utils/statusRender/taskStatusRender';
import { t } from 'i18next';
import { useEffect } from 'react';
import { MdModeNight, MdSunny } from 'react-icons/md';

interface ReportTasksModalProps {
  modal: ModalActionProps;
  taskId: number;
  mutate: any;
  day: string;
  setRefetch: any;
}

const ReportTasksModal = ({ modal, taskId, day }: ReportTasksModalProps) => {
  const { data: dataTask, isLoading: isLoadingTask } = useFetcher<Task>(
    TASK_PATH.TASK_DETAIL(taskId),
    'GET'
  );
  useEffect(() => {
    if (modal.open) {
    }
  }, [dataTask, modal.open]);
  return (
    <ModalComponent
      title={formatDateHour(day)}
      loading={isLoadingTask}
      open={modal.open}
      onCancel={modal.closeModal}
      width={1500}
    >
      <div className="flex gap-10">
        <div className="w-1/2">
          {dataTask ? (
            <div className="flex flex-col gap-4">
              <Title>{dataTask?.taskTypeId.name}</Title>
              <DescriptionComponent
                bordered={false}
                className="!shadow-none"
                layout="horizontal"
                labelStyle={{
                  fontSize: 16,
                  width: 140,
                  fontWeight: 'bold',
                  color: 'black',
                }}
                contentStyle={{
                  fontSize: 15,
                  fontWeight: 'normal',
                }}
                items={[
                  {
                    key: 'priority',
                    label: t('Priority'),
                    children: (
                      <p className="text-black flex items-center gap-2 col-span-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: priorityColors[dataTask?.priority],
                          }}
                        ></span>
                        {t(formatStatusWithCamel(dataTask?.priority))}
                      </p>
                    ),
                    span: 3,
                  },
                  {
                    key: 'area',
                    label: t('Area'),
                    children: (
                      <div className="flex items-center gap-2 ">
                        <p className="text-black">{dataTask?.areaId?.name}</p>
                        <TagComponents color="blue">
                          {formatStatusWithCamel(dataTask?.areaId?.areaType)}
                        </TagComponents>
                      </div>
                    ),
                    span: 3,
                  },
                  {
                    key: 'assignee',
                    label: t('Assignee'),
                    children: (
                      <div className="flex items-center gap-2 ">
                        <p className="text-black">{dataTask?.assignee?.name}</p>
                      </div>
                    ),
                    span: 3,
                  },
                  {
                    key: 'shift',
                    label: t('Shift'),
                    children: (
                      <div className="flex justify-center gap-1">
                        {dataTask.shift === 'dayShift' ? (
                          <MdSunny color="orange" size={25} />
                        ) : (
                          <MdModeNight color="blue" size={25} />
                        )}
                        <p
                          className={`!h-full text-base rounded-lg  ${
                            dataTask.shift === 'dayShift'
                              ? 'text-yellow-500'
                              : 'text-blue-500'
                          }`}
                        >
                          {t(formatStatusWithCamel(dataTask.shift))}
                        </p>
                      </div>
                    ),
                    span: 3,
                  },
                ]}
              />
              <TextTitle
                title={t('Description')}
                description={
                  <QuillRender description={dataTask?.description} />
                }
              />
            </div>
          ) : (
            <EmptyComponent />
          )}
        </div>
        <div className="w-1/2"></div>
      </div>
    </ModalComponent>
  );
};

export default ReportTasksModal;
