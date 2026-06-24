// ─── Customer Service ─────────────────────────────────────────────────────────
// Wire these functions to the real API endpoints when available.
// The Customer and Transaction types are defined in src/data/customers.ts.
//
// Pages that consume this service:
//   - src/pages/MainDashboard.tsx  (searchCustomers)
//   - src/pages/SearchResults.tsx  (searchCustomers)
//   - src/pages/CustomerProfile.tsx (getCustomerById, getTransactions)

import ApiInstance from '@services/api.instance';
import { handleURLSearchParams } from '@services/search.params.service';
import type { Customer, Transaction } from '@/data/customers';

// TODO: confirm endpoint paths with the backend team

const searchCustomers = async (
  tenantUuid: string,
  query: string,
  field: 'name' | 'email' | 'phone',
  { page = 0, pageSize: count = 20 }: { page?: number; pageSize?: number } = {}
): Promise<{ content: Customer[]; page: Page }> => {
  const params = handleURLSearchParams({ page, count, query, field });
  return (
    await ApiInstance.get(`/customer-management/api/customers/${tenantUuid}/search`, { params })
  )?.data;
};

const getCustomerById = async (
  tenantUuid: string,
  customerId: string
): Promise<Customer> => {
  return (
    await ApiInstance.get(`/customer-management/api/customers/${tenantUuid}/${customerId}`)
  )?.data;
};

const getTransactions = async (
  tenantUuid: string,
  customerId: string,
  { page = 0, pageSize: count = 20 }: { page?: number; pageSize?: number } = {}
): Promise<{ content: Transaction[]; page: Page }> => {
  const params = handleURLSearchParams({ page, count });
  return (
    await ApiInstance.get(
      `/order-management/api/orders/${tenantUuid}/${customerId}/transaction`,
      { params }
    )
  )?.data;
};

export { searchCustomers, getCustomerById, getTransactions };
