import { Button, Col, message, Popconfirm, Row, Select, Tooltip } from 'antd';
import type { Key } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import ModalComponent from '../../../../../components/Modal/ModalComponent';
import TableComponent from '../../../../../components/Table/TableComponent';
import AnimationAppear from '../../../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../../../components/UI/WhiteBackground';
import useFetcher from '../../../../../hooks/useFetcher';
import { formatAreaType } from '../../../../../utils/format';

interface ModalMilkBatchDetailProps {
  milkBatchId: number;
  modal: any;
  mutate: any;
}

interface Worker {
  name: string;
  phoneNumber: string;
  roleId: { name: string };
  employeeNumber: string;
}

interface Cow {
  cowId: string;
  name: string;
  cowTypeEntity: { name: string };
  cowStatus: string;
  cowOrigin: string;
  gender: string;
}

interface Milk {
  dailyMilkId: number;
  shift: string;
  milkDate: string;
  volume: number;
  worker: Worker;
  cow: Cow;
}

const ModalMilkBatchDetail: React.FC<ModalMilkBatchDetailProps> = ({
  modal,
  milkBatchId,
  mutate,
}) => {
  const {
    data,
    isLoading,
    mutate: refreshData,
  } = useFetcher<any>(`MilkBatch/${milkBatchId}`, 'GET');
  const { trigger } = useFetcher<any>(`MilkBatch/${milkBatchId}`, 'PUT');
  const { data: availableDailyMilk, mutate: fetchAvailableDailyMilk } =
    useFetcher<any>(`dailymilks/search_available`, 'GET');

  const [selectedMilkIds, setSelectedMilkIds] = useState<number[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [tempSelectedMilks, setTempSelectedMilks] = useState<Milk[]>([]);

  /** Chọn Daily Milk từ Select */
  const handleSelectDailyMilk = (selectedIds: number[]) => {
    setSelectedMilkIds(selectedIds);
    if (!availableDailyMilk) return;

    const milkMap = new Map(
      availableDailyMilk?.map((milk: Milk) => [milk.dailyMilkId, milk])
    );
    setTempSelectedMilks(
      selectedIds.map((id) => milkMap.get(id)).filter(Boolean) as Milk[]
    );
  };

  const handleBatchUpdate = async () => {
    if (!tempSelectedMilks.length && !selectedRowKeys.length) {
      message.warning(
        'Please select at least one Daily Milk ID to add or remove.'
      );
      return;
    }

    try {
      await trigger({
        body: {
          dailyMilkIdsToAdd: tempSelectedMilks.map((milk) => milk.dailyMilkId),
          dailyMilkIdsToRemove: selectedRowKeys,
        },
      });

      message.success(`Updated Daily Milk Batch!`);

      // Reset các danh sách đã chọn
      setSelectedMilkIds([]);
      setTempSelectedMilks([]);
      setSelectedRowKeys([]);

      // Cập nhật lại dữ liệu
      await refreshData();
    } catch {
      message.error('Error updating Daily Milk Batch.');
    }
  };
  useEffect(() => {
    if (!modal.open) {
      setTempSelectedMilks([]);
      setSelectedMilkIds([]);
    }
  }, [modal.open]);
  /** Cấu hình chọn hàng trong bảng */
  const rowSelection: any = useMemo(
    () => ({
      selectedRowKeys,
      onChange: (keys: Key[]) => {
        // Lọc các dòng chỉ thuộc danh sách API (không phải tạm thời)
        const validKeys = keys.filter((key) =>
          data?.dailyMilks?.some((milk: Milk) => milk.dailyMilkId === key)
        );
        setSelectedRowKeys(validKeys);
      },
      getCheckboxProps: (record: Milk) => ({
        disabled: !data?.dailyMilks?.some(
          (milk: Milk) => milk.dailyMilkId === record.dailyMilkId
        ),
      }),
    }),
    [selectedRowKeys, data]
  );
  /** Kết hợp dữ liệu từ API và tạm thời */
  const combinedData = useMemo(
    () => [...(data?.dailyMilks || []), ...tempSelectedMilks],
    [data, tempSelectedMilks]
  );

  /** Cấu trúc cột bảng */
  const columns: any = useMemo(
    () => [
      {
        title: 'Daily Milk ID',
        dataIndex: 'dailyMilkId',
        key: 'dailyMilkId',
      },
      {
        title: 'Volume',
        dataIndex: 'volume',
        key: 'volume',
      },
      {
        title: 'Shift',
        dataIndex: 'shift',
        key: 'shift',
        render: formatAreaType,
      },
      {
        title: 'Milk Date',
        dataIndex: 'milkDate',
        key: 'milkDate',
      },
      {
        title: 'Worker Name',
        key: 'workerName',
        dataIndex: 'worker',
        render: (worker: Worker) => (
          <Tooltip title={<>Employee Number: {worker?.employeeNumber}</>}>
            <span className="text-blue-600">{worker?.name || 'N/A'}</span>
          </Tooltip>
        ),
      },
      {
        title: 'Cow Name',
        key: 'cowName',
        dataIndex: 'cow',
        render: (cow: Cow) => (
          <Tooltip title={<>Cow ID: {cow?.cowId}</>}>
            <span className="text-blue-600">{cow?.name || 'N/A'}</span>
          </Tooltip>
        ),
      },
    ],
    []
  );

  return (
    <ModalComponent
      footer={
        <Button onClick={modal.closeModal} type="primary">
          Close
        </Button>
      }
      open={modal.open}
      onCancel={modal.closeModal}
      title="MilkBatch Details"
      width={1500}
    >
      <Row gutter={16} style={{ marginBottom: 10 }}>
        <Col span={16}>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select Daily Milk ID(s)"
            value={selectedMilkIds}
            onChange={handleSelectDailyMilk}
            options={
              Array?.isArray(availableDailyMilk ? availableDailyMilk : [])
                ? availableDailyMilk?.map((milk: Milk) => ({
                  value: milk.dailyMilkId,
                  label: `ID: ${milk.dailyMilkId} - Volume: ${milk.volume
                    } - Milk Date: ${milk.milkDate} (${formatAreaType(
                      milk.shift
                    )})`,
                }))
                : []
            }
            onFocus={fetchAvailableDailyMilk} // Gọi API khi nhấn vào Select
          />
        </Col>

      </Row>

      <AnimationAppear duration={0.5}>

        <TableComponent
          rowSelection={rowSelection}
          columns={columns}
          dataSource={combinedData}
          rowKey="dailyMilkId"
          loading={isLoading}
        />
        <Row style={{ margin: 20, textAlign: 'right' }}>
          <Col span={24}>
            <Popconfirm
              title="Are you sure you want to update Daily Milk Batch?"
              onConfirm={handleBatchUpdate}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                disabled={
                  !tempSelectedMilks.length && !selectedRowKeys.length
                }
              >
                Update Daily Milk
              </Button>
            </Popconfirm>
          </Col>
        </Row>

      </AnimationAppear>
    </ModalComponent>
  );
};

export default ModalMilkBatchDetail;
