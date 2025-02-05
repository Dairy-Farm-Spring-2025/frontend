import { Outlet } from 'react-router-dom';
import useFetcher from '../../../../hooks/useFetcher';
import { useDispatch } from 'react-redux';
import {
  resetItemManagement,
  setCategories,
  setWarehouses,
} from '../../../../core/store/slice/itemManagementSlice';
import { useEffect } from 'react';
import { Warehouse } from '../../../../model/Warehouse/warehouse';

const ItemManagement = () => {
  const dispatch = useDispatch();
  const { data: warehousesData } = useFetcher<Warehouse[]>('warehouses', 'GET');
  const { data: categoryData } = useFetcher<any[]>('categories', 'GET');
  useEffect(() => {
    if (warehousesData) {
      const filteredData = warehousesData.map((element) => ({
        value: element.warehouseLocationId,
        label: element.name,
      }));
      dispatch(setWarehouses(filteredData));
    }
    if (categoryData) {
      const filteredData = categoryData.map((element) => ({
        value: element.categoryId,
        label: element.name,
      }));
      dispatch(setCategories(filteredData));
    }
    return () => {
      dispatch(resetItemManagement());
    };
  }, [warehousesData, categoryData, dispatch]);
  return <Outlet />;
};

export default ItemManagement;
