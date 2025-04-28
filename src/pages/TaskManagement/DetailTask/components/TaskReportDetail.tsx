import DescriptionComponent from '@components/Description/DescriptionComponent';
import QuillRender from '@components/UI/QuillRender';
import Text from '@components/UI/Text';
import TextTitle from '@components/UI/TextTitle';
import { ReportTaskByDate } from '@model/Task/ReportTask';
import { formatDateHour, formatStatusWithCamel } from '@utils/format';
import { getImage } from '@utils/getImage';
import { statusColors } from '@utils/statusRender/taskStatusRender';
import { Image } from 'antd';
import { t } from 'i18next';

interface TaskReportDetailProps {
  report: ReportTaskByDate;
}
const TaskReportDetail = ({ report }: TaskReportDetailProps) => {
  return (
    <div className="flex flex-col gap-3">
      <DescriptionComponent
        layout="horizontal"
        className="!shadow-none"
        bordered={false}
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
            label: t('Date'),
            span: 3,
            children: report.date ? formatDateHour(report.date) : 'N/A',
          },
          {
            label: t('Start time'),
            span: 3,
            children: report.startTime
              ? formatDateHour(report.startTime)
              : t('Not start'),
          },
          {
            label: t('End time'),
            span: 3,
            children: report.endTime
              ? formatDateHour(report.endTime)
              : t('Not end'),
          },
          {
            label: t('Status'),
            span: 3,
            children: (
              <p className="text-black flex items-center gap-2 col-span-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: statusColors[report?.status],
                  }}
                ></span>
                {t(formatStatusWithCamel(report?.status))}
              </p>
            ),
          },
        ]}
      />
      <TextTitle
        title={t('Description')}
        description={<QuillRender description={report.description} />}
      />
      <TextTitle
        title={t('Image')}
        description={
          <div className="flex flex-wrap gap-5">
            {report.reportImages.length === 0 ? (
              <Text className="!text-red-500">{t('No images found')}</Text>
            ) : (
              report.reportImages.map((element) => (
                <Image src={getImage(element.url)} width={100} />
              ))
            )}
          </div>
        }
      />
      {report.reviewer_id === null ? (
        <Text className="!text-red-500">{t('Not comment yet')}</Text>
      ) : (
        <div className="flex flex-col gap-2">
          <TextTitle
            title={t('Review')}
            description={<QuillRender description={report.comment} />}
          />
          <p>
            {t('By')}: {report.reviewer_id.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskReportDetail;
