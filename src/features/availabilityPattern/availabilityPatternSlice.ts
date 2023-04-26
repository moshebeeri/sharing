import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  error: {
    hasError: false,
    message: '',
  },
};

const availabilityPatternSlice = createSlice({
  name: 'availabilityPattern',
  initialState,
  reducers: {
    setAvailabilityPatternError: (state, action) => {
      state.error.hasError = action.payload.hasError;
      state.error.message = action.payload.message;
    },
  },
});

export const { setAvailabilityPatternError } = availabilityPatternSlice.actions;

export default availabilityPatternSlice.reducer;
