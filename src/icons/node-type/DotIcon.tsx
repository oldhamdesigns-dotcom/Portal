import { memo } from 'react';

const DotIcon = ({ height = 16, width = 16, fill = 'gray' }: IconProps) => (
  <svg
    xmlns={'http://www.w3.org/2000/svg'}
    viewBox={'0 0 16 16'}
    width={width}
    height={height}
    fill={fill}
  >
    <path d={'M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3'}></path>
  </svg>
);

export default memo(DotIcon);
