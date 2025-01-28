import { Outlet } from 'react-router';
import { memo } from 'react';
import Header from '@/navigation/Header';
import { UserProvider } from '@/context/UserContext';
import NavigationMenu from '@/navigation/NavigationMenu';

const Layout = () => {
  return (
    <UserProvider>
      <div className={'flex pl-2 pt-[20px]'}>
        <NavigationMenu />
        <div className={'flex grow flex-col'}>
          <Header />
          <div className={'flex py-2 pl-2'}>
            <div className={'min-h-screen w-full rounded-lg bg-white py-2 pl-2'}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </UserProvider>
  );
};
export default memo(Layout);
