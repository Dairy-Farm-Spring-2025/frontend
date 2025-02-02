import React, { useState } from 'react';
import { Checkbox, Button, DatePicker, Card, Row, Col, message } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { DatePickerProps } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import ModalComponent from '../../../../../../../../components/Modal/ModalComponent';
import ButtonComponent from '../../../../../../../../components/Button/ButtonComponent';
import { Cow } from '../../../../../../../../model/Cow/Cow';
import { Pen } from '../../../../../../../../model/Pen';

interface CreateBulkModalProps {
  modal: any;
  avalableCows: Cow[];
  availablePens: Pen[];
}

const CreateBulkModal: React.FC<CreateBulkModalProps> = ({
  modal,
  avalableCows,
  availablePens,
}) => {
  const [selectedCows, setSelectedCows] = useState<number[]>([]);
  const [selectedPens, setSelectedPens] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState<string>('');

  const handleCowSelection = (e: CheckboxChangeEvent, cowId: number) => {
    if (e.target.checked) {
      setSelectedCows([...selectedCows, cowId]);
    } else {
      setSelectedCows(selectedCows.filter((id) => id !== cowId));
    }
  };

  const handlePenSelection = (e: CheckboxChangeEvent, penId: string) => {
    if (e.target.checked) {
      setSelectedPens([...selectedPens, penId]);
    } else {
      setSelectedPens(selectedPens.filter((id) => id !== penId));
    }
  };

  const onClose = () => {
    modal.closeModal();
  };

  const handleDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setFromDate(date ? dayjs(date).format('YYYY-MM-DD') : ''); // Ensure empty string when cleared
  };

  const handleSubmit = async () => {
    const payload = {
      cowEntities: selectedCows,
      penEntities: selectedPens,
      fromDate: fromDate,
    };

    try {
      const response = await axios.post('/api/your-endpoint', payload);
      message.success('Data submitted successfully');
      console.log(response.data);
      onClose();
    } catch (error) {
      message.error('Failed to submit data');
      console.error(error);
    }
  };

  const handleSelectAllCows = () => {
    const numPens = availablePens.length;

    if (selectedCows.length === numPens) {
      // If already selected, deselect all
      setSelectedCows([]);
      setSelectedPens([]);
    } else {
      // Otherwise, select up to the number of pens
      const selectedCowIds = avalableCows.slice(0, numPens).map((cow) => cow.cowId);
      setSelectedCows(selectedCowIds);

      const selectedPenIds = availablePens.slice(0, selectedCowIds.length).map((pen) => pen.penId);
      setSelectedPens(selectedPenIds);
    }
  };

  // Validate submit button
  const isSubmitDisabled = () => {
    return !(
      (
        selectedCows.length > 0 &&
        selectedPens.length > 0 &&
        selectedCows.length === selectedPens.length &&
        fromDate
      ) // Ensures date is selected (non-empty string)
    );
  };

  return (
    <div style={{ marginBottom: '1.2rem' }}>
      <ButtonComponent onClick={modal.openModal} type='primary'>
        Create Area
      </ButtonComponent>
      <ModalComponent
        title='Select Dairy Cows and Pens'
        width={1000}
        open={modal.open}
        onCancel={onClose}
        footer={[
          <Button key='back' onClick={onClose}>
            Cancel
          </Button>,
          <Button key='submit' type='primary' onClick={handleSubmit} disabled={isSubmitDisabled()}>
            Submit
          </Button>,
        ]}
      >
        <Card bordered={false}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <h3>Cows</h3>
              {avalableCows.map((cow) => (
                <div key={cow.cowId}>
                  <Checkbox
                    checked={selectedCows.includes(cow.cowId)}
                    onChange={(e) => handleCowSelection(e, cow.cowId)}
                  >
                    {cow.name} - {cow.cowStatus}
                  </Checkbox>
                </div>
              ))}
              {selectedCows.length > 0 && (
                <p style={{ color: 'green' }}>Selected Cows: {selectedCows.length}</p>
              )}
            </Col>
            <Col span={12}>
              <h3>Pens</h3>
              {availablePens.map((pen) => (
                <div key={pen.penId}>
                  <Checkbox
                    checked={selectedPens.includes(pen.penId)}
                    onChange={(e) => handlePenSelection(e, pen.penId)}
                  >
                    {pen.name} - {pen.penStatus}
                  </Checkbox>
                </div>
              ))}
              {selectedPens.length > 0 && (
                <p style={{ color: 'green' }}>Selected Pens: {selectedPens.length}</p>
              )}
            </Col>
          </Row>
          <Row style={{ marginTop: '16px' }}>
            <Col style={{ display: 'flex', justifyItems: 'center' }} span={16}>
              <DatePicker onChange={handleDateChange} format='YYYY-MM-DD' />
              <Button onClick={handleSelectAllCows} type='primary' style={{ marginBottom: '10px' }}>
                Select All Cows (Max {availablePens.length})
              </Button>
            </Col>
          </Row>
          {selectedCows.length !== selectedPens.length && (
            <p style={{ color: 'red', marginTop: '16px' }}>
              The number of selected cows must match the number of selected pens.
            </p>
          )}
        </Card>
      </ModalComponent>
    </div>
  );
};

export default CreateBulkModal;
