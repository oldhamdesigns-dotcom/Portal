import { handleURLSearchParams } from '@services/search.params.service';
import ApiInstance from '@services/api.instance';

const getReports = async (
  tenant?: Partial<Tenant>,
  { page = 0, pageSize = 15, ...filter }: any | undefined = {
    page: 0,
    pageSize: 15,
  }
): Promise<{
  content: any[];
  page: Page;
}> => {
  if (!tenant) {
    return { content: [], page: { number: 0, totalPages: 0, size: 0, totalElements: 0 } };
  }
  const params = handleURLSearchParams({ page, pageSize, ...filter });
  const data = (await ApiInstance.get(`/node/api/report/tenant/${tenant?.uuid}`, { params }))?.data;

  return {
    content: data ?? [],
    page: { number: 0, totalPages: 0, size: 0, totalElements: data?.length ?? 0 },
  };
};

export { getReports };
