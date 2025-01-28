import { memo, useMemo } from 'react';
import { cn } from '@utils/CN';

const Avatar = ({ size = 36, name = '', className = '' }) => {
  const transformName = useMemo(() => {
    const [first, last = ''] = name.split(' ');
    return `${first}${last}`;
  }, [name]);
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-black p-1 text-white',
        className
      )}
      style={{ width: size, height: size, fontSize: size / 2 }}
    >
      {transformName}
    </div>
  );
};

export default memo(Avatar);
