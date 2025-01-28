type TenantPermission = {
  id: number;
  name: string;
  marketingName: string;
  uuid: string;
  tenantType: string;
  role: string;
  labels: string[];
  endpoints: { method: string; path: string }[];
};
