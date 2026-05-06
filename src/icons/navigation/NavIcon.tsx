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
  const accent = isSelected ? '#005ba5' : isHover ? '#0072ce' : '#666666';
  const fill = isSelected ? '#c2ecff' : isHover ? '#c2ecff' : '#DDDDDD';
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M26.1419 8.84375H14.0108C13.0577 8.84375 12.2778 9.6236 12.2778 10.5768L12.2778 29.4232C12.2778 30.3764 13.0577 31.1562 14.0108 31.1562H26.1419C27.0951 31.1562 27.8749 30.3764 27.8749 29.4232V10.5768C27.8749 9.6236 27.0951 8.84375 26.1419 8.84375ZM20.0764 18.1587C21.7487 18.1587 23.1091 19.5191 23.1091 21.1914C23.1091 22.8638 21.7487 24.2242 20.0764 24.2242C18.404 24.2242 17.0436 22.8638 17.0436 21.1914C17.0436 19.5191 18.404 18.1587 20.0764 18.1587ZM26.1419 29.4232H14.0108V29.2239C14.0108 28.6867 14.2535 28.1841 14.6694 27.8549C16.1511 26.6678 18.0314 25.9572 20.0764 25.9572C22.1213 25.9572 24.0016 26.6678 25.4834 27.8549C25.8993 28.1841 26.1419 28.6954 26.1419 29.2239V29.4232Z" fill={fill} />
      <path d="M23.1091 21.1914C23.1091 19.5191 21.7487 18.1587 20.0764 18.1587C18.404 18.1587 17.0436 19.5191 17.0436 21.1914C17.0436 22.8638 18.404 24.2242 20.0764 24.2242C21.7487 24.2242 23.1091 22.8638 23.1091 21.1914ZM26.1419 29.4232V29.224C26.1419 28.6954 25.8993 28.1841 25.4834 27.8548C24.0016 26.6677 22.1213 25.9572 20.0764 25.9572C18.0314 25.9572 16.1511 26.6677 14.6694 27.8548L14.5934 27.9187C14.2241 28.2472 14.0108 28.7203 14.0108 29.224V29.4232H26.1419ZM24.6255 21.1914C24.6255 22.6704 23.9172 23.9858 22.8219 24.817C24.1252 25.182 25.3233 25.8 26.3585 26.6141V10.5768C26.3585 10.4611 26.2576 10.3601 26.1419 10.3601H14.0108C13.8952 10.3601 13.7942 10.4611 13.7942 10.5768V26.6141C14.8294 25.8 16.0274 25.182 17.3307 24.817C16.2355 23.9858 15.5272 22.6704 15.5272 21.1914C15.5272 18.6816 17.5665 16.6423 20.0764 16.6423C22.5862 16.6423 24.6255 18.6816 24.6255 21.1914ZM27.8749 29.4232C27.8749 30.3764 27.0951 31.1562 26.1419 31.1562H14.0108C13.0577 31.1562 12.2778 30.3764 12.2778 29.4232V10.5768C12.2778 9.6236 13.0577 8.84375 14.0108 8.84375H26.1419C27.0951 8.84375 27.8749 9.6236 27.8749 10.5768V29.4232Z" fill={accent} />
      <path d="M23.3258 11.4433C23.6847 11.4433 23.9757 11.7342 23.9757 12.0931C23.9757 12.4521 23.6847 12.743 23.3258 12.743H16.6104C16.2515 12.743 15.9605 12.4521 15.9605 12.0931C15.9605 11.7342 16.2515 11.4433 16.6104 11.4433H23.3258Z" fill={accent} />
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
  const stroke = isSelected ? '#005ba5' : isHover ? '#0072ce' : '#666666';
  const fill = isSelected ? '#c2ecff' : isHover ? '#c2ecff' : '#D9D9D9';
  return (
    <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M29.1577 18.9655L17.331 12.1374C17.0696 11.9864 16.754 11.9618 16.4723 12.0701L12.0107 13.786C11.5705 13.9553 11.3083 14.4094 11.3818 14.8753L12.1266 19.597C12.1736 19.8953 12.3527 20.1561 12.6142 20.3071L24.4409 27.1352C24.9192 27.4114 25.5307 27.2475 25.8069 26.7692L29.5237 20.3315C29.7998 19.8532 29.636 19.2416 29.1577 18.9655Z" fill={fill} stroke={stroke} strokeWidth="2" />
      <circle cx="0.81671" cy="0.81671" r="0.81671" transform="matrix(-0.866025 -0.5 -0.5 0.866025 16.2084 15.9929)" fill={stroke} />
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
