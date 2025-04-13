import React, { useState } from 'react';
import { Table, Card, Row, Col, message, Button, Divider, Form, Badge, Tooltip } from 'antd';
import ModalComponent from '../../../../../../../../components/Modal/ModalComponent';
import ButtonComponent from '../../../../../../../../components/Button/ButtonComponent';
import { Cow } from '../../../../../../../../model/Cow/Cow';
import useFetcher from '../../../../../../../../hooks/useFetcher';
import { Pen } from '../../../../../../../../model/Pen';
import { useTranslation } from 'react-i18next';
import SelectComponent from '@components/Select/SelectComponent';
import { Area } from '@model/Area';
import Title from '@components/UI/Title';
import { formatStatusWithCamel } from '@utils/format';
import { CheckCircleOutlined } from '@ant-design/icons';

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
    setSelectedCows(prev =>
      prev.includes(cowId) ? prev.filter(id => id !== cowId) : [...prev, cowId]
    );
  };

  const handlePenSelection = (penId: string) => {
    setSelectedPens(prev =>
      prev.includes(penId) ? prev.filter(id => id !== penId) : [...prev, penId]
    );
  };

  const onClose = () => {
    setSelectedCows([]);
    setSelectedPens([]);
    form.resetFields();
    modal.closeModal();
  };

  const handleSubmit = async () => {
    if (selectedCows.length !== selectedPens.length) {
      message.error(t('Number of cows must match number of pens'));
      return;
    }
    const payload = { cowEntities: selectedCows, penEntities: selectedPens };
    try {
      await trigger({ body: payload });
      message.success(t('Di chuyển bò thành công'));
      mutateCows();
      onClose();
    } catch (error) {
      message.error(t('Di chuyển bò thất bại !'));
      console.error(error);
    }
  };

  const handleSelectAllCows = () => {
    const numPens = dataPenInArea?.length || 0;
    if (selectedCows.length > 0) { // Chỉ kiểm tra số bò đã chọn
      setSelectedCows([]);
      setSelectedPens([]);
    } else {
      const selectedCowIds = availableCows.slice(0, numPens).map(cow => Number(cow.cowId));
      setSelectedCows(selectedCowIds);
      const selectedPenIds = dataPenInArea?.slice(0, selectedCowIds.length).map(pen => pen.penId) || [];
      setSelectedPens(selectedPenIds);
    }
  };

  const cowColumns = [
    {
      title: t('Select'),
      dataIndex: 'cowId',
      key: 'select',
      width: 60,
      render: (cowId: number) => (
        <Tooltip title={selectedCows.includes(cowId) ? t('Deselect') : t('Select')}>
          <input
            type="checkbox"
            checked={selectedCows.includes(cowId)}
            onChange={() => handleCowSelection(cowId)}
            disabled={!selectedArea || !dataPenInArea.length}
          />
        </Tooltip>
      ),
    },
    { title: t('Cow Name'), dataIndex: 'name', key: 'name', sorter: (a: Cow, b: Cow) => a.name.localeCompare(b.name) },
    {
      title: t('Status'),
      dataIndex: 'cowStatus',
      key: 'cowStatus',
      render: (status: string) => (
        <Badge status={status === 'active' ? 'success' : 'default'} text={formatStatusWithCamel(status)} />
      ),
    },
  ];

  const penColumns = [
    {
      title: t('Select'),
      dataIndex: 'penId',
      key: 'select',
      width: 60,
      render: (penId: string) => (
        <Tooltip title={selectedPens.includes(penId) ? t('Deselect') : t('Select')}>
          <input
            type="checkbox"
            checked={selectedPens.includes(penId)}
            onChange={() => handlePenSelection(penId)}
            disabled={!selectedArea || !dataPenInArea.length}
          />
        </Tooltip>
      ),
    },
    { title: t('Pen Name'), dataIndex: 'name', key: 'name', sorter: (a: Pen, b: Pen) => a.name.localeCompare(b.name) },
    {
      title: t('Status'),
      dataIndex: 'penStatus',
      key: 'penStatus',
      render: (status: string) => (
        <Badge status={status === 'empty' ? 'success' : 'default'} text={formatStatusWithCamel(status)} />
      ),
    },
  ];

  return (
    <div className="mb-4">
      <ButtonComponent onClick={modal.openModal} type="primary" icon={<CheckCircleOutlined />}>
        {t('Move a large number of Cow')}
      </ButtonComponent>
      <ModalComponent
        title={t('Bulk Cow Movement')}
        width={1100}
        open={modal.open}
        onCancel={onClose}
        footer={[
          <Button key="back" onClick={onClose} disabled={isLoading}>
            {t('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            loading={isLoading}
            disabled={selectedCows.length !== selectedPens.length || !selectedCows.length}
          >
            {t('Submit')}
          </Button>,
        ]}
        className="rounded-lg shadow-lg"
      >
        <Card bordered={false} className="p-4">
          <Form form={form} layout="vertical">
            {/* Step 1: Area Selection */}
            <div className="mb-8">
              <Title className="text-blue-600 mb-4">
                {t('Step 1: Choose Area')}
              </Title>
              <Form.Item name="selectedArea" rules={[{ required: true, message: t('Please select an area') }]}>
                <SelectComponent
                  style={{ width: '100%', maxWidth: 400 }}
                  options={dataArea?.map(area => ({ value: area.areaId, label: area.name })) || []}
                  placeholder={t('Select an area')}
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    typeof option?.label === 'string'
                      ? option.label.toLowerCase().includes(input.toLowerCase())
                      : false
                  }
                />
              </Form.Item>
              {selectedArea && !dataPenInArea.length && (
                <p className="text-red-500 mt-2">{t('No empty pens available in this area')}</p>
              )}
            </div>

            <Divider dashed className="my-8" />

            {/* Step 2: Cows and Pens Selection */}
            <div className="mb-8">
              <Title className="text-blue-600 mb-4">
                {t('Step 2: Select Cows and Pens')}
              </Title>
              <Row gutter={[24, 24]} align="stretch">
                <Col span={12}>
                  <Card
                    title={<span>{t('Cows')} <Badge count={selectedCows.length} className="ml-2" /></span>}
                    bordered={false}
                    className="shadow-sm h-full"
                  >
                    <Table
                      dataSource={availableCows}
                      columns={cowColumns}
                      rowKey="cowId"
                      pagination={{ pageSize: 7 }}
                      size="small"
                      rowClassName={() => 'hover:bg-gray-50'}
                    />
                  </Card>
                </Col>
                <Col span={12} style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '-12px',
                      top: 0,
                      bottom: 0,
                      width: '2px',
                      backgroundColor: '#d9d9d9',
                      zIndex: 1,
                    }}
                  />
                  <Card
                    title={<span>{t('Pens')} <Badge count={selectedPens.length} className="ml-2" /></span>}
                    bordered={false}
                    className="shadow-sm h-full"
                  >
                    <Table
                      dataSource={dataPenInArea}
                      columns={penColumns}
                      rowKey="penId"
                      pagination={{ pageSize: 7 }}
                      size="small"
                      rowClassName={() => 'hover:bg-gray-50'}
                    />
                  </Card>
                </Col>
              </Row>
              {selectedCows.length !== selectedPens.length && (
                <p className="text-red-500 mt-4 text-center">
                  {t('Selected cows must match selected pens', {
                    count0: selectedCows.length,
                    count1: selectedPens.length,
                  })}
                </p>
              )}
            </div>

            <Divider dashed className="my-8" />

            {/* Step 3: Actions */}
            <div className="text-center">
              <ButtonComponent
                onClick={handleSelectAllCows}
                type="primary"
                size="large"
                disabled={!selectedArea || !dataPenInArea.length}
                className="mr-4 hover:bg-blue-50"
              >
                {selectedCows.length > 0 ? t('Deselect All') : t('Select All Cows')} (
                {selectedCows.length}/{dataPenInArea?.length || 0})
              </ButtonComponent>
            </div>
          </Form>
        </Card>
      </ModalComponent>
    </div>
  );
};

export default CreateBulkModal;