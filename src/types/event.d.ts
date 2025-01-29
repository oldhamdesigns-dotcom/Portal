type Event = {
  id: number;
  name: string;
  eventDate: string | Date;
  bookLimit: number;
  eventType: 'INFO' | string;
  address: string;
  link: string;
  post: {
    id: number;
    title: string;
    body: '{}' | string;
    summary: string;
    postType: LimitType;
    status: 'PUBLISH' | string;
    storefronts?: any;
    galleries: {
      id: number;
      name: string;
      description: string;
      galleryType: LimitType;
      tenantId: number;
      galleryFiles: [
        {
          id: number;
          orderNo: number;
          largeText: string;
          smallText: string;
          buttonName: string;
          link: string;
          galleryType: LimitType;
          tenantId: number;
          file: AwsFile;
        },
      ];
    }[];
  };
  storefronts: InfoType[];
  subscribed: boolean;
  calendarItemIdentifier?: any;
  eventIdentifier?: any;
};
