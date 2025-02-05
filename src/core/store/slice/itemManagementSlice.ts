import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  warehouses: [],
  categories: [],
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
    resetItemManagement: () => initialState,
  },
});

export const { setWarehouses, setCategories, resetItemManagement } =
  itemManagementSlice.actions;
export default itemManagementSlice.reducer;
