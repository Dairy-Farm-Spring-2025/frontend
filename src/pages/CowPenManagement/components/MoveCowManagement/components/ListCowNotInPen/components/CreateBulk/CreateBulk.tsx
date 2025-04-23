import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import CardComponent from '@components/Card/CardComponent';
import FormComponent from '@components/Form/FormComponent';
import SelectComponent from '@components/Select/SelectComponent';
import Title from '@components/UI/Title';
import { CowType } from '@model/Cow/CowType';
import { COW_TYPE_PATH } from '@service/api/CowType/cowType';
import { cowStatus } from '@service/data/cowStatus';
import { formatStatusWithCamel } from '@utils/format';
import { Alert, Badge, Card, Col, Divider, Form, message, Row, Table, Tooltip } from 'antd';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonComponent from '../../../../../../../../components/Button/ButtonComponent';
import ModalComponent from '../../../../../../../../components/Modal/ModalComponent';
import useFetcher from '../../../../../../../../hooks/useFetcher';
import { Cow } from '../../../../../../../../model/Cow/Cow';
import { Pen } from '../../../../../../../../model/Pen';
import EmptyComponent from '@components/Error/EmptyComponent';

interface CreateBulkModalProps {
  modal: any;
  availableCows: Cow[];
  mutateCows: any;
}

