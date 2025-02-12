import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  warehouses: [],
  categories: [],
  exportItems: [],
};

const itemManagementSlice = createSlice({
  name: 'itemManagement',
  initialState,
  reducers: {
    setWarehouses: (state, action) => {
      state.warehouses = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setExportItems: (state, action) => {
      state.exportItems = action.payload;
    },
    resetItemManagement: () => initialState,
  },
});

export const { setWarehouses, setCategories, resetItemManagement, setExportItems } =
  itemManagementSlice.actions;
export default itemManagementSlice.reducer;
