import { memo } from 'react';
import { cn } from '@utils/CN';

const OrdersIcon = ({ height = 24, width = 24, className }: IconProps) => (
  <svg
    xmlns={'http://www.w3.org/2000/svg'}
    viewBox={'0 0 16 16'}
    width={width}
    height={height}
    className={cn('fill-inactive', className)}
  >
    <path
      fillRule={'evenodd'}
      d={
        'M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2'
      }
    ></path>
  </svg>
);

export default memo(OrdersIcon);
