import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
import Text from '@components/UI/Text';
import TextBorder from '@components/UI/TextBorder';
import { formatDateHour } from '@utils/format';
import { Form } from 'antd';
import LabelForm from '../../../LabelForm/LabelForm';
import FormItemComponent from '../FormItemComponent';

interface DateRangeItemProps {
  disable?: boolean;
  edited?: boolean;
  startDate?: string;
  endDate?: string;
}

const DateRangeItem = ({
  disable = false,
  edited = true,
  startDate = new Date().toISOString(),
  endDate = new Date().toISOString(),
}: DateRangeItemProps) => {
  const dateNow = new Date();
  const [form] = Form.useForm(); // Access the form instance

  // const validateEndDate = (_: any, value: any) => {
  //   const startDate = form.getFieldValue('startDate');
  //   console.log(startDate);
  //   if (startDate && value && value.isAfter(startDate)) {
  //     return Promise.resolve();
  //   }
  //   return Promise.reject(new Error('End date must be after start date'));
  // };

  const validateStartDate = (_: any, value: any) => {
    const endDate = form.getFieldValue('endDate');
    if (value && endDate && !endDate.isAfter(value)) {
      return Promise.reject(new Error('Start date must be before end date'));
    }
    return Promise.resolve();
  };

  const disablePastDates = (current: any) => {
    return current && current.isBefore(dateNow, 'day');
  };

  return (
    <>
      {/* Start Date */}
      <FormItemComponent
        label={<LabelForm>Start Date:</LabelForm>}
        name="startDate"
        rules={[
          { required: true },
          {
            validator: (rule, value) => validateStartDate(rule, value),
          },
        ]}
      >
        {!edited ? (
          <TextBorder>
            <Text>{formatDateHour(startDate)}</Text>
          </TextBorder>
        ) : (
          <DatePickerComponent
            disabled={disable}
            placeholder="Start date"
            className="!w-full"
            disabledDate={disablePastDates}
          />
        )}
      </FormItemComponent>

      {/* End Date */}
      <FormItemComponent
        label={<LabelForm>End Date:</LabelForm>}
        name="endDate"
        dependencies={['startDate']}
        rules={[{ required: true }]}
      >
        {!edited ? (
          <TextBorder>
            <Text>{formatDateHour(endDate)}</Text>
          </TextBorder>
        ) : (
          <DatePickerComponent
            disabled={disable}
            placeholder="End date"
            className="!w-full"
            disabledDate={disablePastDates}
          />
        )}
      </FormItemComponent>
    </>
  );
};

export default DateRangeItem;
