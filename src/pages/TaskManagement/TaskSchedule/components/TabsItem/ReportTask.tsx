import DatePickerComponent from '@components/DatePicker/DatePickerComponent';
import SelectComponent from '@components/Select/SelectComponent';
import TableComponent, { Column } from '@components/Table/TableComponent';
import TextTitle from '@components/UI/TextTitle';
import Title from '@components/UI/Title';
import dayjs from 'dayjs';
import { t } from 'i18next';
import React, { useState } from 'react';

const ReportTask = () => {
  const [day, setDay] = useState<any>(dayjs(new Date()));
  const handleChangeDay = (value: any) => {
    setDay(dayjs(value));
  };
  const columns: Column[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
  ];
  return (
    <div className="flex flex-col gap-5">
      <TextTitle
        title={t('Select date to view report')}
        description={
          <DatePickerComponent
            value={day}
            onChange={handleChangeDay}
            className="!w-1/5"
            allowClear={false}
          />
        }
      />
      <div className="flex gap-5">
        <div className="w-1/2 flex flex-col gap-5">
          <TableComponent columns={columns} dataSource={[]} />
        </div>
        <div className="w-1/2">
          <Title>Comment</Title>
        </div>
      </div>
    </div>
  );
};

export default ReportTask;
