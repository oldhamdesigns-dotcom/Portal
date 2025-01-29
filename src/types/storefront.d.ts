type Storefront = {
  id: number;
  name: string;
  description: string;
  brandColor: string;
  primaryColor: string;
  successColor: string;
  dangerColor: string;
  warningColor: string;
  infoColor: string;
  tenant: Tenant;
  storefrontFiles: {
    id: number;
    imageType: 'IMAGE' | 'LOGO' | string;
    fileDTO: AwsFile;
  }[];
  chatRoomId?: any;
};
