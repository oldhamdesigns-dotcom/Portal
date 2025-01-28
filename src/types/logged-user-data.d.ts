type UserData = {
  firstName: string;
  lastName: string;
  serviceProviderAccessRoles: null;
  userPhones: any[];
  userEmails: any[];
  skillResponses: any[];
  jobTitles: any[];
  serviceAreaIds: any[];
  storeFrontIds: any[];
  createdAt: string | Date;
  userPhotos: {
    id: number;
    userId: string;
    mainPhoto: boolean;
    fileDTO: { id: number; awsId: string; fileName: string; fileType: string; filePath: string };
  }[];
};
