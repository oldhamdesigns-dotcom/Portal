import { configureStore } from '@reduxjs/toolkit';
import LoadingSlice from '@redux/LoadingSlice';

export default configureStore({
  reducer: {
    loading: LoadingSlice,
  },
});
