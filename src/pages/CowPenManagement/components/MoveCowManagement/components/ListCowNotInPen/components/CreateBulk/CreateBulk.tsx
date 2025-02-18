import React, { useState } from 'react';
import { Table, DatePicker, Card, Row, Col, message, Button } from 'antd';
import type { DatePickerProps } from 'antd';
import dayjs from 'dayjs';
import ModalComponent from '../../../../../../../../components/Modal/ModalComponent';
import ButtonComponent from '../../../../../../../../components/Button/ButtonComponent';
import { Cow } from '../../../../../../../../model/Cow/Cow';
import useFetcher from '../../../../../../../../hooks/useFetcher';
import { PenEntity } from '../../../../../../../../model/CowPen/CowPen';
import { useTranslation } from 'react-i18next';

interface CreateBulkModalProps {
  modal: any;
  avalableCows: Cow[];
  availablePens: PenEntity[];
  mutate: any;
  mutateCows: any;
}

const CreateBulkModal: React.FC<CreateBulkModalProps> = ({
  modal,
  avalableCows,
  availablePens,
  mutate,
  mutateCows,
}) => {
  const { trigger, isLoading } = useFetcher('cow-pens/create-bulk', 'POST');
  const [selectedCows, setSelectedCows] = useState<number[]>([]);
  const [selectedPens, setSelectedPens] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState<string>('');
  const { t } = useTranslation();
  const handleCowSelection = (cowId: number) => {
    if (selectedCows.includes(cowId)) {
      setSelectedCows(selectedCows.filter((id) => id !== cowId));
    } else {
      setSelectedCows([...selectedCows, cowId]);
    }
  };

  const handlePenSelection = (penId: string, cowId: number) => {
    if (selectedPens.includes(penId)) {
      setSelectedPens(selectedPens.filter((id) => id !== penId));
    } else {
      setSelectedPens([...selectedPens, penId]);
    }
  };

  const onClose = () => {
    modal.closeModal();
  };

  const handleDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    setFromDate(date ? dayjs(date).format('YYYY-MM-DD') : '');
  };

  const handleSubmit = async () => {
    const payload = {
      cowEntities: selectedCows,
      penEntities: selectedPens,
      fromDate: fromDate,
    };

    try {
      const response = await trigger({ body: payload });
      message.success('Data submitted successfully');
      console.log(response.data);
      mutate();
      mutateCows();
      onClose();
    } catch (error) {
      message.error('Failed to submit data');
      console.error(error);
    }
  };

  const handleSelectAllCows = () => {
    const numPens = availablePens.length;

    if (selectedCows.length === numPens) {
      setSelectedCows([]);
      setSelectedPens([]);
    } else {
      const selectedCowIds = avalableCows.slice(0, numPens).map((cow) => cow.cowId);
      setSelectedCows(selectedCowIds);

      const selectedPenIds = availablePens.slice(0, selectedCowIds.length).map((pen) => pen.penId);
      setSelectedPens(selectedPenIds);
    }
  };

  const isSubmitDisabled = () => {
    return !(
      selectedCows.length > 0 &&
      selectedPens.length > 0 &&
      selectedCows.length === selectedPens.length &&
      fromDate
    );
  };

  // Table columns for cows
  const cowColumns = [
    {
      title: t('Select'),
      dataIndex: 'cowId',
      key: 'select',
      render: (cowId: number) => (
        <input
          type='checkbox'
          checked={selectedCows.includes(cowId)}
          onChange={() => handleCowSelection(cowId)}
        />
      ),
    },
    {
      title: t('Cow Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('Status'),
      dataIndex: 'cowStatus',
      key: 'cowStatus',
    },
  ];

  // Table columns for pens
  const penColumns = [
    {
      title: t('Select'),
      dataIndex: 'penId',
      key: 'select',
      render: (penId: string, record: any) => (
        <input
          type='checkbox'
          checked={selectedPens.includes(penId)}
          onChange={() => handlePenSelection(penId, record.cowId)}
          disabled={!selectedCows.includes(record.cowId)}
        />
      ),
    },
    {
      title: t('Pen Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('Status'),
      dataIndex: 'penStatus',
      key: 'penStatus',
    },
  ];

  return (
    <div style={{ marginBottom: '1rem' }}>
      <ButtonComponent onClick={modal.openModal} type='primary'>
        {t("Create Bulk")}
      </ButtonComponent>
      <ModalComponent
        title={t('Select Dairy Cows and Pens')}
        width={1000}
        open={modal.open}
        onCancel={onClose}
        footer={[
          <Button key='back' onClick={onClose}>
            {t("Cancel")}
          </Button>,
          <Button key='submit' type='primary' onClick={handleSubmit} disabled={isSubmitDisabled()}>
            {t("Submit")}
          </Button>,
        ]}
      >
        <Card bordered={false}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <h3>{t("Cows")}</h3>
              <Table
                dataSource={avalableCows}
                columns={cowColumns}
                rowKey='cowId'
                pagination={false}
              />
            </Col>
            <Col span={12}>
              <h3>{t("Pens")}</h3>
              <Table
                dataSource={availablePens}
                columns={penColumns}
                rowKey='penId'
                pagination={false}
              />
              {selectedPens.length > 0 && (
                <p style={{ color: 'green' }}>Selected Pens: {selectedPens.length}</p>
              )}
            </Col>
          </Row>
          <Row style={{ marginTop: '16px' }}>
            <Col span={16}>
              <DatePicker onChange={handleDateChange} format='YYYY-MM-DD' />
            </Col>
          </Row>
          <Button onClick={handleSelectAllCows} type='primary' style={{ margin: '10px 0' }}>
            {t("Select All Cows")} (Max {availablePens.length})
          </Button>
          {selectedCows.length !== selectedPens.length && (
            <p style={{ color: 'red', marginTop: '16px' }}>
              {t("The number of selected cows must match the number of selected pens.")}
            </p>
          )}
          {selectedCows.length > 0 && (
            <p style={{ color: 'green' }}>Selected Cows: {selectedCows.length}</p>
          )}
        </Card>
      </ModalComponent>
    </div>
  );
};

export default CreateBulkModal;
