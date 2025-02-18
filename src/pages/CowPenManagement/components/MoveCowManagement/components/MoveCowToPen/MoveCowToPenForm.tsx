import React, { FC, useState } from 'react';
import { Form, Select, Button, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { CowPen, PenEntity } from '../../../../../../model/CowPen/CowPen';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface MoveCowToPenFormProps {
  cowPenData: CowPen[];
  availablePens: PenEntity[];
  selectedCow: string | null;
  setSelectedCow: (value: string | null) => void;
  selectedPen: string | null;
  setSelectedPen: (value: string | null) => void;
  handleMove: (fromDate: dayjs.Dayjs | null, toDate: dayjs.Dayjs | null) => void;
}

const MoveCowToPenForm: FC<MoveCowToPenFormProps> = ({
  cowPenData,
  availablePens,
  selectedCow,
  setSelectedCow,
  selectedPen,
  setSelectedPen,
  handleMove,
}) => {
  const [dates, setDates] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);
  const { t } = useTranslation();
  const handleDateChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    if (!dates) return;
    const [fromDate, toDate] = dates;

    if (fromDate?.isBefore(dayjs(), 'day')) {
      message.error('From Date must be today or in the future.');
      setDates([null, null]);
    } else if (toDate && fromDate?.isAfter(toDate, 'day')) {
      message.error('To Date must be after From Date.');
      setDates([null, null]);
    } else {
      setDates([fromDate, toDate]);
    }
  };

  return (
    <div className='w-full max-w-lg bg-white shadow-md rounded-lg p-6'>
      <Form layout='vertical'>
        <Form.Item label={<span className='font-semibold'>{t("Select Cow")}</span>}>
          <Select
            placeholder='Choose a cow'
            onChange={setSelectedCow}
            allowClear
            size='large'
            className='rounded-lg'
          >
            {cowPenData?.map((item) => (
              <Option key={item.cowEntity.cowId} value={item.cowEntity.cowId.toString()}>
                🐄 {item.cowEntity.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label={<span className='font-semibold'>{t("Select Pen")}</span>}>
          <Select
            placeholder='Choose a pen'
            onChange={setSelectedPen}
            allowClear
            size='large'
            className='rounded-lg'
          >
            {availablePens.map((item) => (
              <Option key={item.penId} value={item.penId.toString()}>
                🏠 {item.name} ({item.penType})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label={<span className='font-semibold'>{t("Select Date Range")}</span>}>
          <RangePicker
            size='large'
            className='rounded-lg w-full'
            disabledDate={(date) => date.isBefore(dayjs(), 'day')}
            onChange={handleDateChange}
          />
        </Form.Item>

        <Button
          type='primary'
          size='large'
          onClick={() => handleMove(dates[0], dates[1])}
          className='w-full rounded-lg'
          disabled={!selectedCow || !selectedPen || !dates[0]}
        >
          {t("Move Cow to Pen")}
        </Button>
      </Form>

      <div className='mt-6'>
        <div className='text-lg font-medium mb-4'>{t("Current Selection")}</div>
        <div className='text-gray-700'>
          <strong>{t("Cow")}:</strong> {selectedCow || 'None'}
        </div>
        <div className='text-gray-700'>
          <strong>{t("Pen")}:</strong> {selectedPen || 'None'}
        </div>
        <div className='text-gray-700'>
          <strong>{t("From Date")}:</strong> {dates[0] ? dates[0].format('YYYY-MM-DD') : 'None'}
        </div>
        <div className='text-gray-700'>
          <strong>{t("To Date")}:</strong> {dates[1] ? dates[1].format('YYYY-MM-DD') : 'None'}
        </div>
      </div>
    </div>
  );
};

export default MoveCowToPenForm;
