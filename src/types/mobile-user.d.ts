type MobileUser = {
  id: string;
  firstName: string;
  lastName: string;
  emails: string;
  phones: string;
  streetNumber: string;
  street: string;
  zipCode: string;
  city: string;
  state: string;
  roles: 'END USER' | string;
  status: 'GUEST' | string;
  properties: 'One Tap Away' | string;
  leaseExpiryDate?: string | Date;
  createdAt?: string | Date;
  apartmentNumber: string;
};
