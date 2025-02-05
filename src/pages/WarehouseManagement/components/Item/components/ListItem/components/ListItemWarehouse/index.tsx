import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SelectComponent from '../../../../../../../../components/Select/SelectComponent';
import TableComponent, {
  Column,
} from '../../../../../../../../components/Table/TableComponent';
import { RootState } from '../../../../../../../../core/store/store';
import useToast from '../../../../../../../../hooks/useToast';
import { Item } from '../../../../../../../../model/Warehouse/items';

interface ListItemWarehouseProps {
  isLoading: boolean;
  trigger: any;
  column: Column[];
}

const ListItemWarehouse = ({
  isLoading,
  trigger,
  column,
}: ListItemWarehouseProps) => {
  const toast = useToast();
  const [id, setId] = useState<number>(0);
  const [data, setData] = useState<Item[]>([]);
  const itemManagementWarehouse = useSelector(
    (state: RootState) => state.itemManagement
  );

  useEffect(() => {
    const fetchData = async (id: number) => {
      try {
        const response = await trigger({ url: `items/location/${id}` });
        setData(response);
      } catch (error: any) {
        toast.showError(error.message);
      }
    };
    if (id > 0) {
      fetchData(id);
    }
  }, [id]);

  const handleChangeId = (id: number) => {
    setId(id);
  };
  return (
    <div className="w-full min-h-[400px] flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <p className="text-base font-bold">Select warehouse:</p>
        <SelectComponent
          onChange={handleChangeId}
          options={itemManagementWarehouse.warehouses}
          className="w-2/5"
        />
      </div>
      <TableComponent loading={isLoading} columns={column} dataSource={data} />
    </div>
  );
};

export default ListItemWarehouse;