const CreateBulkModal: React.FC<CreateBulkModalProps> = ({ modal, availableCows, mutateCows }) => {
  const { trigger, isLoading } = useFetcher('cow-pens/create-bulk', 'POST');
  const { data: cowTypesData } = useFetcher<CowType[]>(COW_TYPE_PATH.COW_TYPES, 'GET');
  const [form] = Form.useForm();
  const selectedCowTypeId = Form.useWatch('cowTypeId', form);
  const selectedCowStatus = Form.useWatch('cowStatus', form);
  const { t } = useTranslation();

  // Convert selectedCowTypeId to number
  const selectedCowTypeIdAsNumber = selectedCowTypeId ? Number(selectedCowTypeId) : undefined;

  // Filter cowTypeOptions
  const cowTypeOptions = useMemo(() => {
    if (!cowTypesData) return [];
    return cowTypesData.map((cowType) => ({
      label: cowType.name,
      value: cowType.cowTypeId,
    }));
  }, [cowTypesData]);

  // Filter availableCows based on selectedCowTypeId and selectedCowStatus
  const filteredCows = useMemo(() => {
    if (!selectedCowTypeIdAsNumber || !selectedCowStatus) return [];
    return availableCows.filter(
      (cow) =>
        cow.cowType.cowTypeId === selectedCowTypeIdAsNumber && cow.cowStatus === selectedCowStatus
    );
  }, [availableCows, selectedCowTypeIdAsNumber, selectedCowStatus]);

  const cowStatusOptions = useMemo(() => cowStatus(), []);

  // Fetch pens with areaType fixed as 'cowHousing'
  const { data: availablePens } = useFetcher<Pen[]>(
    selectedCowTypeIdAsNumber && selectedCowStatus
      ? `pens/available/cow?areaType=cowHousing&cowTypeId=${selectedCowTypeIdAsNumber}&cowStatus=${selectedCowStatus}`
      : '',
    'GET'
  );

  const dataPenInArea = useMemo(
    () => availablePens?.filter((pen) => pen.penStatus === 'empty') || [],
    [availablePens]
  );

  const [selectedCows, setSelectedCows] = useState<number[]>([]);
  const [selectedPens, setSelectedPens] = useState<string[]>([]);

  const handleCowSelection = (cowId: number) => {
    setSelectedCows((prev) =>
      prev.includes(cowId) ? prev.filter((id) => id !== cowId) : [...prev, cowId]
    );
  };

  const handlePenSelection = (penId: string) => {
    setSelectedPens((prev) =>
      prev.includes(penId) ? prev.filter((id) => id !== penId) : [...prev, penId]
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
        .map((cow) => Number(cow.cowId));
      setSelectedCows(selectedCowIds);
      const selectedPenIds =
        dataPenInArea.slice(0, selectedCowIds.length).map((pen) => pen.penId) || [];
      setSelectedPens(selectedPenIds);
    }
  };

  const cowColumns = [
    {
      title: t('Select'),
      dataIndex: 'cowId',
      key: 'select',
      align: 'center' as const,
      width: 80,
      render: (cowId: number) => (
        <Tooltip title={selectedCows.includes(cowId) ? t('Deselect') : t('Select')}>
          <input
            type="checkbox"
            checked={selectedCows.includes(cowId)}
            onChange={() => handleCowSelection(cowId)}
            disabled={!selectedCowTypeIdAsNumber || !selectedCowStatus || !dataPenInArea.length}
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
      title: t('Cow Type'),
      dataIndex: 'cowType',
      key: 'cowType',
      render: (cowType: CowType) => cowType.name,
    },
    {
      title: t('Status'),
      dataIndex: 'cowStatus',
      key: 'cowStatus',
      render: (status: string) => (
        <Badge
          status={status === 'active' ? 'success' : 'default'}
          text={t(formatStatusWithCamel(status))}
        />
      ),
    },
  ];

  const penColumns = [
    {
      title: t('Select'),
      dataIndex: 'penId',
      key: 'select',
      align: 'center' as const,
      width: 80,
      render: (penId: string) => (
        <Tooltip title={selectedPens.includes(penId) ? t('Deselect') : t('Select')}>
          <input
            type="checkbox"
            checked={selectedPens.includes(penId)}
            onChange={() => handlePenSelection(penId)}
            disabled={!selectedCowTypeIdAsNumber || !selectedCowStatus || !dataPenInArea.length}
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
          text={t(formatStatusWithCamel(status))}
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
        title={t('Create Bulk Cow')}
        width={1200}
        open={modal.open}
        onCancel={onClose}
        footer={
          <div className="flex justify-end space-x-4">
            <ButtonComponent
              key="back"
              onClick={onClose}
              disabled={isLoading}
              size="large"
              danger
            >
              {t('Cancel')}
            </ButtonComponent>
            <ButtonComponent
              key="submit"
              type="primary"
              onClick={handleSubmit}
              loading={isLoading}
              disabled={selectedCows.length !== selectedPens.length || !selectedCows.length}
              size="large"
            >
              {t('Submit')}
            </ButtonComponent>
          </div>
        }
        className="rounded-xl shadow-2xl"
      >
        <CardComponent bordered={false} className="bg-gray-50 rounded-lg">
          <FormComponent form={form} layout="vertical">
            <div className="mb-8">
              <Title className="text-blue-600 mb-6 flex items-center">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">
                  1
                </span>
                {t('Step 1: Choose Cow Type and Cow Status')}
              </Title>
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
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
                <Col xs={24} md={12}>
                  <Form.Item
                    name="cowStatus"
                    rules={[{ required: true, message: t('Please select a cow status') }]}
                  >
                    <SelectComponent
                      style={{ width: '100%' }}
                      options={cowStatusOptions}
                      placeholder={t('Select cow status')}
                      size="large"
                      disabled={!selectedCowTypeIdAsNumber}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {selectedCowTypeIdAsNumber && selectedCowStatus && !filteredCows.length && (
                <Alert
                  message={t('No cows available for the selected criteria')}
                  type="error"
                  showIcon
                  className="mt-3 rounded-lg"
                />
              )}
              {selectedCowTypeIdAsNumber && selectedCowStatus && !dataPenInArea.length && (
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
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2">
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
                      locale={{ emptyText: <EmptyComponent /> }}
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
                      locale={{ emptyText: <EmptyComponent /> }}
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

              <ButtonComponent
                onClick={handleSelectAllCows}
                type="primary"
                size="large"
                disabled={
                  !selectedCowTypeIdAsNumber ||
                  !selectedCowStatus ||
                  !dataPenInArea.length ||
                  !filteredCows.length
                }
                className="hover:bg-blue-600 transition-colors"
              >
                {selectedCows.length > 0 ? t('Deselect All') : t('Select All Cows')}{' '}
                ({selectedCows.length}/{dataPenInArea?.length || 0})
              </ButtonComponent>
            </div>
          </FormComponent>
        </CardComponent>
      </ModalComponent>
    </div>
  );
};

export default CreateBulkModal;