import { memo, useCallback, useState } from 'react';
import { useUserData } from '@/context/UserContext';
import useUserFormat from '@hooks/useUserFormat';
import useMenu from '@hooks/useMenu';
import RolesIcon from '@icons/profile-menu/RolesIcon';
import ViewProfileIcon from '@icons/profile-menu/ViewProfileIcon';
import PowerOffIcon from '@icons/profile-menu/PowerOffIcon';
import ArrowIcon from '@icons/arrows/ArrowIcon';
import CaretArrowIcon from '@icons/arrows/CaretArrowIcon';
import Avatar from '@icons/Avatar';
import { cn } from '@utils/CN';
import { useTenant } from '@/context/TenantContext';

const Header = () => {
  const { userData, logout } = useUserData();
  const { tenantData, setActiveTenantPermission } = useTenant();
  const { name, photo } = useUserFormat(userData?.loggedInUserData);
  const profileMenu = useMenu();
  const [show, setShow] = useState<Record<string, boolean>>({ roles: false });

  const changeRole = useCallback(
    (value: TenantPermission) => {
      setShow((v) => ({ ...v, roles: false }));
      setActiveTenantPermission(value);
      profileMenu.setVisible(false);
    },
    [setActiveTenantPermission, profileMenu]
  );

  return (
    <div className="flex w-full items-center justify-between px-4 h-[67px] bg-white border-b border-[#e2e8f0] shadow-[0px_1px_1px_rgba(0,0,0,0.1)] shrink-0">
      <p className="text-lg font-semibold text-text-body">Support Portal</p>

      <div className="relative">
        <button
          className="flex items-center gap-3 bg-white border border-border rounded-lg px-4 h-[52px] outline-0 hover:shadow-sm transition-shadow"
          ref={profileMenu.ref}
          {...profileMenu.itemProps}
        >
          {photo ? (
            <img
              src={photo}
              className="size-[32px] rounded-full object-cover shrink-0"
              alt="profile"
            />
          ) : (
            <Avatar name={name?.[0] ?? 'U'} />
          )}
          <div className="flex flex-col items-start">
            <p className="text-base leading-[1.6] text-text-body">{name || 'User'}</p>
            <p className="text-xs text-text-subtle">{tenantData?.activeTenantPermission?.role ?? 'Customer Support'}</p>
          </div>
          <CaretArrowIcon rotate={profileMenu.visible ? 180 : 0} />
        </button>

        {profileMenu.visible ? (
          <div
            className="animate__animated animate__faster animate__fadeInDown absolute right-0 top-full mt-2 w-[220px] flex flex-col gap-2 rounded-lg bg-white py-4 shadow-lg border border-[#e2e8f0] z-50"
            ref={profileMenu.menuRef}
            style={profileMenu.styles}
            {...profileMenu.props}
          >
            <button
              className="flex items-center gap-2 px-4 py-1 text-left hover:bg-surface transition-colors"
              onClick={() => setShow((v) => ({ ...v, roles: !v.roles }))}
            >
              <RolesIcon />
              <p>{'Roles'}</p>
              <ArrowIcon rotate={show.roles ? 180 : 0} />
            </button>
            {show.roles && (
              <div className="animate__animated animate__fadeIn flex flex-col gap-1 pl-8">
                {(userData.userInfo.length ? userData.userInfo : [
                  { role: 'Customer Support' },
                  { role: 'Supervisor' },
                  { role: 'Ops Reports Viewer' },
                  { role: 'Refund Analyst' },
                ] as TenantPermission[]).map((info, idx) => (
                  <button
                    key={'info-' + idx}
                    className={cn(
                      'text-left text-sm px-3 py-1.5 w-full transition-colors hover:bg-primary-50 hover:text-primary',
                      info.role === tenantData?.activeTenantPermission?.role
                        ? 'text-blue-500 font-medium bg-primary-50'
                        : 'text-text-subtle'
                    )}
                    onClick={() => changeRole(info)}
                  >
                    {info.role}
                  </button>
                ))}
              </div>
            )}
            <button className="flex items-center gap-2 px-4 py-1 text-left hover:bg-surface transition-colors">
              <ViewProfileIcon />
              <p>{'View profile'}</p>
            </button>
            <button
              className="flex items-center gap-2 border-t border-gray-2 fill-danger px-4 pt-3 pb-1 text-left text-danger hover:bg-surface transition-colors"
              onClick={logout}
            >
              <PowerOffIcon />
              <p>{'Logout'}</p>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default memo(Header);
