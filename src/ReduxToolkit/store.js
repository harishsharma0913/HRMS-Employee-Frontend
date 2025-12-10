import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import taskSlice from './taskSlice';
import forgotPasswordSlice from './forgotSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskSlice,
    forgotPassword: forgotPasswordSlice,
  },
});

export default store;
