import { DatePicker, Form } from 'antd';
import LabelForm from '../../../LabelForm/LabelForm';
import FormItemComponent from '../FormItemComponent';

interface DateRangeItemProps {
  disable?: boolean;
}

const DateRangeItem = ({ disable = false }: DateRangeItemProps) => {
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
        <DatePicker
          disabled={disable}
          format="YYYY-MM-DD"
          placeholder="Start date"
          className="!w-full"
          disabledDate={disablePastDates}
        />
      </FormItemComponent>

      {/* End Date */}
      <FormItemComponent
        label={<LabelForm>End Date:</LabelForm>}
        name="endDate"
        dependencies={['startDate']}
        rules={[{ required: true }]}
      >
        <DatePicker
          disabled={disable}
          format="YYYY-MM-DD"
          placeholder="End date"
          className="!w-full"
          disabledDate={disablePastDates}
        />
      </FormItemComponent>
    </>
  );
};

export default DateRangeItem;
