// slice/avatarSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AvatarState {
  avatarFunction: (() => void) | null; // Store the function
}

const initialState: AvatarState = {
  avatarFunction: null, // Default value
};

const avatarSlice = createSlice({
  name: 'avatar',
  initialState,
  reducers: {
    setAvatarFunction: (state, action: PayloadAction<() => void>) => {
      state.avatarFunction = action.payload; // Store the function in state
    },
    clearAvatarFunction: (state) => {
      state.avatarFunction = null; // Clear the function
    },
  },
});

export const { setAvatarFunction, clearAvatarFunction } = avatarSlice.actions;
export default avatarSlice.reducer;
