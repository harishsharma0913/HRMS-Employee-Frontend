import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import taskSlice from './taskSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskSlice,
  },
});

export default store;
