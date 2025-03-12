import {
  resetItemManagement,
  setCategories,
  setExportItems,
  setWarehouses,
} from '@core/store/slice/itemManagementSlice';
import useFetcher from '@hooks/useFetcher';
import { WarehouseType } from '@model/Warehouse/warehouse';
import { CATEGORY_PATH } from '@service/api/Storage/categoryApi';
import { EXPORT_PATH } from '@service/api/Storage/exportApi';
import { STORAGE_PATH } from '@service/api/Storage/storageApi';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

const ItemManagement = () => {
  const dispatch = useDispatch();

  const { data: warehousesData } = useFetcher<WarehouseType[]>(
    STORAGE_PATH.STORAGES,
    'GET'
  );
  const { data: categoryData } = useFetcher<any[]>(
    CATEGORY_PATH.CATEGORIES,
    'GET'
  );
  const { data: exportItemsData } = useFetcher<any[]>(
    EXPORT_PATH.EXPORT_ITEMS,
    'GET'
  );
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
