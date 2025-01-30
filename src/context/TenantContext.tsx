import { createContext, DetailedHTMLProps, useCallback, useContext, useState } from 'react';
import routes from '@/navigation/routes.json';
import { useNavigate } from 'react-router';
import VoidFn from '@utils/fn-utils';

const ACTIVE_TENANT_PERMISSION_KEY = 'activeTenantPermission';
const ACTIVE_TENANT_KEY = 'activeTenant';
const TENANT_LIST_KEY = 'tenantList';
const MENU_KEY = 'menu';

const SUPER_ADMIN_VALUE = 'Super Admin';

const initTenantData = () => {
  const activeTenantPermission = localStorage.getItem(ACTIVE_TENANT_PERMISSION_KEY)
    ? JSON.parse(localStorage.getItem(ACTIVE_TENANT_PERMISSION_KEY) as string)
    : undefined;
  return {
    activeTenantPermission,
    activeTenant: localStorage.getItem(ACTIVE_TENANT_KEY)
      ? (JSON.parse(localStorage.getItem(ACTIVE_TENANT_KEY) as string) as Tenant)
      : undefined,
    tenantList: localStorage.getItem(TENANT_LIST_KEY)
      ? (JSON.parse(localStorage.getItem(TENANT_LIST_KEY) as string) as Tenant[])
      : [],
    menu: localStorage.getItem(MENU_KEY)
      ? JSON.parse(localStorage.getItem(MENU_KEY) as string)
      : { wide: false, status: 'default' },
  };
};

const TenantContext = createContext<{
  tenantData: {
    activeTenantPermission:
      | { role: string; permissionList: string[]; isSuperAdmin: boolean }
      | undefined;
    activeTenant: Tenant | undefined;
    tenantList: Tenant[];
    menu: { status: string; wide: boolean };
  };
  changeTenantData: (tenantPermissions: TenantPermission[], tenantList: Tenant[]) => Promise<void>;
  setMenu: (value: Partial<{ menu: string; wide: boolean }>) => void;
  setActiveTenantPermission: (value: TenantPermission) => void;
  setActiveTenant: (value: Tenant) => void;
}>({
  tenantData: initTenantData(),
  changeTenantData: async (tenantPermissions: TenantPermission[], tenantList: Tenant[]) =>
    VoidFn('changeTenantData', tenantPermissions, tenantList),
  setActiveTenantPermission: (value: TenantPermission) =>
    VoidFn('setActiveTenantPermission', value),
  setActiveTenant: (value: Tenant) => VoidFn('setActiveTenant', value),
  setMenu: (value: Partial<{ status: string; wide: boolean }>) => VoidFn('setMenu', value),
});

const TenantProvider = ({ children }: DetailedHTMLProps<any, any>) => {
  const [tenantData, setTenantData] = useState(initTenantData());
  const navigate = useNavigate();

  const changeTenantData = useCallback(
    async (tenantPermissions: TenantPermission[], tenantList: Tenant[]) => {
      const {
        activeTenantPermission = undefined,
        activeTenant = undefined,
        menu: { wide = true, status = 'default' },
      } = tenantData ?? {};
      localStorage.setItem(TENANT_LIST_KEY, JSON.stringify(tenantList));
      if (!activeTenantPermission || !activeTenant) {
        const { role: backupRole, labels: permissionList = [] } =
          tenantPermissions?.[0] ?? undefined;
        const activeTenant = tenantList[0];
        const tenantPermission = {
          permissionList,
          role: activeTenantPermission?.role ?? backupRole,
          isSuperAdmin: activeTenantPermission?.role === SUPER_ADMIN_VALUE,
        };
        localStorage.setItem(ACTIVE_TENANT_PERMISSION_KEY, JSON.stringify(tenantPermission));
        localStorage.setItem(ACTIVE_TENANT_KEY, JSON.stringify(activeTenant));
        localStorage.setItem(MENU_KEY, JSON.stringify({ status, wide }));

        setTenantData({
          activeTenantPermission: tenantPermission,
          activeTenant,
          tenantList,
          menu: { status, wide },
        });
      }
    },
    [tenantData]
  );

  const setActiveTenantPermission = useCallback(
    (tenant: TenantPermission) => {
      const activeTenantPermission = {
        role: tenant.role,
        permissionList: tenant.labels,
        isSuperAdmin: tenant.role === SUPER_ADMIN_VALUE,
      };
      setTenantData((values) => ({
        ...values,
        activeTenantPermission,
      }));
      localStorage.setItem(ACTIVE_TENANT_PERMISSION_KEY, JSON.stringify(activeTenantPermission));
      navigate(routes.MAIN_DASHBOARD);
    },
    [setTenantData, navigate]
  );

  const setActiveTenant = useCallback(
    (activeTenant: Tenant) => {
      setTenantData((values) => ({ ...values, activeTenant }));
      localStorage.setItem(ACTIVE_TENANT_KEY, JSON.stringify(activeTenant));
    },
    [setTenantData]
  );

  const setMenu = useCallback(
    (menu: Partial<{ status: string; wide: boolean }> = { status: 'default', wide: true }) => {
      setTenantData((values) => ({ ...values, menu }));
      localStorage.setItem(MENU_KEY, JSON.stringify(menu));
    },
    [setTenantData]
  );

  return (
    <TenantContext.Provider
      value={{
        tenantData,
        changeTenantData,
        setActiveTenant,
        setActiveTenantPermission,
        setMenu,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

const useTenant = () => useContext(TenantContext);

export { useTenant, TenantProvider };
