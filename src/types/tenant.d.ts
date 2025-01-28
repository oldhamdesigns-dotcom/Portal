type Tenant = {
  id: number;
  name: string;
  marketingName: string;
  uuid: string;
  tenantType: number;
  parent: number;
  tenantFile: any[];
  topLevelTenantAdminEmail: any | null;
};
