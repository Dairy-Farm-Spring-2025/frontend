import { useEffect, useState } from 'react';
import TableComponent, {
  Column,
} from '../../../../../../../../components/Table/TableComponent';
import { Item } from '../../../../../../../../model/Warehouse/items';
import { useSelector } from 'react-redux';
import useToast from '../../../../../../../../hooks/useToast';
import { RootState } from '../../../../../../../../core/store/store';
import SelectComponent from '../../../../../../../../components/Select/SelectComponent';
import { useTranslation } from 'react-i18next';

interface ListItemCategoryProps {
  isLoading: boolean;
  trigger: any;
  column: Column[];
}

const ListItemCategory = ({
  isLoading,
  trigger,
  column,
}: ListItemCategoryProps) => {
  const toast = useToast();
  const [id, setId] = useState<number>(0);
  const [data, setData] = useState<Item[]>([]);
  const itemManagementWarehouse = useSelector(
    (state: RootState) => state.itemManagement
  );

  useEffect(() => {
    const fetchData = async (id: number) => {
      try {
        const response = await trigger({ url: `items/category/${id}` });
        setData(response);
      } catch (error: any) {
        toast.showError(error.message);
      }
    };
    if (id > 0) {
      fetchData(id);
    }
  }, [id]);
  const { t } = useTranslation();
  const handleChangeId = (id: number) => {
    setId(id);
  };
  return (
    <div className="w-full min-h-[400px] flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <p className="text-base font-bold">{t("Select category")}:</p>
        <SelectComponent
          onChange={handleChangeId}
          options={itemManagementWarehouse.categories}
          className="w-2/5"
        />
      </div>
      <TableComponent loading={isLoading} columns={column} dataSource={data} />
    </div>
  );
};

export default ListItemCategory;
