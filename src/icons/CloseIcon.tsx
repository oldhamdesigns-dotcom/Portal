import { memo } from 'react';

const CloseIcon = ({ height = 16, width = 16 }: IconProps) => (
  <svg
    xmlns={'http://www.w3.org/2000/svg'}
    viewBox={'-0.5 0 25 25'}
    width={width}
    height={height}
    fill={'gray'}
  >
    <g
      id={'SVGRepo_bgCarrier'}
      strokeWidth={'0'}
    ></g>
    <g
      id={'SVGRepo_tracerCarrier'}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
    ></g>
    <g id={'SVGRepo_iconCarrier'}>
      <path
        d={'M3 21.32L21 3.32001'}
        stroke={'#000000'}
        strokeWidth={'1.5'}
        strokeLinecap={'round'}
        strokeLinejoin={'round'}
      ></path>
      <path
        d={'M3 3.32001L21 21.32'}
        stroke={'#000000'}
        strokeWidth={'1.5'}
        strokeLinecap={'round'}
        strokeLinejoin={'round'}
      ></path>
    </g>
  </svg>
);

export default memo(CloseIcon);
