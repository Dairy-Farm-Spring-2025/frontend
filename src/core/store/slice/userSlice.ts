import { createSlice } from "@reduxjs/toolkit";

const initialState: any = null;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    testAction: (_, action) => action.payload,
  },
});

export const { testAction } = userSlice.actions;
export default userSlice.reducer;
