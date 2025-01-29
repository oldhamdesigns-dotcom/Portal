type Post = {
  id: number;
  title: string;
  body: '{}' | string;
  summary: string;
  postType: LimitType;
  status: 'PUBLISH' | string;
  storefronts: InfoType[];
  galleries: {
    id: number;
    name: string;
    description: string;
    galleryType: LimitType;
    tenantId: number;
    galleryFiles: {
      id: number;
      orderNo: number;
      largeText: string;
      smallText: string;
      buttonName: string;
      link: string;
      galleryType: LimitType;
      tenantId: number;
      file: AwsFile;
    }[];
  }[];
};
