import { memo } from 'react';
import LogoIcon from '@icons/LogoIcon';
import { useNavigationRoutes } from '@hooks/useNavigationRoutes';
import { Link, useLocation } from 'react-router';
import { cn } from '@utils/CN';
import { useTenant } from '@/context/TenantContext';

const NavigationMenu = () => {
  const { tenantData } = useTenant();
  const routes = useNavigationRoutes();
  const { pathname } = useLocation();

  return (
    <div className={'flex flex-col px-4'}>
      <button className={'flex w-full items-center gap-2'}>
        <LogoIcon />
        {tenantData?.menu?.wide ? (
          <p className={'text-nowrap text-sm font-bold'}>{'One Tap Away'}</p>
        ) : null}
      </button>
      <div
        className={cn(
          'animate__animated animate__fadeIn animate__fast flex flex-col items-start gap-3 py-5',
          {
            'animate__fadeInRight items-center': !tenantData?.menu?.wide,
          }
        )}
      >
        {routes.length
          ? routes.map(({ title, path, Icon = () => <></> }, idx) => (
              <Link
                to={path}
                key={'nav-' + idx}
                className={cn('flex items-center gap-2 px-2 py-1 text-left', {
                  'w-full rounded-md bg-white': pathname === path,
                  'justify-center': !tenantData?.menu?.wide,
                })}
                title={title}
              >
                <Icon
                  className={cn('fill-inactive', { 'fill-black': pathname === path })}
                  active={pathname === path}
                />
                {tenantData?.menu?.wide ? (
                  <p className={cn('text-inactive', { 'text-black': pathname === path })}>
                    {title}
                  </p>
                ) : null}
              </Link>
            ))
          : null}
      </div>
    </div>
  );
};

export default memo(NavigationMenu);
