import ApiInstance from '@services/api.instance';
import { handleURLSearchParams } from '@services/search.params.service';

const getLoggedUserInfo = async ({
  tenant,
  username,
}: {
  tenant: Partial<TenantPermission> | undefined;
  username: string | undefined;
}): Promise<UserData | undefined> => {
  if (!tenant) {
    return undefined;
  }
  return (await ApiInstance.get(`/user/api/userInfo/tenant/${tenant.uuid}/user/${username}`))?.data;
};

const getTenantPermissions = async (): Promise<TenantPermission[]> => {
  return (await ApiInstance.get('/user/user-tenant-permission'))?.data;
};

const getTenantListForUser = async (tenant: Partial<TenantPermission>): Promise<Tenant[]> => {
  return (await ApiInstance.get(`/user/tenant/${tenant?.uuid}/list`))?.data;
};

const getUsers = async (
  tenant?: Partial<Tenant>,
  { page = 0, pageSize = 15, ...filter } = {
    page: 0,
    pageSize: 15,
  }
): Promise<{
  content: User[];
  page: Page;
}> => {
  if (!tenant) {
    return { content: [], page: { number: 0, totalPages: 0, size: 0, totalElements: 0 } };
  }
  const params = handleURLSearchParams({ page, pageSize, ...filter });
  return (await ApiInstance.get(`/user/tenant/page/${tenant?.uuid}`, { params }))?.data;
};

export { getLoggedUserInfo, getTenantPermissions, getTenantListForUser, getUsers };
