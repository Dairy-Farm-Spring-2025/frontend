import ButtonComponent from '@components/Button/ButtonComponent';
import DescriptionComponent from '@components/Description/DescriptionComponent';
import QuillRender from '@components/UI/QuillRender';
import TagComponents from '@components/UI/TagComponents';
import TextTitle from '@components/UI/TextTitle';
import Title from '@components/UI/Title';
import { Task } from '@model/Task/Task';
import { formatStatusWithCamel } from '@utils/format';
import { priorityColors } from '@utils/statusRender/taskStatusRender';
import { t } from 'i18next';
import { MdModeNight, MdSunny } from 'react-icons/md';

interface MyTaskGeneralDetailProps {
  dataTask: Task;
  setType: any;
}

const MyTaskGeneralDetail = ({
  dataTask,
  setType,
}: MyTaskGeneralDetailProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Title>{dataTask?.taskTypeId?.name}</Title>
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
          ...(dataTask?.areaId
            ? [
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
              ]
            : []),
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
            key: 'assigner',
            label: t('Assigner'),
            children: (
              <div className="flex items-center gap-2 ">
                <p className="text-black">{dataTask?.assigner?.name}</p>
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
        description={<QuillRender description={dataTask?.description} />}
      />
      <div className="flex gap-5">
        {dataTask.illness && (
          <ButtonComponent
            onClick={() => setType('illness')}
            type="primary"
            buttonType="warning"
          >
            {t('View illness')}
          </ButtonComponent>
        )}
        {dataTask.vaccineInjection && (
          <ButtonComponent
            onClick={() => setType('vaccine-injection')}
            type="primary"
            buttonType="secondary"
          >
            {t('View vaccine injection')}
          </ButtonComponent>
        )}
        <ButtonComponent onClick={() => setType('report')} type="primary">
          {t('View report')}
        </ButtonComponent>
        <ButtonComponent
          onClick={() => setType('use-equipment')}
          type="primary"
          buttonType="thirdly"
        >
          {t('View equipment')}
        </ButtonComponent>
      </div>
    </div>
  );
};

export default MyTaskGeneralDetail;
