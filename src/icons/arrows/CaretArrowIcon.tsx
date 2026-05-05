import { memo } from 'react';

const CaretArrowIcon = ({ height = 24, width = 24, rotate = 0 }: IconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: `rotate(${rotate}deg)`, transition: 'transform 0.2s ease' }}
  >
    <path
      d="M5 9l7 7 7-7"
      stroke="#5F5F5F"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default memo(CaretArrowIcon);
