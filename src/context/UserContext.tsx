import { createContext, DetailedHTMLProps, useCallback, useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { AuthUser } from 'aws-amplify/auth';
import { getUser, logoutUser } from '@aws/aws.service';
import {
  getLoggedUserInfo,
  getTenantListForUser,
  getTenantPermissions,
} from '@services/user.service';
import { useNavigate } from 'react-router';
import routes from '@/navigation/routes.json';
import { useTenant } from '@/context/TenantContext';
import VoidFn from '@utils/fn-utils';

const LOGGED_IN_USER_DATA_KEY = 'loggedInUserData';
const USER_INFO_KEY = 'userInfo';
const USER_KEY = 'user';

const initUserData = () => ({
  user: localStorage.getItem(USER_KEY)
    ? JSON.parse(localStorage.getItem(USER_KEY) as string)
    : undefined,
  userInfo: localStorage.getItem(USER_INFO_KEY)
    ? JSON.parse(localStorage.getItem(USER_INFO_KEY) as string)
    : undefined,
  loggedInUserData: localStorage.getItem(LOGGED_IN_USER_DATA_KEY)
    ? JSON.parse(localStorage.getItem(LOGGED_IN_USER_DATA_KEY) as string)
    : undefined,
});

const UserContext = createContext<{
  userData: {
    user: AuthUser | undefined;
    userInfo: TenantPermission[] | never[];
    loggedInUserData: UserData | undefined;
  };
  logout: () => void;
}>({
  userData: initUserData(),
  logout: () => VoidFn('logout'),
});

const UserProvider = ({ children }: DetailedHTMLProps<any, any>) => {
  const navigate = useNavigate();
  const { changeTenantData } = useTenant();

  const { data: userData, isError } = useQuery({
    initialData: initUserData(),
    queryKey: 'user',
    queryFn: async () => {
      const user: AuthUser | { error: unknown } = await getUser();
      if ('error' in user) {
        throw new Error('User is not logged in.');
      }
      const userInfo = (await getTenantPermissions()) ?? [];
      const loggedInUserData = await getLoggedUserInfo({
        tenant: userInfo?.[0],
        username: user?.username,
      });
      localStorage.setItem(LOGGED_IN_USER_DATA_KEY, JSON.stringify(loggedInUserData));
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      const tenantList = (await getTenantListForUser(userInfo?.[0])) ?? [];
      changeTenantData(userInfo, tenantList).then();

      return {
        user,
        userInfo,
        loggedInUserData,
      };
    },
  });

  const logout = useCallback(() => {
    (async () => {
      await logoutUser();
      localStorage.clear();
      navigate(routes.LOGIN);
    })();
  }, [navigate]);

  useEffect(() => {
    if (isError) {
      navigate(routes.LOGIN);
    }
  }, [isError, navigate]);

  return (
    <UserContext.Provider
      value={{
        userData: userData ?? initUserData(),
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserData = () => useContext(UserContext);

export { UserProvider, useUserData };
