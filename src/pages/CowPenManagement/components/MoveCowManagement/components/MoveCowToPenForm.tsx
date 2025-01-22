import React, { FC } from 'react';
import { Form, Select, Button } from 'antd';
import { CowPen } from '../../../../../model/CowPen/CowPen';

const { Option } = Select;

interface MoveCowToPenFormProps {
  cowPenData: CowPen[];
  availablePens: CowPen[];
  selectedCow: string | null;
  setSelectedCow: (value: string | null) => void;
  selectedPen: string | null;
  setSelectedPen: (value: string | null) => void;
  handleMove: () => void;
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
  return (
    <div className='w-full max-w-lg bg-white shadow-md rounded-lg p-6'>
      <Form layout='vertical'>
        <Form.Item label={<span className='font-semibold'>Select Cow</span>}>
          <Select
            placeholder='Choose a cow'
            onChange={(value) => setSelectedCow(value)}
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
        <Form.Item label={<span className='font-semibold'>Select Pen</span>}>
          <Select
            placeholder='Choose a pen'
            onChange={(value) => setSelectedPen(value)}
            allowClear
            size='large'
            className='rounded-lg'
          >
            {availablePens.map((item) => (
              <Option key={item.penEntity.penId} value={item.penEntity.penId.toString()}>
                🏠 {item.penEntity.name} ({item.penEntity.penType})
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Button
          type='primary'
          size='large'
          onClick={handleMove}
          className='w-full rounded-lg'
          disabled={!selectedCow || !selectedPen}
        >
          Move Cow to Pen
        </Button>
      </Form>
      <div className='mt-6'>
        <div className='text-lg font-medium mb-4'>Current Selection</div>
        <div className='flex justify-between items-center'>
          <div className='text-gray-700'>
            <strong>Cow:</strong> {selectedCow || 'None'}
          </div>
          <div className='text-gray-700'>
            <strong>Pen:</strong> {selectedPen || 'None'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveCowToPenForm;
