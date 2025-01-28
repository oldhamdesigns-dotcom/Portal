import { memo } from 'react';

const UnitIcon = ({ height = 16, width = 16, fill = 'gray' }: IconProps) => (
  <svg
    xmlns={'http://www.w3.org/2000/svg'}
    viewBox={'0 0 16 16'}
    width={width}
    height={height}
    fill={fill}
  >
    <path
      d={
        'M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6zm1.5.5A.5.5 0 0 1 1 13V6a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5z'
      }
    ></path>
  </svg>
);

export default memo(UnitIcon);
