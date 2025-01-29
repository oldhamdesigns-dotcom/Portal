type StorefrontImage = {
  id: number;
  imageType: 'IMAGE' | 'LOGO';
  fileDTO: {
    id: number;
    awsId: string;
    fileName: string;
    fileType: string;
    filePath: string;
  };
};
