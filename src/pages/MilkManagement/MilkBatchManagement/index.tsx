import { Collapse, Divider, Popover } from 'antd';

import useFetcher from '../../../hooks/useFetcher';

import TableComponent, {
  Column,
} from '../../../components/Table/TableComponent';

import AnimationAppear from '../../../components/UI/AnimationAppear';
import WhiteBackground from '../../../components/UI/WhiteBackground';

import CardComponent from '@components/Card/CardComponent';
import PopconfirmComponent from '@components/Popconfirm/PopconfirmComponent';
import TagComponents from '@components/UI/TagComponents';
import TextTitle from '@components/UI/TextTitle';
import useToast from '@hooks/useToast';
import { MILK_BATCH_PATH } from '@service/api/DailyMilk/milkBatchApi';
import { FILTER_MILK_BATCH } from '@service/data/milkBatchStatus';
import { getMilkBatchStatusColor } from '@utils/statusRender/milkBatchStatusRender';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonComponent from '../../../components/Button/ButtonComponent';
import useModal from '../../../hooks/useModal';
import { MilkBatch } from '../../../model/DailyMilk/MilkBatch';
import {
  formatDate,
  formatDateHour,
  formatFollowTime,
  formatStatusWithCamel,
} from '../../../utils/format';
import CreateMilkBatchModal from './components/ModalCreateMilkBatch/CreateMilkBatchModal';
import ModalMilkBatchDetail from './components/ModalMilkBatchDetail';
const groupByDate = (data: MilkBatch[]) => {
  const grouped: Record<string, MilkBatch[]> = {};
  data.forEach((item) => {
    const dateKey = dayjs(item.date).format('YYYY-MM-DD');
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(item);
  });
  return grouped;
};
const MilkBatchManagement = () => {
  const modalBatch = useModal();
  const toast = useToast();
  const { data, isLoading, mutate } = useFetcher<MilkBatch[]>(
    MILK_BATCH_PATH.GET_MILK_BATCH,
    'GET'
  );
  const { isLoading: isLoadingDelete, trigger } = useFetcher(
    'delete-milk-batch',
    'DELETE'
  );
  const { trigger: triggerSetOutOfStock, isLoading: isLoadingOutOfStock } =
    useFetcher(
      MILK_BATCH_PATH.MILK_BATCH_SET_OUT_OF_STOCK,
      'PUT',
      'application/json'
    );
  const modalViewDetail = useModal();
  const { t } = useTranslation();
  const [milkBatchId, setMilkBatchId] = React.useState<number>(0);
  const [resetSelectionTrigger, setResetSelectionTrigger] = useState(0);
  const [milkBatchIdsSetOutOfStock, setMilkBatchIdsSetOutOfStock] = useState<
    number[]
  >([]);
  const [milkBatchSetOutOfStock, setMilkBatchSetOutOfStock] = useState<any[]>(
    []
  );
  const handleOpenEdit = (record: any) => {
    setMilkBatchId(record.milkBatchId);
    modalViewDetail.openModal();
  };

  const handleDelete = async (milkBatchId: number) => {
    try {
      const response = await trigger({
        url: MILK_BATCH_PATH.DELETE_MILK_BATCH(milkBatchId),
      });
      toast.showSuccess(response.message);
      mutate(); // Refresh the data
    } catch (error: any) {
      toast.showError(error.message);
    }
  };

  const handleSetOfOutStock = async () => {
    try {
      const response = await triggerSetOutOfStock({
        body: milkBatchIdsSetOutOfStock,
      });
      toast.showSuccess(response?.message || t('Success'));
      setMilkBatchIdsSetOutOfStock([]);
      setMilkBatchSetOutOfStock([]);
      setResetSelectionTrigger((prev) => prev + 1); // 👈 Trigger reset selection
      mutate();
    } catch (error: any) {
      toast.showError(error?.message);
    }
  };

  const columns: Column[] = [
    {
      dataIndex: 'totalVolume',
      key: 'totalVolume',
      title: t('Total Volume'),
      render: (data) => `${data} (l)`,
      sorter: (a, b) => a?.totalVolume - b?.totalVolume,
    },
    {
      dataIndex: 'date',
      key: 'date',
      title: t('Date'),
      render: (data) => formatDateHour(data),
      sorter: (a, b) => a?.date - b?.date,
      filteredDate: true,
    },
    {
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      title: t('Expiry Date'),
      render: (data) => formatDateHour(data),
      sorter: (a, b) => a?.expiryDate - b?.expiryDate,
      filteredDate: true,
    },
    {
      dataIndex: 'status',
      key: 'status',
      title: t('Status'),
      render: (data) => (
        <TagComponents color={getMilkBatchStatusColor(data)}>
          {t(formatStatusWithCamel(data))}
        </TagComponents>
      ),
      filterable: true,
      filterOptions: FILTER_MILK_BATCH(),
    },
    {
      dataIndex: 'action',
      key: 'action',
      title: t('Action'),
      render: (_, record) => (
        <div>
          <ButtonComponent
            type="primary"
            onClick={() => handleOpenEdit(record)}
          >
            {t('View Detail')}
          </ButtonComponent>
          <PopconfirmComponent
            title={undefined}
            onConfirm={() => handleDelete(record.milkBatchId)}
          >
            <ButtonComponent
              danger
              type="primary"
              style={{ marginLeft: 8 }}
              loading={isLoadingDelete}
            >
              {t('Delete')}
            </ButtonComponent>
          </PopconfirmComponent>
        </div>
      ),
    },
  ];

  const openModalBatch = () => {
    modalBatch.openModal();
  };

  return (
    <AnimationAppear duration={0.5}>
      <WhiteBackground>
        <ModalMilkBatchDetail
          modal={modalViewDetail}
          milkBatchId={milkBatchId}
          mutate={mutate}
        />
        <CreateMilkBatchModal modal={modalBatch} mutate={mutate} />
        <ButtonComponent onClick={openModalBatch} type="primary">
          {t('Create Milk Batch')}
        </ButtonComponent>
        <Divider className="my-4" />
        {milkBatchIdsSetOutOfStock.length > 0 && (
          <CardComponent className="my-4 ">
            <div className="flex gap-2 items-center">
              <PopconfirmComponent
                title={t(
                  'Are you sure to set out of stock for selected milk batches?'
                )}
                onConfirm={() => handleSetOfOutStock()}
              >
                <ButtonComponent type="primary" buttonType="secondary">
                  {t('Set out of stock')}
                </ButtonComponent>
              </PopconfirmComponent>
              <Popover
                placement="rightBottom"
                trigger={['click']}
                content={
                  <div className="md:w-[300px] lg:w-[400px] xl:w-[500px] 2xl:w-[690px] min-h-[300px] max-h-[650px] overflow-auto">
                    {Object.entries(milkBatchSetOutOfStock).map(
                      ([date, batches]) => (
                        <div key={date}>
                          <Divider
                            className="!border-gray-600"
                            variant="dotted"
                          >
                            <TagComponents
                              className="!w-fit !text-base"
                              color="green-inverse"
                            >
                              {t('Milk batches day {{date}}', {
                                date: formatDate({
                                  data: date,
                                  type: 'render',
                                }),
                              })}
                            </TagComponents>
                          </Divider>
                          {batches?.map((element: MilkBatch, index: number) => (
                            <CardComponent
                              key={element.milkBatchId}
                              className="!p-0 !mb-5"
                              styles={{ body: { padding: '5px 10px' } }}
                            >
                              <div className="flex flex-col gap-2">
                                <TextTitle
                                  title={`🐮 ${t('Total volume')}`}
                                  description={`${element.totalVolume} (lit)`}
                                  layout="horizontal"
                                />
                                <Collapse
                                  items={[
                                    {
                                      label: t('Daily milk of milk batch'),
                                      children: (
                                        <div className="flex items-center gap-3 flex-wrap">
                                          {element.dailyMilks.map((dm) => (
                                            <div key={dm?.dailyMilkId}>
                                              <TagComponents color="green">
                                                {t('Milking day {{date}}', {
                                                  date: formatDate({
                                                    data: dm?.milkDate,
                                                    type: 'render',
                                                  }),
                                                })}
                                              </TagComponents>
                                            </div>
                                          ))}
                                        </div>
                                      ),
                                      key: `${date}-${index}`,
                                    },
                                  ]}
                                  accordion
                                />
                              </div>
                            </CardComponent>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                }
              >
                <p className="!text-blue-600 !text-base hover:opacity-70 duration-150 font-semibold cursor-pointer">
                  {t('for {{milkBatch}} selected milk batches', {
                    milkBatch: milkBatchIdsSetOutOfStock.length,
                  })}
                </p>
              </Popover>
            </div>
            <div className="mt-5">
              <p className="text-base text-red-600 font-medium">
                {t('Just "Inventory" milk batches can be set out of stock')}
              </p>
            </div>
          </CardComponent>
        )}
        <TableComponent
          key={resetSelectionTrigger} // 👈 Trigger re-render
          columns={columns}
          dataSource={data ? formatFollowTime(data, 'date') : []}
          loading={isLoading || isLoadingOutOfStock}
          className="table-milk-batch"
          rowSelection={{
            onChange: (_, selectedRows) => {
              const selectedIds = selectedRows.map((item) => item.milkBatchId);
              setMilkBatchIdsSetOutOfStock(selectedIds);
              const grouped = groupByDate(selectedRows);
              setMilkBatchSetOutOfStock(grouped as any);
            },
            getCheckboxProps: (record) => ({
              disabled: record.status !== 'inventory', // 👈 Disable nếu status khác 'inventory'
              title:
                record.status !== 'inventory'
                  ? t('Only inventory items can be selected')
                  : '',
            }),
          }}
          rowClassName={(record) =>
            record.status !== 'inventory' ? 'row-disabled' : ''
          }
        />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default MilkBatchManagement;
