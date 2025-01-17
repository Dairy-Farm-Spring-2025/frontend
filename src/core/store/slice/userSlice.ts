import { createSlice } from '@reduxjs/toolkit';
import { UserResponseData } from '../../../model/Authentication/UserResponse';

const initialState: UserResponseData | null = {
  accessToken: '',
  fullName: '',
  refreshToken: '',
  roleName: '',
  userId: 0,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (_, action) => action.payload,
    logout: () => initialState,
    updateNewAccessToken: (state, action) => {
      if (state) {
        state.accessToken = action.payload;
      } else {
        return {
          ...initialState,
          accessToken: action.payload,
        };
      }
    },
  },
});

export const { login, logout, updateNewAccessToken } = userSlice.actions;
export default userSlice.reducer;
