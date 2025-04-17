import React, { useState, useMemo } from 'react';
import { Table, Card, Row, Col, message, Button, Divider, Form, Badge, Tooltip, Alert, Steps } from 'antd';
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
import { CowType } from '@model/Cow/CowType';
import { COW_TYPE_PATH } from '@service/api/CowType/cowType';
import { cowStatus } from '@service/data/cowStatus';

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
  const { data: cowTypesData } = useFetcher<CowType[]>(COW_TYPE_PATH.COW_TYPES, 'GET');
  const [form] = Form.useForm();
  const selectedAreaId = Form.useWatch('selectedAreaId', form);
  const selectedCowTypeId = Form.useWatch('cowTypeId', form);
  const selectedCowStatus = Form.useWatch('cowStatus', form);
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  // Memoize options to prevent unnecessary re-renders
  const cowTypeOptions = useMemo(
    () =>
      cowTypesData?.map((cowType) => ({
        label: cowType.name,
        value: cowType.cowTypeId,
      })) || [],
    [cowTypesData]
  );

  const areaOptions = useMemo(
    () =>
      dataArea?.map((area) => ({
        label: area.name,
        value: area.areaId,
      })) || [],
    [dataArea]
  );

  // Find selected area's details
  const selectedArea = dataArea?.find(area => area.areaId === selectedAreaId);
  const selectedAreaType = selectedArea?.areaType;
  const selectedAreaDescription = selectedArea?.description;

  // Format areaType for display
  const formattedAreaType = selectedAreaType
    ? selectedAreaType
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
    : '';

  // Fetch pens based on areaType, cowTypeId, and cowStatus
  const { data: availablePens } = useFetcher<Pen[]>(
    selectedAreaType && selectedCowTypeId && selectedCowStatus
      ? `pens/available/cow?areaType=${selectedAreaType}&cowTypeId=${selectedCowTypeId}&cowStatus=${selectedCowStatus}`
      : '',
    'GET'
  );

  const dataPenInArea = availablePens?.filter(pen => pen.penStatus === 'empty') || [];
  const [selectedCows, setSelectedCows] = useState<number[]>([]);
  const [selectedPens, setSelectedPens] = useState<string[]>([]);

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
    setCurrentStep(0);
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
    if (selectedCows.length > 0) {
      setSelectedCows([]);
      setSelectedPens([]);
    } else {
      const selectedCowIds = availableCows.slice(0, numPens).map(cow => Number(cow.cowId));
      setSelectedCows(selectedCowIds);
      const selectedPenIds = dataPenInArea?.slice(0, selectedCowIds.length).map(pen => pen.penId) || [];
      setSelectedPens(selectedPenIds);
    }
    setCurrentStep(2);
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
            disabled={!selectedAreaId || !selectedCowTypeId || !selectedCowStatus || !dataPenInArea.length}
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
            disabled={!selectedAreaId || !selectedCowTypeId || !selectedCowStatus || !dataPenInArea.length}
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

  const cowStatusOptions = cowStatus();

  const steps = [
    { title: t('Select Criteria') },
    { title: t('Select Cows & Pens') },
    { title: t('Confirm') },
  ];

  return (
    <div className="mb-4">
      <ButtonComponent
        onClick={() => {
          modal.openModal();
          setCurrentStep(0);
        }}
        type="primary"
        icon={<CheckCircleOutlined />}
        size="large"
      >
        {t('Move a large number of Cow')}
      </ButtonComponent>
      <ModalComponent

        width={1200}
        open={modal.open}
        onCancel={onClose}
        footer={
          <div className="flex justify-end space-x-4">
            <Button key="back" onClick={onClose} disabled={isLoading} size="large">
              {t('Cancel')}
            </Button>
            <Button
              key="submit"
              type="primary"
              onClick={handleSubmit}
              loading={isLoading}
              disabled={selectedCows.length !== selectedPens.length || !selectedCows.length}
              size="large"
            >
              {t('Submit')}
            </Button>
          </div>
        }
        className="rounded-xl shadow-2xl"
      >
        <Steps current={currentStep} items={steps} className="mb-8" />
        <Card bordered={false} className="p-6 bg-gray-50 rounded-lg">
          <Form
            form={form}
            layout="vertical"
            onValuesChange={() => {
              if (selectedAreaId && selectedCowTypeId && selectedCowStatus) setCurrentStep(1);
            }}
          >
            {/* Step 1: Area, CowType, and CowStatus Selection */}
            <div className="mb-8">
              <Title className="text-blue-600 mb-6 flex items-center">
                <span className="inline-block w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">
                  1
                </span>
                {t('Step 1: Choose Area, Cow Type and Cow Status')}
              </Title>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="selectedAreaId"
                    rules={[{ required: true, message: t('Please select an area') }]}
                  >
                    <SelectComponent
                      style={{ width: '100%' }}
                      options={areaOptions}
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
                  {selectedAreaId && selectedAreaDescription && (
                    <div className="mt-3 p-4 border border-gray-200 rounded-lg bg-white shadow-sm transition-all">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">{t('Area Description')}:</h4>
                      <div
                        className="text-gray-600 text-sm leading-relaxed mb-2"
                        dangerouslySetInnerHTML={{ __html: selectedAreaDescription }}
                      />
                      <div className="text-gray-600 text-sm">
                        <span className="font-medium">{t('Area Type')}:</span> {formattedAreaType}
                      </div>
                    </div>
                  )}
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="cowTypeId"
                    rules={[{ required: true, message: t('Please select a cow type') }]}
                  >
                    <SelectComponent
                      style={{ width: '100%' }}
                      options={cowTypeOptions}
                      placeholder={t('Select cow type')}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="cowStatus"
                    rules={[{ required: true, message: t('Please select a cow status') }]}
                  >
                    <SelectComponent
                      style={{ width: '100%' }}
                      options={cowStatusOptions}
                      placeholder={t('Select cow status')}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
              {selectedAreaId && selectedCowTypeId && selectedCowStatus && !dataPenInArea.length && (
                <Alert
                  message={t('No empty pens available for the selected criteria')}
                  type="error"
                  showIcon
                  className="mt-3 rounded-lg"
                />
              )}
            </div>

            <Divider className="my-10 border-gray-300" />

            {/* Step 2: Cows and Pens Selection */}
            <div className="mb-8">
              <Title className="text-blue-600 mb-6 flex items-center">
                <span className="inline-block w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">
                  2
                </span>
                {t('Step 2: Select Cows and Pens')}
              </Title>
              <Row gutter={[24, 24]} align="stretch">
                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <span className="text-lg font-semibold">
                        {t('Cows')}{' '}
                        <Badge count={selectedCows.length} className="ml-2" style={{ backgroundColor: '#1890ff' }} />
                      </span>
                    }
                    bordered={false}
                    className="shadow-md h-full bg-white rounded-lg"
                  >
                    <Table
                      dataSource={availableCows}
                      columns={cowColumns}
                      rowKey="cowId"
                      pagination={{ pageSize: 7 }}
                      size="middle"
                      rowClassName="hover:bg-blue-50 transition-colors"
                      scroll={{ x: 'max-content' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <span className="text-lg font-semibold">
                        {t('Pens')}{' '}
                        <Badge count={selectedPens.length} className="ml-2" style={{ backgroundColor: '#1890ff' }} />
                      </span>
                    }
                    bordered={false}
                    className="shadow-md h-full bg-white rounded-lg"
                  >
                    <Table
                      dataSource={dataPenInArea}
                      columns={penColumns}
                      rowKey="penId"
                      pagination={{ pageSize: 7 }}
                      size="middle"
                      rowClassName="hover:bg-blue-50 transition-colors"
                      scroll={{ x: 'max-content' }}
                    />
                  </Card>
                </Col>
              </Row>
              {selectedCows.length !== selectedPens.length && (
                <Alert
                  message={t('Selected cows must match selected pens', {
                    count0: selectedCows.length,
                    count1: selectedPens.length,
                  })}
                  type="warning"
                  showIcon
                  className="mt-4 rounded-lg text-center"
                />
              )}
            </div>

            <Divider className="my-10 border-gray-300" />

            {/* Step 3: Actions */}
            <div className="text-center">
              <Title className="text-blue-600 mb-6 flex items-center justify-center">
                <span className="inline-block w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">
                  3
                </span>
                {t('Confirm Selection')}
              </Title>
              <ButtonComponent
                onClick={handleSelectAllCows}
                type="primary"
                size="large"
                disabled={!selectedAreaId || !selectedCowTypeId || !selectedCowStatus || !dataPenInArea.length}
                className="hover:bg-blue-600 transition-colors"
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