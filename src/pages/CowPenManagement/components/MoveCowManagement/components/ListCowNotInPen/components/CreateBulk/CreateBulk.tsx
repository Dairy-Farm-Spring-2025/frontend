import React, { useState, useMemo, useEffect } from 'react';
import { Table, Card, Row, Col, message, Button, Divider, Form, Badge, Tooltip, Alert } from 'antd';
import ModalComponent from '../../../../../../../../components/Modal/ModalComponent';
import ButtonComponent from '../../../../../../../../components/Button/ButtonComponent';
import { Cow } from '../../../../../../../../model/Cow/Cow';
import useFetcher from '../../../../../../../../hooks/useFetcher';
import { Pen } from '../../../../../../../../model/Pen';
import { useTranslation } from 'react-i18next';
import SelectComponent from '@components/Select/SelectComponent';
import { Area } from '@model/Area';
import Title from '@components/UI/Title';
import { formatAreaType, formatStatusWithCamel } from '@utils/format';
import { CheckCircleOutlined, EnvironmentOutlined, InfoCircleOutlined } from '@ant-design/icons';
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

  // Convert selectedCowTypeId to number
  const selectedCowTypeIdAsNumber = selectedCowTypeId ? Number(selectedCowTypeId) : undefined;

  // Find selected area's details
  const selectedArea = useMemo(
    () => dataArea?.find(area => area.areaId === selectedAreaId),
    [dataArea, selectedAreaId]
  );
  const selectedAreaType: "cowHousing" | "milkingParlor" | "wareHouse" | undefined = selectedArea?.areaType;
  const selectedAreaDescription = selectedArea?.description;

  // Filter cowTypeOptions based on selectedArea's cowTypeEntity
  const cowTypeOptions = useMemo(() => {
    if (!cowTypesData) return [];
    const selectedAreaCowTypeId = selectedArea?.cowTypeEntity?.cowTypeId
      ? Number(selectedArea.cowTypeEntity.cowTypeId)
      : undefined;
    if (!selectedAreaCowTypeId) {
      return cowTypesData.map((cowType) => ({
        label: cowType.name,
        value: cowType.cowTypeId,
      }));
    }
    return cowTypesData
      .filter((cowType) => cowType.cowTypeId === selectedAreaCowTypeId)
      .map((cowType) => ({
        label: cowType.name,
        value: cowType.cowTypeId,
      }));
  }, [cowTypesData, selectedArea]);

  // Filter availableCows based on selectedCowTypeId and selectedCowStatus
  const filteredCows = useMemo(() => {
    if (!selectedCowTypeIdAsNumber || !selectedCowStatus) return [];
    return availableCows.filter(
      (cow) =>
        cow.cowType.cowTypeId === selectedCowTypeIdAsNumber &&
        cow.cowStatus === selectedCowStatus
    );
  }, [availableCows, selectedCowTypeIdAsNumber, selectedCowStatus]);

  const areaOptions = useMemo(
    () =>
      dataArea?.map((area) => ({
        label: area.name,
        value: area.areaId,
      })) || [],
    [dataArea]
  );

  const cowStatusOptions = useMemo(() => cowStatus(), []);

  // Reset cowTypeId and cowStatus when selectedAreaId changes
  useEffect(() => {
    if (selectedAreaId) {
      if (selectedArea?.cowTypeEntity?.cowTypeId) {
        form.setFieldsValue({ cowTypeId: Number(selectedArea.cowTypeEntity.cowTypeId) });
      } else {
        form.setFieldsValue({ cowTypeId: undefined });
      }
      form.setFieldsValue({ cowStatus: undefined });
    } else {
      form.setFieldsValue({ cowTypeId: undefined, cowStatus: undefined });
    }
  }, [selectedAreaId, selectedArea, form]);

  // Fetch pens based on areaType, cowTypeId, and cowStatus
  const { data: availablePens } = useFetcher<Pen[]>(
    selectedAreaType && selectedCowTypeIdAsNumber && selectedCowStatus
      ? `pens/available/cow?areaType=${selectedAreaType}&cowTypeId=${selectedCowTypeIdAsNumber}&cowStatus=${selectedCowStatus}`
      : '',
    'GET'
  );

  const dataPenInArea = useMemo(
    () => availablePens?.filter(pen => pen.penStatus === 'empty') || [],
    [availablePens]
  );

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
      message.success(t('Moved cows successfully'));
      mutateCows();
      onClose();
    } catch (error) {
      message.error(t('Failed to move cows'));
      console.error(error);
    }
  };

  const handleSelectAllCows = () => {
    const numPens = dataPenInArea?.length || 0;
    if (selectedCows.length > 0) {
      setSelectedCows([]);
      setSelectedPens([]);
    } else {
      const selectedCowIds = filteredCows
        .slice(0, numPens)
        .map(cow => Number(cow.cowId));
      setSelectedCows(selectedCowIds);
      const selectedPenIds = dataPenInArea
        .slice(0, selectedCowIds.length)
        .map(pen => pen.penId) || [];
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
            disabled={
              !selectedAreaId ||
              !selectedCowTypeIdAsNumber ||
              !selectedCowStatus ||
              !dataPenInArea.length
            }
          />
        </Tooltip>
      ),
    },
    {
      title: t('Cow Name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Cow, b: Cow) => a.name.localeCompare(b.name),
    },
    {
      title: t('Status'),
      dataIndex: 'cowStatus',
      key: 'cowStatus',
      render: (status: string) => (
        <Badge
          status={status === 'active' ? 'success' : 'default'}
          text={formatStatusWithCamel(status)}
        />
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
            disabled={
              !selectedAreaId ||
              !selectedCowTypeIdAsNumber ||
              !selectedCowStatus ||
              !dataPenInArea.length
            }
          />
        </Tooltip>
      ),
    },
    {
      title: t('Pen Name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Pen, b: Pen) => a.name.localeCompare(b.name),
    },
    {
      title: t('Status'),
      dataIndex: 'penStatus',
      key: 'penStatus',
      render: (status: string) => (
        <Badge
          status={status === 'empty' ? 'success' : 'default'}
          text={formatStatusWithCamel(status)}
        />
      ),
    },
  ];

  return (
    <div className="mb-4">
      <ButtonComponent
        onClick={() => {
          modal.openModal();
        }}
        type="primary"
        icon={<CheckCircleOutlined />}
        size="large"
      >
        {t('Move a large number of Cows')}
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
        <Card bordered={false} className="p-6 bg-gray-50 rounded-lg">
          <Form form={form} layout="vertical">
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
                  {selectedAreaId && (
                    <div className="mt-4 p-6 bg-white border border-gray-200 rounded-lg shadow-sm transition-all">
                      <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                        <EnvironmentOutlined className="mr-2 text-blue-500" />
                        {t('Area Details')}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <span className="w-32 text-sm font-medium text-gray-600 shrink-0">
                            {t('Description')}:
                          </span>
                          <div
                            className="text-sm text-gray-700 flex-1"
                            dangerouslySetInnerHTML={{
                              __html: selectedAreaDescription || t('No description available'),
                            }}
                          />
                        </div>
                        <div className="flex items-center">
                          <span className="w-32 text-sm font-medium text-gray-600 shrink-0">
                            {t('Area Type')}:
                          </span>
                          <span className="text-sm text-gray-700 flex-1">
                            {formatAreaType(selectedAreaType) || t('N/A')}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-32 text-sm font-medium text-gray-600 shrink-0">
                            {t('Cow Type')}:
                          </span>
                          <span className="text-sm text-gray-700 flex-1">
                            <Tooltip title={selectedArea?.cowTypeEntity?.description || t('No description')}>
                              <span className="font-semibold text-blue-600">
                                {selectedArea?.cowTypeEntity?.name || t('N/A')}
                              </span>
                            </Tooltip>
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-32 text-sm font-medium text-gray-600 shrink-0">
                            {t('Pen Status')}:
                          </span>
                          <span className="text-sm text-gray-700 flex-1">
                            {t('Occupied')}: <span className="text-red-600">{selectedArea?.occupiedPens || 0}</span>,{' '}
                            {t('Empty')}: <span className="text-green-600">{selectedArea?.emptyPens || 0}</span>,{' '}
                            {t('Damaged')}: <span className="text-yellow-600">{selectedArea?.damagedPens || 0}</span>
                          </span>
                        </div>
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
                      disabled={!selectedAreaId}
                      suffixIcon={
                        selectedArea?.cowTypeEntity?.cowTypeId ? (
                          <Tooltip title={t('Cow Type is restricted to match the selected area')}>
                            <InfoCircleOutlined className="text-gray-500" />
                          </Tooltip>
                        ) : null
                      }
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
                      disabled={!selectedAreaId || !selectedCowTypeIdAsNumber}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {selectedAreaId && selectedCowTypeIdAsNumber && selectedCowStatus && !filteredCows.length && (
                <Alert
                  message={t('No cows available for the selected criteria')}
                  type="error"
                  showIcon
                  className="mt-3 rounded-lg"
                />
              )}
              {selectedAreaId && selectedCowTypeIdAsNumber && selectedCowStatus && !dataPenInArea.length && (
                <Alert
                  message={t('No empty pens available for the selected criteria')}
                  type="error"
                  showIcon
                  className="mt-3 rounded-lg"
                />
              )}
            </div>

            <Divider className="my-10 border-gray-300" />

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
                        <Badge
                          count={selectedCows.length}
                          className="ml-2"
                          style={{ backgroundColor: '#1890ff' }}
                        />
                      </span>
                    }
                    bordered={false}
                    className="shadow-md h-full bg-white rounded-lg"
                  >
                    <Table
                      dataSource={filteredCows}
                      columns={cowColumns}
                      rowKey="cowId"
                      pagination={{ pageSize: 7 }}
                      size="middle"
                      rowClassName="hover:bg-blue-50 transition-colors"
                      scroll={{ x: 'max-content' }}
                      locale={{ emptyText: t('No cows available') }}
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card
                    title={
                      <span className="text-lg font-semibold">
                        {t('Pens')}{' '}
                        <Badge
                          count={selectedPens.length}
                          className="ml-2"
                          style={{ backgroundColor: '#1890ff' }}
                        />
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
                      locale={{ emptyText: t('No pens available') }}
                    />
                  </Card>
                </Col>
              </Row>
              {selectedCows.length !== selectedPens.length && selectedCows.length > 0 && (
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
                disabled={
                  !selectedAreaId ||
                  !selectedCowTypeIdAsNumber ||
                  !selectedCowStatus ||
                  !dataPenInArea.length ||
                  !filteredCows.length
                }
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