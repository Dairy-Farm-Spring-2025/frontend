import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import ModalComponent from '@components/Modal/ModalComponent';
import SelectComponent from '@components/Select/SelectComponent';
import TagComponents from '@components/UI/TagComponents';
import TextTitle from '@components/UI/TextTitle';
import useFetcher from '@hooks/useFetcher';
import { ModalActionProps } from '@hooks/useModal';
import { Area } from '@model/Area';
import { formatStatusWithCamel } from '@utils/format';
import { Divider, Form } from 'antd';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { LiaChartAreaSolid } from 'react-icons/lia';

interface TaskCreateModalProps {
  modal: ModalActionProps;
  data?: any;
}
const TaskCreateModal = ({ modal }: TaskCreateModalProps) => {
  const { data: dataTaskTypes } = useFetcher<any[]>('task_types', 'GET');
  const { data: dataAreas } = useFetcher<Area[]>('areas', 'GET');
  const [optionsAreas, setOptionsArea] = useState<any[]>([]);
  const [optionsDataTaskTypes, setOptionDataTaskTypes] = useState<any[]>([]);
  const [form] = Form.useForm();
  const formValues = Form.useWatch([], form);
  const [disabledButton, setDisabledButton] = useState(true);

  useEffect(() => {
    if (dataAreas && dataTaskTypes) {
      setOptionDataTaskTypes(
        dataTaskTypes.map((element) => ({
          label: element.name,
          value: element.taskTypeId,
          desc: element,
          searchLabel: element.name,
        }))
      );
      setOptionsArea(
        dataAreas.map((element) => ({
          label: element.name,
          value: element.areaId,
          desc: element,
          searchLabel: element.name,
        }))
      );
    }
  }, [dataAreas, dataTaskTypes]);

  useEffect(() => {
    const isButtonDisabled =
      !formValues || Object.values(formValues).some((value) => !value);
    setDisabledButton(isButtonDisabled);
  }, [formValues]);

  const disabledFromDate = (current: dayjs.Dayjs) => {
    return current && current.isBefore(dayjs().startOf('day'));
  };

  const disabledToDate = (current: dayjs.Dayjs) => {
    const fromDate = form.getFieldValue('fromDate');
    if (!fromDate) {
      return false;
    }
    const minDate = dayjs(fromDate).startOf('day');
    const maxDate = dayjs(fromDate).add(7, 'day').endOf('day');
    return current && (current.isBefore(minDate) || current.isAfter(maxDate));
  };
  return (
    <ModalComponent
      open={modal.open}
      title="Add task"
      onCancel={modal.closeModal}
      disabledButtonOk={disabledButton}
    >
      <FormComponent form={form}>
        <FormItemComponent
          name="fromDate"
          label={<LabelForm>From Date</LabelForm>}
          rules={[{ required: true }]}
        >
          <DatePickerComponent disabledDate={disabledFromDate} />
        </FormItemComponent>
        <FormItemComponent
          label={<LabelForm>To Date</LabelForm>}
          name="toDate"
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const fromDate = getFieldValue('fromDate');
                if (!value || !fromDate) {
                  return Promise.resolve();
                }
                if (dayjs(value).isBefore(dayjs(fromDate))) {
                  return Promise.reject(
                    new Error('To Date must be after From Date!')
                  );
                }
                if (dayjs(value).diff(dayjs(fromDate), 'day') > 7) {
                  return Promise.reject(
                    new Error('To Date must be within 7 days from From Date!')
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <DatePickerComponent disabledDate={disabledToDate} />
        </FormItemComponent>
        <FormItemComponent
          name="areaId"
          label={<LabelForm>Area</LabelForm>}
          rules={[{ required: true }]}
        >
          <SelectComponent
            options={optionsAreas}
            listHeight={400}
            search
            optionRender={(option) => {
              const area: Area = option?.data?.desc;
              return (
                <div className="py-5 ">
                  <div className="flex gap-3 items-center">
                    <LiaChartAreaSolid size={20} />
                    <p className="font-bold text-base">{area.name}</p>
                    <TagComponents color="blue" className="!text-sm">
                      {formatStatusWithCamel(area.areaType)}
                    </TagComponents>
                  </div>
                  <Divider className="my-1" />
                  <div className="grid grid-cols-3">
                    <TextTitle
                      title={t('Pen size')}
                      description={`${area.penLength}(m) x ${area.penWidth}(m)`}
                    />
                    <TextTitle
                      title={t('Dimension')}
                      description={`${area.length}(m) x ${area.width}(m)`}
                    />
                  </div>
                  <div className="grid grid-cols-3 mt-2 ">
                    <TextTitle
                      title={t('Occupied')}
                      description={`${area.occupiedPens} pen`}
                    />
                    <TextTitle
                      title={t('Empty')}
                      description={`${area.emptyPens} pen`}
                    />
                    <TextTitle
                      title={t('Damaged')}
                      description={`${area.damagedPens} pen`}
                    />
                  </div>
                </div>
              );
            }}
          />
        </FormItemComponent>
        <FormItemComponent
          name="taskTypeId"
          label={<LabelForm>Task Type</LabelForm>}
          rules={[{ required: true }]}
        >
          <SelectComponent options={optionsDataTaskTypes} />
        </FormItemComponent>
      </FormComponent>
    </ModalComponent>
  );
};

export default TaskCreateModal;
