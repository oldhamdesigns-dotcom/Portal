import { memo } from 'react';

const PowerOffIcon = ({ height = 16, width = 16 }: IconProps) => (
  <svg
    xmlns={'http://www.w3.org/2000/svg'}
    viewBox={'0 0 16 16'}
    width={width}
    height={height}
  >
    <path d={'M7.5 1v7h1V1z'}></path>
    <path
      d={'M3 8.812a5 5 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812'}
    ></path>
  </svg>
);

export default memo(PowerOffIcon);
