// slice/avatarSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface AvatarState {
  shouldRefreshAvatar: any; // Store the function
}

const initialState: AvatarState = {
  shouldRefreshAvatar: false, // Default value
};

const avatarSlice = createSlice({
  name: 'avatar',
  initialState,
  reducers: {
    triggerAvatarRefresh: (state, action) => {
      state.shouldRefreshAvatar = action.payload; // Store the function in state
    },
    clearAvatarFunction: (state) => {
      state.shouldRefreshAvatar = null; // Clear the function
    },
  },
});

export const { triggerAvatarRefresh, clearAvatarFunction } =
  avatarSlice.actions;
export default avatarSlice.reducer;
