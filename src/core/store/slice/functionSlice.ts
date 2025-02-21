// slice/avatarSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FunctionState {
  functions: (() => void) | null; // Store the function
}

const initialState: FunctionState = {
  functions: null, // Default value
};

const functionSlice = createSlice({
  name: 'function',
  initialState,
  reducers: {
    setFunctions: (state, action: PayloadAction<() => void>) => {
      state.functions = action.payload; // Store the function in state
    },
    clearFunctions: (state) => {
      state.functions = null; // Clear the function
    },
  },
});

export const { setFunctions, clearFunctions } = functionSlice.actions;
export default functionSlice.reducer;
