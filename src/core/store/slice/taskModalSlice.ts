import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  modalCreate: false,
};

export const taskModalSlice = createSlice({
  name: 'taskModal',
  initialState,
  reducers: {
    setModalCreate: (state, action) => {
      state.modalCreate = action.payload;
    },
  },
});

export const { setModalCreate } = taskModalSlice.actions;
export default taskModalSlice.reducer;
