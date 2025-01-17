// slice/avatarSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MutateState {
  mutateFunction: (() => void) | null; // Store the function
}

const initialState: MutateState = {
  mutateFunction: null, // Default value
};

const mutateSlice = createSlice({
  name: 'mutate',
  initialState,
  reducers: {
    setMutateFunction: (state, action: PayloadAction<() => void>) => {
      state.mutateFunction = action.payload; // Store the function in state
    },
    clearMutateFunction: (state) => {
      state.mutateFunction = null; // Clear the function
    },
  },
});

export const { setMutateFunction, clearMutateFunction } = mutateSlice.actions;
export default mutateSlice.reducer;
