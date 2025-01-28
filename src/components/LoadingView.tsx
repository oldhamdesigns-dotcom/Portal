import { memo } from 'react';
import { useLoading } from '@redux/LoadingSlice';

const LoadingView = () => {
  const { loading } = useLoading();

  return loading ? (
    <div id={'loader-wrapper'}>
      <div id={'loader'} />
    </div>
  ) : null;
};

export default memo(LoadingView);
