import ButtonComponent from '@components/Button/ButtonComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ReactQuillComponent from '@components/ReactQuill/ReactQuillComponent';
import QuillRender from '@components/UI/QuillRender';
import TextTitle from '@components/UI/TextTitle';
import Title from '@components/UI/Title';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { ReportTaskDate } from '@model/Task/ReportTask';
import { REPORT_TASK_PATH } from '@service/api/Task/reportTaskApi';
import { getImage } from '@utils/getImage';
import { Divider, Form, Image } from 'antd';
import { t } from 'i18next';

interface CommentReportProps {
  selectedTask: ReportTaskDate;
  mutate: any;
}

const CommentReport = ({ selectedTask, mutate }: CommentReportProps) => {
  const [form] = Form.useForm();
  const toast = useToast();
  const { isLoading, trigger } = useFetcher(
    REPORT_TASK_PATH.REVIEW_REPORT(selectedTask?.reportTaskId),
    'PUT'
  );

  const handleFinish = async (values: any) => {
    try {
      const response = await trigger({ body: values });
      toast.showSuccess(response.message);
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Title>{selectedTask?.taskId.taskTypeId.name}</Title>
      <p className="text-gray-500">
        <span className="font-bold text-black">{t('Assignee')}</span>:{' '}
        {selectedTask?.taskId.assignee.name}
      </p>
      <Divider className="my-2" />
      <div className="flex flex-col gap-5">
        <TextTitle
          title={t('Description')}
          description={
            <QuillRender
              description={
                selectedTask?.description ? selectedTask?.description : 'N/A'
              }
            />
          }
        />
        <TextTitle
          title={t('Image')}
          description={
            selectedTask && selectedTask.reportImages.length > 0 ? (
              <div className="flex gap-5">
                {selectedTask?.reportImages?.map((element) => (
                  <Image width={150} src={getImage(element.url)} />
                ))}
              </div>
            ) : (
              <p className="text-base">{t('No images found')}</p>
            )
          }
        />
      </div>
      <Divider className="my-2" />
      <Title>{t('Review')}</Title>
      {selectedTask?.status !== 'closed' ? (
        <FormComponent form={form} onFinish={handleFinish}>
          <FormItemComponent
            name="comment"
            label={<LabelForm>{t('Review the task')}:</LabelForm>}
            rules={[{ required: true }]}
          >
            <ReactQuillComponent />
          </FormItemComponent>
          <div className="w-full flex justify-end">
            <ButtonComponent
              loading={isLoading}
              htmlType="submit"
              type="primary"
            >
              {t('Review')}
            </ButtonComponent>
          </div>
        </FormComponent>
      ) : (
        <TextTitle
          title={t('Review')}
          description={
            <QuillRender
              description={
                selectedTask?.comment ? selectedTask?.comment : 'N/A'
              }
            />
          }
        />
      )}
    </div>
  );
};

export default CommentReport;
