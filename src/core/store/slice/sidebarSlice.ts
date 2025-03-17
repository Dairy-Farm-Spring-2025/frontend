import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SideBarSliceProp {
  selectedKey: string;
  openKeys: string[];
}

const initialState: SideBarSliceProp = {
  selectedKey: 'dairy/dashboard',
  openKeys: [],
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setSelectedKey: (state, action: PayloadAction<string>) => {
      state.selectedKey = action.payload;
    },
    setOpenKeys: (state, action: PayloadAction<string[]>) => {
      state.openKeys = action.payload;
    },
    resetSidebar: (state) => {
      state.selectedKey = 'dairy/dashboard';
      state.openKeys = [];
    },
  },
});

export const { setSelectedKey, setOpenKeys, resetSidebar } =
  sidebarSlice.actions;
export default sidebarSlice.reducer;
