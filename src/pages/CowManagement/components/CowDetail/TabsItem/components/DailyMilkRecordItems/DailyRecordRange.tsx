import ButtonComponent from '@components/Button/ButtonComponent';
import LineSelectComponent from '@components/Chart/LineChart/LineSelectComponent';
import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
import FormComponent from '@components/Form/FormComponent';
import FormItemComponent from '@components/Form/Item/FormItemComponent';
import LabelForm from '@components/LabelForm/LabelForm';
import useFetcher from '@hooks/useFetcher';
import useToast from '@hooks/useToast';
import { Form, Skeleton } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { t } from 'i18next';
import { useState } from 'react';

interface DailyRecordRangeProps {
  id: any;
}
const DailyRecordRange = ({ id }: DailyRecordRangeProps) => {
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const toast = useToast();
  const [data, setData] = useState<any[]>([]);
  const { trigger, isLoading } = useFetcher(`dailymilks/range`);

  const onFinish = async (values: { startDate: any; endDate: any }) => {
    try {
      const response = await trigger({
        url: `dailymilks/range/${id}?startDate=${dayjs(values.startDate).format(
          'YYYY-MM-DD'
        )}&endDate=${dayjs(values.endDate).format('YYYY-MM-DD')}`,
      });
      setData(response);
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const disabledEndDate = (current: Dayjs) => {
    if (!startDate) return false;
    return (
      current.isBefore(startDate, 'day') ||
      current.isAfter(startDate.add(7, 'day'), 'day')
    );
  };
  return (
    <div>
      <FormComponent onFinish={onFinish} form={form}>
        <div className="flex gap-2">
          <FormItemComponent
            name="startDate"
            rules={[{ required: true }]}
            label={<LabelForm>{t('Start Date')}</LabelForm>}
          >
            <DatePickerComponent
              onChange={(date) => setStartDate(date)}
              allowClear={false}
            />
          </FormItemComponent>
          <FormItemComponent
            name="endDate"
            dependencies={['startDate']}
            rules={[
              { required: true, message: t('End Date is required') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startDate = getFieldValue('startDate');
                  if (!startDate || !value) {
                    return Promise.resolve();
                  }

                  const start = dayjs(startDate);
                  const end = dayjs(value);

                  if (end.isBefore(start)) {
                    return Promise.reject(
                      new Error(t('End Date must be after Start Date'))
                    );
                  }
                  if (end.diff(start, 'day') > 7) {
                    return Promise.reject(
                      new Error(
                        t('End Date must be within 7 days of Start Date')
                      )
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            label={<LabelForm>{t('End Date')}</LabelForm>}
          >
            <DatePickerComponent
              disabled={!startDate}
              disabledDate={disabledEndDate}
              allowClear={false}
            />
          </FormItemComponent>
          <ButtonComponent
            htmlType="submit"
            className="mt-[2.4em]"
            type="primary"
          >
            {t('Choose')}
          </ButtonComponent>
        </div>
      </FormComponent>
      {isLoading ? (
        <Skeleton />
      ) : (
        data.length > 0 && (
          <LineSelectComponent
            data={data}
            dataKeyY="milkDate"
            dataKeyLine="volume"
          />
        )
      )}
    </div>
  );
};

export default DailyRecordRange;
