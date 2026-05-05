import { Outlet } from 'react-router';
import { memo } from 'react';
import Header from '@/navigation/Header';
import { UserProvider } from '@/context/UserContext';
import NavigationMenu from '@/navigation/NavigationMenu';

const Layout = () => {
  return (
    <UserProvider>
      <div className="flex h-screen overflow-hidden bg-white">
        <NavigationMenu />
        <div className="flex flex-1 flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-auto bg-[#f7f7f7]">
            <Outlet />
          </main>
        </div>
      </div>
    </UserProvider>
  );
};

export default memo(Layout);
