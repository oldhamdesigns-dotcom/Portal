import { handleURLSearchParams } from '@services/search.params.service';
import ApiInstance from '@services/api.instance';

const getOrders = async (
  tenant?: Partial<Tenant>,
  { page = 0, pageSize: count = 15, ...filter }: any | undefined = {
    page: 0,
    pageSize: 15,
  }
): Promise<{
  content: Order[];
  page: Page;
}> => {
  if (!tenant) {
    return { content: [], page: { number: 0, totalPages: 0, size: 0, totalElements: 0 } };
  }
  const params = handleURLSearchParams({ page, count, ...filter });
  return (await ApiInstance.get(`/order-management/api/orders/${tenant?.uuid}/search`, { params }))
    ?.data;
};

export { getOrders };
