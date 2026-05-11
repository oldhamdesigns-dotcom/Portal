import { memo, useState } from 'react';
import LogoIcon from '@icons/LogoIcon';
import { Link, useLocation } from 'react-router';
import { cn } from '@utils/CN';
import { useTenant } from '@/context/TenantContext';
import NavIcon, { NavIconType } from '@icons/navigation/NavIcon';
import routes from '@/navigation/routes.json';

const MAIN_NAV: { title: string; path: string; icon: NavIconType }[] = [
  { title: 'Mobile Users', path: routes.MOBILE_USERS, icon: 'MobileUser' },
  { title: 'Orders', path: routes.ORDERS, icon: 'Orders' },
  { title: 'Refunds', path: routes.REFUNDS, icon: 'Refund' },
];

const ADMIN_NAV: { title: string; path: string; icon: NavIconType }[] = [
  { title: 'Dashboard', path: routes.DASHBOARD, icon: 'Dashboard' },
  { title: 'Reports', path: routes.REPORTS, icon: 'Reports' },
  { title: 'Tags', path: routes.NODE_TYPES, icon: 'Tags' },
  { title: 'AS400', path: routes.AS400_LOCATIONS, icon: 'AS400' },
];

type NavItemProps = {
  title: string;
  path: string;
  icon: NavIconType;
  isActive: boolean;
  isWide: boolean;
};

const NavItem = ({ title, path, icon, isActive, isWide }: NavItemProps) => (
  <Link
    to={path}
    title={title}
    className={cn(
      'relative group flex items-center gap-2 pl-1 pr-0 py-1 transition-colors w-full',
      isActive ? 'bg-primary-50' : 'hover:bg-primary-50'
    )}
  >
    <NavIcon icon={icon} state={isActive ? 'Selected' : 'Default'} />
    <p className={cn(
      'text-sm whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden',
      isWide ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0',
      isActive ? 'text-primary-600 font-medium' : 'text-text-subtle',
    )}>
      {title}
    </p>
    {isActive && (
      <span className="absolute right-0 top-0 bottom-0 w-[2px] bg-primary rounded-l-sm" />
    )}
  </Link>
);

const NavigationMenu = () => {
  const { tenantData, setMenu } = useTenant();
  const { pathname } = useLocation();
  const isWide = tenantData?.menu?.wide;
  const [adminOpen, setAdminOpen] = useState(false);
  const role = tenantData?.activeTenantPermission?.role ?? 'Customer Support';
  const isOpsViewer = role === 'Ops Reports Viewer';
  const visibleAdminNav = isOpsViewer
    ? ADMIN_NAV.filter((item) => item.title === 'Dashboard' || item.title === 'Reports')
    : ADMIN_NAV;

  return (
    <div className={cn(
      'flex flex-col h-screen bg-white border-r border-[#e2e8f0] shadow-sm transition-[width] duration-300 ease-in-out shrink-0 will-change-[width]',
      isWide ? 'w-[180px]' : 'w-[64px]'
    )}>
      {/* Logo */}
      <div className="flex flex-col px-3 pt-4 gap-4">
        <Link to={routes.MAIN_DASHBOARD} className="flex items-center justify-center bg-black rounded-lg size-[36px] shrink-0 hover:opacity-80 transition-opacity">
          <LogoIcon width={36} height={36} fill="black" color="white" />
        </Link>
      </div>

      {/* Main nav */}
      <div className="flex flex-col gap-1 pl-3 pr-0 pt-5">
        {isOpsViewer
          ? visibleAdminNav.map(({ title, path, icon }) => (
              <NavItem key={path} title={title} path={path} icon={icon} isActive={pathname === path} isWide={!!isWide} />
            ))
          : MAIN_NAV.map(({ title, path, icon }) => (
              <NavItem key={path} title={title} path={path} icon={icon} isActive={pathname === path} isWide={!!isWide} />
            ))
        }
      </div>

      <div className="flex-1" />

      {/* Admin Tools collapsible — hidden for Ops Reports Viewer */}
      {!isOpsViewer && (
        <div className="flex flex-col pl-3 pr-0 pb-2">
          <button
            onClick={() => setAdminOpen((v) => !v)}
            title="Admin Tools"
            className="relative flex items-center gap-2 pl-1 pr-0 py-1 w-full hover:bg-primary-50 transition-colors"
          >
            <NavIcon icon="Admin" state="Default" />
            <p className={cn(
              'text-sm whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden flex-1 text-left font-medium text-text-subtle',
              isWide ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0',
            )}>
              Admin Tools
            </p>
            <span className={cn(
              'shrink-0 overflow-hidden transition-all duration-300 ease-in-out flex items-center',
              isWide ? 'max-w-[16px] opacity-100 mr-3' : 'max-w-0 opacity-0 mr-0'
            )}>
              <svg
                className={cn('size-3 text-text-muted transition-transform duration-200', adminOpen ? 'rotate-90' : 'rotate-0')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
          {adminOpen && (
            <div className="flex flex-col gap-1 mt-1">
              {ADMIN_NAV.map(({ title, path, icon }) => (
                <NavItem key={path} title={title} path={path} icon={icon} isActive={pathname === path} isWide={!!isWide} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expand / collapse — fixed size, always left-aligned */}
      <div className="px-3 pb-4 pt-2">
        <button
          onClick={() => setMenu({ wide: !isWide })}
          className="flex items-center justify-center border border-border rounded-lg p-2 hover:bg-primary-50 transition-colors size-[36px] shrink-0"
          title={isWide ? 'Collapse menu' : 'Expand menu'}
        >
          <svg
            className={cn('size-4 text-text-subtle transition-transform duration-200', isWide ? 'rotate-180' : 'rotate-0')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default memo(NavigationMenu);
