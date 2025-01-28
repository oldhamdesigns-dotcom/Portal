import { handleURLSearchParams } from '@services/search.params.service';
import ApiInstance from '@services/api.instance';

const getMobileUsers = async (
  tenant?: Partial<Tenant>,
  { page = 0, pageSize = 15, ...filter }: any | undefined = {
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
  return (await ApiInstance.get(`/user/tenant/end-user/page/${tenant?.uuid}`, { params }))?.data;
};

export { getMobileUsers };
