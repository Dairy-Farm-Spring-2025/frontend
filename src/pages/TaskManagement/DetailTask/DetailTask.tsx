import EmptyComponent from '@components/Error/EmptyComponent';
import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import useFetcher from '@hooks/useFetcher';
import { ReportTaskByDate } from '@model/Task/ReportTask';
import { Task } from '@model/Task/Task';
import { REPORT_TASK_PATH } from '@service/api/Task/reportTaskApi';
import { TASK_PATH } from '@service/api/Task/taskApi';
import { Skeleton } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import MyTaskGeneralDetail from './components/MyTaskGeneralDetail';
import TaskReportDetail from './components/TaskReportDetail';
import { t } from 'i18next';
import Title from '@components/UI/Title';

const DetailTask = () => {
  const { taskId, day } = useParams();
  const [typeView, setTypeView] = useState<
    'illness' | 'report' | 'vaccine-injection' | ''
  >('');
  const { data: dataTaskReport } = useFetcher<ReportTaskByDate>(
    REPORT_TASK_PATH.REPORT_TASK_DATE(taskId as any, day as any),
    'GET'
  );
  const { data: dataTask, isLoading: isLoadingTask } = useFetcher<Task>(
    TASK_PATH.TASK_DETAIL(taskId as any),
    'GET'
  );

  console.log(dataTaskReport);

  return (
    <AnimationAppear>
      <WhiteBackground>
        <Skeleton loading={isLoadingTask}>
          <div className="flex gap-10">
            <div className="w-1/2">
              {dataTask ? (
                <MyTaskGeneralDetail
                  setType={setTypeView}
                  dataTask={dataTask}
                />
              ) : (
                <EmptyComponent />
              )}
            </div>
            <div className="w-1/2">
              {typeView === '' && <></>}
              {typeView === 'illness' && <>ILNNESS</>}
              {typeView === 'vaccine-injection' && <>VACCINE</>}
              {typeView === 'report' &&
                (dataTaskReport !== undefined && dataTaskReport !== null ? (
                  <TaskReportDetail
                    report={dataTaskReport as ReportTaskByDate}
                  />
                ) : (
                  <Title>{t('Not have report')}</Title>
                ))}
            </div>
          </div>
        </Skeleton>
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default DetailTask;
