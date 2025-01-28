import { memo } from 'react';

const MobileIcon = ({ height = 16, width = 16, fill = 'gray' }: IconProps) => (
  <svg
    xmlns={'http://www.w3.org/2000/svg'}
    viewBox={'0 0 16 16'}
    width={width}
    height={height}
    fill={fill}
  >
    <path
      d={
        'M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z'
      }
    ></path>
    <path d={'M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2'}></path>
  </svg>
);

export default memo(MobileIcon);
