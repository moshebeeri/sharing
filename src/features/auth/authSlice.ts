
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: true,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoading: (state) => {
      state.isLoading = true;
    },
    userLoaded: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    },
  },
});

export const { userLoading, userLoaded } = authSlice.actions;

export default authSlice.reducer;
