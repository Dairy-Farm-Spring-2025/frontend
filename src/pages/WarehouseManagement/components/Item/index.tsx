import { Outlet } from 'react-router-dom';
import useFetcher from '../../../../hooks/useFetcher';
import { useDispatch } from 'react-redux';
import {
  resetItemManagement,
  setCategories,
  setExportItems,
  setWarehouses,
} from '../../../../core/store/slice/itemManagementSlice';
import { useEffect } from 'react';
import { WarehouseType } from '../../../../model/Warehouse/warehouse';

const ItemManagement = () => {
  const dispatch = useDispatch();
  const { data: warehousesData } = useFetcher<WarehouseType[]>('warehouses', 'GET');
  const { data: categoryData } = useFetcher<any[]>('categories', 'GET');
  const { data: exportItemsData } = useFetcher<any[]>('export_items', 'GET');
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
    if (exportItemsData) {
      const filteredData = exportItemsData.map((element) => ({
        value: element.exportItemId,
        label: element.name,
      }));
      dispatch(setExportItems(filteredData));
    }
    return () => {
      dispatch(resetItemManagement());
    };
  }, [warehousesData, categoryData, exportItemsData, dispatch]);
  return <Outlet />;
};

export default ItemManagement;
