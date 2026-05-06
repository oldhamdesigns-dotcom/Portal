import { memo } from 'react';

export type NavIconType = 'Dashboard' | 'MobileUser' | 'Orders' | 'Refund' | 'Reports' | 'Tags' | 'Admin';

type Props = {
  icon: NavIconType;
  state?: 'Default' | 'Hover' | 'Selected';
};

function DashboardIcon({ state }: { state: Props['state'] }) {
  const isSelected = state === 'Selected';
  const isHover = state === 'Hover';
  const stroke = isSelected ? '#005ba5' : isHover ? '#0072ce' : '#555';
  const fillLarge = isSelected ? '#c2ecff' : isHover ? '#c2ecff' : '#d9d9d9';
  const fillSmall = 'none';
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="11" height="7" rx="2" fill={fillSmall} stroke={stroke} strokeWidth="2" />
      <rect x="4" y="14" width="11" height="14" rx="2" fill={fillLarge} stroke={stroke} strokeWidth="2" />
      <rect x="18" y="4" width="11" height="14" rx="2" fill={fillLarge} stroke={stroke} strokeWidth="2" />
      <rect x="18" y="21" width="11" height="7" rx="2" fill={fillSmall} stroke={stroke} strokeWidth="2" />
    </svg>
  );
}

function MobileUserIcon({ state }: { state: Props['state'] }) {
  const isSelected = state === 'Selected';
  const isHover = state === 'Hover';
  const stroke = isSelected ? '#005ba5' : isHover ? '#0072ce' : '#666';
  const fill = isSelected ? '#c2ecff' : isHover ? '#c2ecff' : '#ddd';
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="11" r="5" fill={fill} stroke={stroke} strokeWidth="2" />
      <path d="M7 27c0-4.971 4.029-9 9-9s9 4.029 9 9" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function OrdersIcon({ state }: { state: Props['state'] }) {
  const isSelected = state === 'Selected';
  const isHover = state === 'Hover';
  const stroke = isSelected ? '#005ba5' : isHover ? '#0072ce' : '#666';
  const fill = isSelected ? '#c2ecff' : isHover ? '#c2ecff' : '#ddd';
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="4" width="18" height="24" rx="2" fill={fill} stroke={stroke} strokeWidth="2" />
      <line x1="10" y1="11" x2="22" y2="11" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="16" x2="22" y2="16" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="21" x2="22" y2="21" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function RefundIcon({ state }: { state: Props['state'] }) {
  const isSelected = state === 'Selected';
  const isHover = state === 'Hover';
  const stroke = isSelected ? '#005ba5' : isHover ? '#0072ce' : '#666';
  const fill = isSelected ? '#c2ecff' : isHover ? '#c2ecff' : '#ddd';
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="10" fill={fill} stroke={stroke} strokeWidth="2" />
      <path d="M11 13h6a3 3 0 0 1 0 6h-6" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 11l-2 2 2 2" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16" y1="10" x2="16" y2="12" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="20" x2="16" y2="22" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ReportsIcon({ state }: { state: Props['state'] }) {
  const isSelected = state === 'Selected';
  const isHover = state === 'Hover';
  const border = isSelected ? 'border-[#005ba5]' : isHover ? 'border-[#0072ce]' : 'border-[#666]';
  const bg = isSelected ? 'bg-[#c2ecff]' : isHover ? 'bg-[#c2ecff]' : 'bg-[#ddd]';
  const bar = isSelected ? 'bg-[#005ba5]' : isHover ? 'bg-[#0072ce]' : 'bg-[#666]';
  return (
    <>
      <div className={`absolute ${bg} border-2 ${border} border-solid h-[22.75px] left-[3.5px] rounded-[2px] top-[2.63px] w-[21px]`} />
      <div className={`absolute ${bar} h-[6.07px] left-[7.55px] rounded-[2px] top-[15.52px] w-[3.23px]`} />
      <div className={`absolute ${bar} h-[10.62px] left-[12.38px] rounded-[2px] top-[10.97px] w-[3.23px]`} />
      <div className={`absolute ${bar} h-[13.65px] left-[17.23px] rounded-[2px] top-[7.93px] w-[3.23px]`} />
    </>
  );
}

function TagsIcon({ state }: { state: Props['state'] }) {
  const isSelected = state === 'Selected';
  const isHover = state === 'Hover';
  const stroke = isSelected ? '#005ba5' : isHover ? '#0072ce' : '#666';
  const fill = isSelected ? '#c2ecff' : isHover ? '#c2ecff' : '#ddd';
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4h11l13 13-11 11L4 15V4z" fill={fill} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="11" cy="11" r="2.5" fill={stroke} />
    </svg>
  );
}

function AdminIcon({ state }: { state: Props['state'] }) {
  const isSelected = state === 'Selected';
  const isHover = state === 'Hover';
  const stroke = isSelected ? '#005ba5' : isHover ? '#0072ce' : '#666';
  const fill = isSelected ? '#c2ecff' : isHover ? '#c2ecff' : '#ddd';
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3L5 7.5v8C5 21.75 9.8 27.45 16 29c6.2-1.55 11-7.25 11-13.5v-8L16 3z" fill={fill} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="16" cy="13" r="3" fill={stroke} />
      <path d="M10.5 23c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const NavIcon = ({ icon, state = 'Default' }: Props) => {
  const isActive = state === 'Selected' || state === 'Hover';

  return (
    <div className={`overflow-clip relative size-[28px] ${isActive ? 'bg-[#e6f4fd] rounded-[4px]' : ''}`}>
      {icon === 'Dashboard' && <DashboardIcon state={state} />}
      {icon === 'MobileUser' && <MobileUserIcon state={state} />}
      {icon === 'Orders' && <OrdersIcon state={state} />}
      {icon === 'Refund' && <RefundIcon state={state} />}
      {icon === 'Reports' && (
        <div className="absolute contents left-[4px] top-[3px]">
          <ReportsIcon state={state} />
        </div>
      )}
      {icon === 'Tags' && <TagsIcon state={state} />}
      {icon === 'Admin' && <AdminIcon state={state} />}
    </div>
  );
};

export default memo(NavIcon);
