import { ConfigProvider, Table } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import { useEffect, useState } from 'react';
import ModalComponent from '../../../../../../components/Modal/ModalComponent';
import SelectComponent from '../../../../../../components/Select/SelectComponent';
import { Column } from '../../../../../../components/Table/TableComponent';
import useFetcher from '../../../../../../hooks/useFetcher';
import useToast from '../../../../../../hooks/useToast';
import { Area } from '../../../../../../model/Area';
import { cowStatus } from '../../../../../../service/data/cowStatus';
import { getLabelByValue } from '../../../../../../utils/getLabel';
import { dailyMilkApi } from '../../../../../../service/api/DailyMilk/dailyMilkApi';

interface CreateMilkBatchModalProps {
  modal: any;
  id: string;
}

const CreateMilkBatchModal = ({ modal }: CreateMilkBatchModalProps) => {
  const toast = useToast();
  const [dataDaily, setDataDaily] = useState([]);
  const [selectArea, setSelectArea] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { data: dataArea, isLoading: isLoadingArea } = useFetcher<any>('areas');
  const { trigger, isLoading: isLoadingCreate } = useFetcher(
    `MilkBatch`,
    'POST'
  );

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
    const fetchData = async (areaId: string) => {
      try {
        setLoading(true);
        const response = await dailyMilkApi.searchDailyMilk(areaId);
        setDataDaily(response.data);
      } catch (error: any) {
        toast.showError(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (modal.open && selectedArea) {
      fetchData(selectedArea);
    }
  }, [modal.open, selectedArea]);

  const columns: Column[] = [
    {
      dataIndex: 'dailyMilkId',
      key: 'dailyMilkId',
      title: '#',
    },
    {
      dataIndex: 'volume',
      key: 'volume',
      title: 'Volume',
    },
    {
      dataIndex: 'milkDate',
      key: 'milkDate',
      title: 'Milk Date',
    },
    {
      dataIndex: 'cow',
      key: 'cow',
      title: 'Cow Name',
      render: (data) => data.name,
    },
    {
      dataIndex: 'cow',
      key: 'cow',
      title: 'Cow Status',
      render: (data) => getLabelByValue(data.cowStatus, cowStatus),
    },
    {
      dataIndex: 'worker',
      key: 'worker',
      title: 'Worker',
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

  const rowSelection: TableRowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleCancel = () => {
    setSelectedRowKeys([]);
    setSelectArea([]);
    setDataDaily([]);
    setSelectedArea('');
    modal.closeModal();
  };

  const handleConfirm = async () => {
    if (selectedArea === '') {
      toast.showError('Please choose the area');
      return;
    } else if (selectedRowKeys.length === 0) {
      toast.showError('Please select at least one row');
      return;
    } else {
      const queryParams = selectedRowKeys
        .map((key) => `dailyMilkIds=${key}`)
        .join('&');
      try {
        await trigger({ url: `MilkBatch?${queryParams}` });
        toast.showSuccess('Success');
      } catch (error: any) {
        toast.showError(error.message);
      }
      console.log('haha');
    }
  };

  return (
    <ModalComponent
      loading={isLoadingCreate}
      width={1000}
      title="Create Milk Batch"
      className=""
      open={modal.open}
      onCancel={handleCancel}
      onOk={handleConfirm}
    >
      <div className="flex flex-col gap-2">
        <label className="text-base font-bold">
          Select Area<sup className="text-red-500">*</sup>:
        </label>
        <SelectComponent
          className="!w-1/3"
          placeholder={selectedArea === '' && 'Select Area...'}
          options={selectArea}
          onChange={onChangeArea}
          loading={isLoadingArea}
          value={selectedArea}
        />
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
          dataSource={dataDaily}
        />
      </ConfigProvider>
    </ModalComponent>
  );
};

export default CreateMilkBatchModal;
