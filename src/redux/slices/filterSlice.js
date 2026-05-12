import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  sortOrder: '',
  status: '',
  startDate: '',
  endDate: '',
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetFilters: () => initialState,
  },
});

export const { setFilters, resetFilters } = filterSlice.actions;
export default filterSlice.reducer;
