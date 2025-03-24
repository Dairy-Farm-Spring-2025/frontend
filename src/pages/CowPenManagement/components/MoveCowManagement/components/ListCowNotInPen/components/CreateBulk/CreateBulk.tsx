
import React, { useState } from 'react';
import { Table, Card, Row, Col, message, Button, Divider, Form } from 'antd';
import ModalComponent from '../../../../../../../../components/Modal/ModalComponent';
import ButtonComponent from '../../../../../../../../components/Button/ButtonComponent';
import { Cow } from '../../../../../../../../model/Cow/Cow';
import useFetcher from '../../../../../../../../hooks/useFetcher';
import { Pen } from '../../../../../../../../model/Pen';
import { useTranslation } from 'react-i18next';
import SelectComponent from '@components/Select/SelectComponent';
import { Area } from '@model/Area';
import Title from '@components/UI/Title';

interface CreateBulkModalProps {
  modal: any;
  availableCows: Cow[];
  mutateCows: any;
}

const CreateBulkModal: React.FC<CreateBulkModalProps> = ({
  modal,
  availableCows,
  mutateCows,
}) => {
  const { trigger, isLoading } = useFetcher('cow-pens/create-bulk', 'POST');
  const { data: dataArea } = useFetcher<Area[]>('areas', 'GET');
  const [form] = Form.useForm();
  const selectedArea = Form.useWatch('selectedArea', form);
  const { data: allPensInArea } = useFetcher<Pen[]>(
    selectedArea ? `pens/area/${selectedArea}` : '',
    'GET'
  );
  const dataPenInArea = allPensInArea?.filter(pen => pen.penStatus === 'empty') || [];
  const [selectedCows, setSelectedCows] = useState<number[]>([]);
  const [selectedPens, setSelectedPens] = useState<string[]>([]);
  const { t } = useTranslation();

  const handleCowSelection = (cowId: number) => {
    if (selectedCows.includes(cowId)) {
      setSelectedCows(selectedCows.filter((id) => id !== cowId));
    } else {
      setSelectedCows([...selectedCows, cowId]);
    }
  };

  const handlePenSelection = (penId: string) => {
    if (selectedPens.includes(penId)) {
      setSelectedPens(selectedPens.filter((id) => id !== penId));
    } else {
      setSelectedPens([...selectedPens, penId]);
    }
  };

  const onClose = () => {
    setSelectedCows([]);
    setSelectedPens([]);
    form.resetFields();
    modal.closeModal();
  };

  const handleSubmit = async () => {
    const payload = {
      cowEntities: selectedCows,
      penEntities: selectedPens,
    };

    try {
      const response = await trigger({ body: payload });
      message.success(t('Data submitted successfully'));
      console.log(response.data);
      mutateCows();
      onClose();
    } catch (error) {
      message.error(t('Failed to submit data'));
      console.error(error);
    }
  };

  const handleSelectAllCows = () => {
    const numPens = dataPenInArea?.length || 0;

    if (selectedCows.length === numPens) {
      setSelectedCows([]);
      setSelectedPens([]);
    } else {
      const selectedCowIds = availableCows.slice(0, numPens).map((cow) => Number(cow.cowId));
      setSelectedCows(selectedCowIds);
      const selectedPenIds = dataPenInArea?.slice(0, selectedCowIds.length).map((pen) => pen.penId) || [];
      setSelectedPens(selectedPenIds);
    }
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
          disabled={!selectedArea || dataPenInArea.length === 0} // Disable nếu chưa chọn Area hoặc không có pen trống
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
      render: (penId: string) => (
        <input
          type='checkbox'
          checked={selectedPens.includes(penId)}
          onChange={() => handlePenSelection(penId)}
          disabled={!selectedArea || dataPenInArea.length === 0} // Disable nếu chưa chọn Area hoặc không có pen trống
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
    <div className="mb-4">
      <ButtonComponent onClick={modal.openModal} type='primary'>
        {t('Move a large number of Cow')}
      </ButtonComponent>
      <ModalComponent
        title={t('Select Area, Pens and Cows to Move')}
        width={1000}
        open={modal.open}
        onCancel={onClose}
        footer={[
          <Button key='back' onClick={onClose}>
            {t('Cancel')}
          </Button>,
          <Button key='submit' type='primary' onClick={handleSubmit} loading={isLoading}>
            {t('Submit')}
          </Button>,
        ]}
        className="rounded-lg"
        styles={{ wrapper: { height: '100vh', top: 0, paddingBottom: 0 }, body: { height: 'calc(80vh - 60px)', overflowY: 'auto' } }}
      >
        <Card bordered={false} className="p-6">
          <Form form={form}>
            {/* Section 1: Area Selection */}
            <div className="mb-6">
              <Title className="mb-4">{t('1. Choose Area First')}</Title>
              <Form.Item name="selectedArea">
                <SelectComponent
                  style={{ width: 300 }}
                  options={dataArea?.map(area => ({ value: area.areaId, label: area.name })) || []}
                  onChange={(value) => form.setFieldsValue({ selectedArea: value })}
                  placeholder={t('Please select an area')}
                  size="large"
                />
              </Form.Item>
              {selectedArea && dataPenInArea.length === 0 && (
                <p className="text-red-600 mt-2">
                  {t('No empty pens available in this area. Please select another area.')}
                </p>
              )}
            </div>

            <Divider className="my-6" />

            {/* Section 2: Cows and Pens Selection */}
            <div className="mb-6">
              <Title className="mb-4">{t('2. Select Cows and Pens')}</Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card title={t('Cows')} bordered={false} className="h-full">
                    <Table
                      dataSource={availableCows}
                      columns={cowColumns}
                      rowKey="cowId"
                      pagination={{ pageSize: 7 }}
                      size="small"
                      className="custom-table"
                    />
                    {selectedCows.length > 0 && (
                      <p className="text-green-600 mt-2">Selected Cows: {selectedCows.length}</p>
                    )}
                    {selectedCows.length !== selectedPens.length && (
                      <p className="text-red-600 mt-4">
                        {t('The number of selected cows must match the number of selected pens.')}
                      </p>
                    )}
                  </Card>

                </Col>
                <Col span={12}>
                  <Card title={t('Pens')} bordered={false} className="h-full">
                    <Table
                      dataSource={dataPenInArea}
                      columns={penColumns}
                      rowKey="penId"
                      pagination={{ pageSize: 7 }}
                      size="small"
                      className="custom-table"
                    />
                    {selectedPens.length > 0 && (
                      <p className="text-green-600 mt-2">Selected Pens: {selectedPens.length}</p>
                    )}
                  </Card>

                </Col>

              </Row>

            </div>

            <Divider className="my-6" />

            {/* Section 3: Actions */}
            <div>
              <Button
                onClick={handleSelectAllCows}
                type="primary"
                className="mb-4"
                disabled={!selectedArea || dataPenInArea.length === 0} // Disable nếu chưa chọn Area hoặc không có pen trống
              >
                {t('Select All Cows')} (Max {dataPenInArea?.length || 0})
              </Button>
              {/* <Button onClick={handleSelectAllCows} type='primary' style={{ margin: '10px 0' }}>
            {t("Select All Cows")} (Max {dataPenInArea?.length || 0})
          </Button> */}
              {/* {selectedCows.length !== selectedPens.length && (
                <p style={{ color: 'red', marginTop: '16px' }}>
                  {t("The number of selected cows must match the number of selected pens.")}
                </p>
              )}
              {selectedCows.length > 0 && (
                <p style={{ color: 'green' }}>Selected Cows: {selectedCows.length}</p>
              )} */}
            </div>
          </Form>
        </Card>
      </ModalComponent>
    </div>
  );
};

export default CreateBulkModal;

