import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

const LoadingSlice = createSlice({
  name: 'loading',
  initialState: { value: false },
  reducers: {
    startLoading: (state) => {
      state.value = true;
    },
    stopLoading: (state) => {
      state.value = false;
    },
  },
});

export const { startLoading, stopLoading } = LoadingSlice.actions;
export default LoadingSlice.reducer;

export const useLoading = () => {
  const loading = useSelector((state: { loading: { value: boolean } }) => state.loading.value);
  const dispatch = useDispatch();

  return {
    loading,
    startLoading: () => dispatch(startLoading()),
    stopLoading: () => dispatch(stopLoading()),
  };
};
