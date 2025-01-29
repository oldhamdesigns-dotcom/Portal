type TemplateAccessRole = {
  id: number;
  name: string;
  tenantType: 'SERVICE_PROVIDER' | 'SUPER_ADMIN' | 'COMPANY' | string;
  accessPermissionDTOS: { id: number; name: string }[];
};
