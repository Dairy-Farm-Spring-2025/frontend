import ButtonComponent from '@components/Button/ButtonComponent';
import PopconfirmComponent from '@components/Popconfirm/PopconfirmComponent';
import SelectComponent from '@components/Select/SelectComponent';
import TextTitle from '@components/UI/TextTitle';
import useToast from '@hooks/useToast';
import { Col, Row, Tooltip } from 'antd';
import { t } from 'i18next';
import type { Key } from 'react';
import React, { useEffect, useMemo, useState } from 'react';
import ModalComponent from '../../../../../components/Modal/ModalComponent';
import TableComponent from '../../../../../components/Table/TableComponent';
import AnimationAppear from '../../../../../components/UI/AnimationAppear';
import useFetcher from '../../../../../hooks/useFetcher';
import { MilkBatch } from '@model/DailyMilk/MilkBatch';

interface ModalMilkBatchDetailProps {
  milkBatchId: number;
  modal: any;
  mutate: any;
}

interface Worker {
  name: string;
  phoneNumber: number; // Adjusted to match DailyMilkModel
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
  } = useFetcher<MilkBatch>(`MilkBatch/${milkBatchId}`, 'GET');
  const { trigger } = useFetcher<any>(`MilkBatch/${milkBatchId}`, 'PUT');
  const { data: availableDailyMilk, mutate: fetchAvailableDailyMilk } =
    useFetcher<any>(`dailymilks/search_available`, 'GET');
  const toast = useToast();
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
      toast.showWarning(
        t('Please select at least one Daily Milk ID to add or remove.')
      );
      return;
    }

    try {
      const response = await trigger({
        body: {
          dailyMilkIdsToAdd: tempSelectedMilks.map((milk) => milk.dailyMilkId),
          dailyMilkIdsToRemove: selectedRowKeys,
        },
      });

      toast.showSuccess(response.message);

      // Reset các danh sách đã chọn
      setSelectedMilkIds([]);
      setTempSelectedMilks([]);
      setSelectedRowKeys([]);

      // Cập nhật lại dữ liệu
      await refreshData();
      mutate();
    } catch (error: any) {
      toast.showError(error.message);
    }
  };
  useEffect(() => {
    if (!modal.open) {
      setTempSelectedMilks([]);
      setSelectedMilkIds([]);
      setSelectedRowKeys([]);
    }
  }, [modal.open]);
  /** Cấu hình chọn hàng trong bảng */
  const rowSelection: any = useMemo(
    () => ({
      selectedRowKeys,
      onChange: (keys: Key[]) => {
        // Lọc các dòng chỉ thuộc danh sách API (không phải tạm thời)
        const validKeys = keys.filter((key) =>
          data?.dailyMilks?.some((milk: any) => milk.dailyMilkId === key)
        );
        setSelectedRowKeys(validKeys);
      },
      getCheckboxProps: (record: Milk) => ({
        disabled:
          !data?.dailyMilks?.some(
            (milk: any) => milk.dailyMilkId === record.dailyMilkId
          ) || data?.status === 'out_of_stock',
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
        title: t('Volume'),
        dataIndex: 'volume',
        key: 'volume',
      },
      {
        title: t('Milk Date'),
        dataIndex: 'milkDate',
        key: 'milkDate',
      },
      {
        title: t('Worker'),
        key: 'workerName',
        dataIndex: 'worker',
        render: (worker: Worker) => (
          <Tooltip
            title={
              <>
                {t('Employee Number')}: {worker?.employeeNumber}
              </>
            }
          >
            <span className="text-blue-600">{worker?.name || 'N/A'}</span>
          </Tooltip>
        ),
      },
      {
        title: t('Cow Name'),
        key: 'cowName',
        dataIndex: 'cow',
        render: (cow: Cow) => (
          <span className="text-blue-600">{cow?.name || 'N/A'}</span>
        ),
      },
    ],
    []
  );

  return (
    <ModalComponent
      footer={
        <ButtonComponent onClick={modal.closeModal} type="primary">
          {t('Close')}
        </ButtonComponent>
      }
      open={modal.open}
      onCancel={modal.closeModal}
      title={t('Milk Batch Details')}
      width={1000}
    >
      {data?.status !== 'out_of_stock' && (
        <Row gutter={16} style={{ marginBottom: 10 }}>
          <Col span={16}>
            <TextTitle
              title={t('Select milk to add to milk batch')}
              description={
                <SelectComponent
                  mode="multiple"
                  style={{ width: '100%' }}
                  value={selectedMilkIds}
                  onChange={handleSelectDailyMilk}
                  options={
                    Array?.isArray(availableDailyMilk ? availableDailyMilk : [])
                      ? availableDailyMilk?.map((milk: Milk) => ({
                          value: milk.dailyMilkId,
                          label: `${t('Volume')}: ${milk.volume} (l) - ${t(
                            'Milk Date'
                          )}: ${milk.milkDate}`,
                        }))
                      : []
                  }
                  onFocus={fetchAvailableDailyMilk} // Gọi API khi nhấn vào Select
                />
              }
            />
          </Col>
        </Row>
      )}

      <AnimationAppear duration={0.5}>
        <TableComponent
          rowSelection={rowSelection}
          columns={columns}
          dataSource={combinedData}
          rowKey="dailyMilkId"
          loading={isLoading}
        />
        {data?.status !== 'out_of_stock' && (
          <Row style={{ margin: 20, textAlign: 'right' }}>
            <Col span={24}>
              <PopconfirmComponent
                title={undefined}
                description={
                  <div className="flex flex-col gap-2">
                    <p className="!text-red-600 font-semibold">
                      {t(
                        'With daily milk that is selected in the table, they will be deleted'
                      )}
                    </p>
                    <p className="!text-green-600 font-semibold">
                      {t(
                        'With daily milk that is selected in the select, they will be added'
                      )}
                    </p>
                  </div>
                }
                onConfirm={handleBatchUpdate}
              >
                <ButtonComponent
                  buttonType="secondary"
                  type="primary"
                  disabled={
                    !tempSelectedMilks.length && !selectedRowKeys.length
                  }
                >
                  {t('Update milk batch')}
                </ButtonComponent>
              </PopconfirmComponent>
            </Col>
          </Row>
        )}
      </AnimationAppear>
    </ModalComponent>
  );
};

export default ModalMilkBatchDetail;
