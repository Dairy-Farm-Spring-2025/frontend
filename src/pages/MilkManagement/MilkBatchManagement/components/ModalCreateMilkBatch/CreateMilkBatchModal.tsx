import { ConfigProvider, Table } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalComponent from '../../../../../components/Modal/ModalComponent';
import SelectComponent from '../../../../../components/Select/SelectComponent';
import { Column } from '../../../../../components/Table/TableComponent';
import useFetcher from '../../../../../hooks/useFetcher';
import useToast from '../../../../../hooks/useToast';
import { Area } from '../../../../../model/Area';
import { dailyMilkApi } from '../../../../../service/api/DailyMilk/dailyMilkApi';
import { cowStatus } from '../../../../../service/data/cowStatus';
import { getLabelByValue } from '../../../../../utils/getLabel';

interface CreateMilkBatchModalProps {
  modal: any;
  mutate: any;
}

const CreateMilkBatchModal = ({ modal, mutate }: CreateMilkBatchModalProps) => {
  const toast = useToast();
  const [dataDaily, setDataDaily] = useState([]);
  const [selectArea, setSelectArea] = useState([]);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedShift, setSelectedShift] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { data: dataArea, isLoading: isLoadingArea } = useFetcher<any>('areas');
  const { trigger, isLoading: isLoadingCreate } = useFetcher(
    `MilkBatch`,
    'POST'
  );
  const { t } = useTranslation();
  useEffect(() => {
    if (modal.open) {
      const valueSelect = dataArea.map((element: Area) => ({
        value: element.areaId,
        label: element.name,
      }));
      setSelectArea(valueSelect);
    }
  }, [dataArea, modal.open]);

  useEffect(() => {
    const fetchData = async (areaId?: string, shift?: string) => {
      try {
        setLoading(true);
        const response = await dailyMilkApi.searchDailyMilk(
          areaId ? areaId : '',
          shift ? shift : ''
        );
        setDataDaily(response.data);
      } catch (error: any) {
        toast.showError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (modal.open && (selectedArea || selectedShift)) {
      fetchData(selectedArea, selectedShift);
    }
  }, [modal.open, selectedArea, selectedShift]);

  const columns: Column[] = [
    {
      dataIndex: 'volume',
      key: 'volume',
      title: t('Volume'),
    },
    {
      dataIndex: 'milkDate',
      key: 'milkDate',
      title: t('Milk Date'),
    },
    {
      dataIndex: 'cow',
      key: 'cow',
      title: t('Cow Name'),
      render: (data) => data.name,
    },
    {
      dataIndex: 'cow',
      key: 'cow',
      title: t('Cow Status'),
      render: (data) => getLabelByValue(data.cowStatus, cowStatus()),
    },
    {
      dataIndex: 'worker',
      key: 'worker',
      title: t('Worker'),
      render: (data) => (
        <p>
          {data.name} -{' '}
          <span className="text-orange-600">{data.employeeNumber}</span>
        </p>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onChangeArea = (areaId: string) => {
    setSelectedArea(areaId);
  };

  // const onChangeShift = (shiftValue: string) => {
  //   setSelectedShift(shiftValue);
  // };

  const rowSelection: TableRowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleCancel = () => {
    setSelectedRowKeys([]);
    setSelectArea([]);
    setDataDaily([]);
    setSelectedArea('');
    setSelectedShift('');
    modal.closeModal();
  };

  const handleConfirm = async () => {
    if (selectedArea === '') {
      toast.showError(t('Please choose area'));
      return;
    } else if (selectedRowKeys.length === 0) {
      toast.showError(t('Please select at least one daily milk'));
      return;
    } else {
      const queryParams = selectedRowKeys
        .map((key) => `dailyMilkIds=${key}`)
        .join('&');
      try {
        const response = await trigger({ url: `MilkBatch?${queryParams}` });
        mutate();
        toast.showSuccess(response.message);
      } catch (error: any) {
        toast.showError(error.message);
      } finally {
        setSelectedArea('');
        setSelectedShift('');
      }
    }
  };

  return (
    <ModalComponent
      loading={isLoadingCreate}
      width={1000}
      title={t('Create Milk Batch')}
      className=""
      open={modal.open}
      onCancel={handleCancel}
      onOk={handleConfirm}
    >
      <div className="flex justify-evenly items-center gap-5 w-2/5">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-base font-bold">
            {t('Select Area')}
            <sup className="text-red-500">*</sup>:
          </label>
          <SelectComponent
            options={selectArea}
            onChange={onChangeArea}
            loading={isLoadingArea}
            value={selectedArea}
            allowClear
          />
        </div>
        {/* <p className="mt-8">or</p> */}
        {/* <div className="flex flex-col gap-2 w-1/2">
          <label className="text-base font-bold">
            {t('Select Shift')}
            <sup className="text-red-500">*</sup>:
          </label>
          <SelectComponent
            placeholder={selectedArea === '' && 'Select Area...'}
            options={shiftData()}
            onChange={onChangeShift}
            value={selectedShift}
            allowClear
          />
        </div> */}
      </div>
      <ConfigProvider
        table={{
          className: 'shadow-lg !overflow-auto !w-full mt-5',
        }}
      >
        <Table
          bordered
          loading={loading}
          rowKey="dailyMilkId"
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataDaily.filter(
            (element: any) => element?.milkBatch === null
          )}
        />
      </ConfigProvider>
    </ModalComponent>
  );
};

export default CreateMilkBatchModal;
