import { memo } from 'react';

// Figma asset URLs (valid for 7 days from fetch)
const imgMobileUserDefault = 'https://www.figma.com/api/mcp/asset/9d62b2b4-a9cf-4170-b031-2f2f16ba7625';
const imgMobileUserHover = 'https://www.figma.com/api/mcp/asset/b5392739-101d-4bde-a035-70dc4bab0c93';
const imgMobileUserSelected = 'https://www.figma.com/api/mcp/asset/9184a548-126d-41cb-8a43-9ca4d57397b2';
const imgRefundDefault = 'https://www.figma.com/api/mcp/asset/ffdafd47-17e7-41f0-a398-e3dbaf0569a1';
const imgRefundHover = 'https://www.figma.com/api/mcp/asset/c25751bd-b272-48c1-9d5d-6cc681658b95';
const imgRefundSelected = 'https://www.figma.com/api/mcp/asset/f29925aa-f304-413e-a68d-3f341776707f';
const imgTagsDefault = 'https://www.figma.com/api/mcp/asset/d670e798-affa-4f6c-b188-97d2e8a14c62';
const imgTagsHover = 'https://www.figma.com/api/mcp/asset/71a08fc2-3886-400b-93f2-bf2ede2acf38';
const imgTagsSelected = 'https://www.figma.com/api/mcp/asset/a5615282-056c-487e-b3d4-1c29471bf740';
const imgAdminDefault = 'https://www.figma.com/api/mcp/asset/e36c9600-12e5-45ae-9f32-b968d5fb2381';
const imgAdminHover = 'https://www.figma.com/api/mcp/asset/e36c9600-12e5-45ae-9f32-b968d5fb2381';
const imgAdminSelected = 'https://www.figma.com/api/mcp/asset/e36c9600-12e5-45ae-9f32-b968d5fb2381';

export type NavIconType = 'Dashboard' | 'MobileUser' | 'Orders' | 'Refund' | 'Reports' | 'Tags' | 'Admin';

type Props = {
  icon: NavIconType;
  state?: 'Default' | 'Hover' | 'Selected';
};

// Image-based icons (MobileUser, Refund, Tags, Admin)
function ImageIcon({ src }: { src: string }) {
  return <img alt="" className="absolute block inset-0 max-w-none size-full" src={src} />;
}

// Dashboard icon (SVG-based)
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

// Orders icon (SVG-based)
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

// Reports icon (CSS-based)
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

const NavIcon = ({ icon, state = 'Default' }: Props) => {
  const isActive = state === 'Selected' || state === 'Hover';

  return (
    <div
      className={`overflow-clip relative size-[28px] ${isActive ? 'bg-[#e6f4fd] rounded-[4px]' : ''}`}
    >
      {icon === 'Dashboard' && <DashboardIcon state={state} />}
      {icon === 'Orders' && <OrdersIcon state={state} />}
      {icon === 'Reports' && (
        <div className="absolute contents left-[4px] top-[3px]">
          <ReportsIcon state={state} />
        </div>
      )}
      {icon === 'MobileUser' && (
        <div className="absolute inset-[10.16%_21.88%_10.16%_22.42%]">
          <ImageIcon src={state === 'Selected' ? imgMobileUserSelected : state === 'Hover' ? imgMobileUserHover : imgMobileUserDefault} />
        </div>
      )}
      {icon === 'Refund' && (
        <div className="absolute h-[18.17px] left-[1.87px] top-[5.39px] w-[24.09px]">
          <ImageIcon src={state === 'Selected' ? imgRefundSelected : state === 'Hover' ? imgRefundHover : imgRefundDefault} />
        </div>
      )}
      {icon === 'Tags' && (
        <div className="absolute flex h-[20.52px] items-center justify-center left-[1.28px] top-[2.49px] w-[24.1px]">
          <div className="rotate-45 flex-none">
            <div className="h-[11.43px] relative w-[21.23px]">
              <ImageIcon src={state === 'Selected' ? imgTagsSelected : state === 'Hover' ? imgTagsHover : imgTagsDefault} />
            </div>
          </div>
        </div>
      )}
      {icon === 'Admin' && (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 h-[21px] left-[calc(50%-0.2px)] top-1/2 w-[18.9px]">
          <ImageIcon src={state === 'Selected' ? imgAdminSelected : state === 'Hover' ? imgAdminHover : imgAdminDefault} />
        </div>
      )}
    </div>
  );
};

export default memo(NavIcon);
