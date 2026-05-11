import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './slices/taskSlice';
import filtersReducer from './slices/filterSlice';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    filters: filtersReducer,
  },
});
