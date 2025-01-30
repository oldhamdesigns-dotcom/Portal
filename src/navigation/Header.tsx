import { memo, useCallback, useState } from 'react';
import { useUserData } from '@/context/UserContext';
import useUserFormat from '@hooks/useUserFormat';
import BigMenuIcon from '@icons/BigMenuIcon';
import SmallMenuIcon from '@icons/SmallMenuIcon';
import useMenu from '@hooks/useMenu';
import RolesIcon from '@icons/profile-menu/RolesIcon';
import ViewProfileIcon from '@icons/profile-menu/ViewProfileIcon';
import PowerOffIcon from '@icons/profile-menu/PowerOffIcon';
import ArrowIcon from '@icons/arrows/ArrowIcon';
import { cn } from '@utils/CN';
import Avatar from '@icons/Avatar';
import CaretArrowIcon from '@icons/arrows/CaretArrowIcon';
import Input from '@components/forms/Input';
import { useTenant } from '@/context/TenantContext';

const Header = () => {
  const { userData, logout } = useUserData();
  const { tenantData, setMenu, setActiveTenantPermission, setActiveTenant } = useTenant();
  const { name, photo } = useUserFormat(userData?.loggedInUserData);
  const profileMenu = useMenu();
  const tenantsMenu = useMenu({
    onClose: () => {
      setTenantFilter('');
    },
  });
  const [show, setShow] = useState<Record<string, boolean>>({ roles: false });
  const [tenantFilter, setTenantFilter] = useState<string>('');

  const changeRole = useCallback(
    (value: TenantPermission) => {
      setShow((v) => ({ ...v, roles: false }));
      setActiveTenantPermission(value);
      profileMenu.setVisible(false);
    },
    [setActiveTenantPermission, profileMenu]
  );

  const changeActiveTenant = useCallback(
    (value: Tenant) => {
      tenantsMenu.setVisible(false);
      setActiveTenant(value);
    },
    [setActiveTenant, tenantsMenu]
  );

  return (
    <div className={'flex w-full items-center justify-between px-[20px]'}>
      <div>
        {tenantData?.activeTenantPermission?.isSuperAdmin ? (
          <>
            <button
              className={'flex items-center gap-2 outline-0'}
              ref={tenantsMenu.ref}
              {...tenantsMenu.itemProps}
            >
              <Avatar name={'T'} />
              <span>{tenantData?.activeTenant?.marketingName}</span>
              <CaretArrowIcon rotate={tenantsMenu.visible ? 180 : 0} />
            </button>
            {tenantsMenu.visible ? (
              <div
                className={
                  'animate__animated animate__fadeInDown animate__faster ml-auto mt-[10px] flex w-max flex-col gap-2 rounded bg-white px-2 py-3 shadow-lg'
                }
                ref={tenantsMenu.menuRef}
                style={tenantsMenu.styles}
                {...tenantsMenu.props}
              >
                <Input
                  value={tenantFilter}
                  onChange={(e) => setTenantFilter(e.target.value)}
                  placeholder={'Search tenant...'}
                />
                <div className={'flex max-h-[300px] flex-col gap-2 overflow-y-auto px-2 py-1'}>
                  {tenantData.tenantList
                    .filter((tenant) =>
                      tenant.marketingName.toLowerCase().includes(tenantFilter.toLowerCase())
                    )
                    .map((item, idx) => (
                      <button
                        key={'tenant-' + idx}
                        className={'cursor-pointer text-left text-sm'}
                        onClick={() => changeActiveTenant(item)}
                      >
                        {item.marketingName}
                      </button>
                    ))}
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
      <div className={'flex gap-5'}>
        <button
          className={'flex flex-row gap-2 text-left outline-0'}
          ref={profileMenu.ref}
          {...profileMenu.itemProps}
        >
          {photo ? (
            <img
              src={photo}
              className={'size-[36px] rounded-full'}
              alt={'profile-image'}
            />
          ) : null}
          <div className={'flex flex-col'}>
            <p className={'text-xl font-bold text-black'}>{name}</p>
            <p className={'text-sm italic text-black text-opacity-50'}>
              {tenantData?.activeTenantPermission?.role}
            </p>
          </div>
        </button>
        {profileMenu.visible ? (
          <div
            className={
              'animate__animated animate__faster animate__fadeInDown mt-[10px] flex w-[200px] flex-col gap-2 rounded bg-white py-4 shadow-lg'
            }
            ref={profileMenu.menuRef}
            style={profileMenu.styles}
            {...profileMenu.props}
          >
            <button
              className={'flex items-center gap-2 px-4 text-left'}
              onClick={() => setShow((v) => ({ ...v, roles: !v.roles }))}
            >
              <RolesIcon />
              <p>{'Roles'}</p>
              <ArrowIcon rotate={show.roles ? 180 : 0} />
            </button>
            {show.roles && userData.userInfo.length ? (
              <div className={'animate__animated animate__fadeIn flex flex-col gap-2 pl-8'}>
                {userData.userInfo.map((info, idx) => (
                  <button
                    key={'info-' + idx}
                    className={cn('text-left', {
                      'text-danger': info.role === tenantData?.activeTenantPermission?.role,
                    })}
                    onClick={() => changeRole(info)}
                  >
                    {info.role}
                  </button>
                ))}
              </div>
            ) : null}
            <button className={'flex items-center gap-2 px-4 text-left'}>
              <ViewProfileIcon />
              <p>{'View profile'}</p>
            </button>
            <button
              className={
                'flex items-center gap-2 border-t-2 border-gray fill-danger px-4 pt-2 text-left text-danger'
              }
              onClick={logout}
            >
              <PowerOffIcon />
              <p>{'Logout'}</p>
            </button>
          </div>
        ) : null}
        <button onClick={() => setMenu({ wide: !tenantData?.menu?.wide })}>
          {tenantData?.menu?.wide ? (
            <BigMenuIcon
              height={20}
              width={20}
            />
          ) : (
            <SmallMenuIcon
              height={20}
              width={20}
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default memo(Header);
