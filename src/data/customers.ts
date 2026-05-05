export type Customer = {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  balance: number;
  joinDate: string;
  plan: string;
};

const customers: Customer[] = [
  { id: 'C001', userId: '24882418-8031-70c7-0a12-748657977aaf', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@email.com', phone: '(555) 201-4321', address: '4311 Royal Oak Blvd, San Marcos TX 78666', status: 'Active', balance: 12.50, joinDate: '2022-03-15', plan: 'Premium' },
  { id: 'C002', userId: 'a3f1cc29-4d72-41b8-b305-1e6a09d84f12', firstName: 'Michael', lastName: 'Thompson', email: 'm.thompson@gmail.com', phone: '(555) 304-8872', address: '820 Westover Hills Blvd, San Antonio TX 78251', status: 'Active', balance: 0, joinDate: '2021-07-22', plan: 'Basic' },
  { id: 'C003', userId: '7b2e5f84-c910-4a3d-9e67-2d4b8c1f0a35', firstName: 'Emily', lastName: 'Rodriguez', email: 'emily.r@outlook.com', phone: '(555) 412-3390', address: '1502 Lakeline Blvd, Cedar Park TX 78613', status: 'Active', balance: 8.75, joinDate: '2023-01-08', plan: 'Standard' },
  { id: 'C004', userId: 'f0d3a7e1-5b24-48c6-8f91-3c7e2a6d9b04', firstName: 'James', lastName: 'Wilson', email: 'jwilson@company.com', phone: '(555) 509-6641', address: '3201 Cherry Ridge Dr, San Antonio TX 78230', status: 'Inactive', balance: 0, joinDate: '2020-11-30', plan: 'Basic' },
  { id: 'C005', userId: '1c8b4d06-e73f-4291-a058-6f5c3d2e7a91', firstName: 'Ashley', lastName: 'Martinez', email: 'ashley.m@email.com', phone: '(555) 607-2215', address: '9015 Manchaca Rd, Austin TX 78748', status: 'Active', balance: 21.25, joinDate: '2022-09-14', plan: 'Premium' },
  { id: 'C006', userId: '8e6f2c35-0a47-4b19-d782-5e9a1c4f8b23', firstName: 'David', lastName: 'Anderson', email: 'd.anderson@gmail.com', phone: '(555) 703-5587', address: '601 N Interregional Hwy, Austin TX 78702', status: 'Active', balance: 15.00, joinDate: '2023-04-02', plan: 'Standard' },
  { id: 'C008', userId: '6a1d8f43-2e90-47c5-a167-0b3e8c5f2d71', firstName: 'Christopher', lastName: 'Harris', email: 'charris@work.com', phone: '(555) 902-3347', address: '2222 Rio Grande St, Austin TX 78705', status: 'Active', balance: 18.50, joinDate: '2022-12-01', plan: 'Premium' },
  { id: 'C009', userId: 'b5e7c291-3f64-40a8-d950-4c1b7e3a6f82', firstName: 'Amanda', lastName: 'Clark', email: 'amanda.clark@email.com', phone: '(555) 100-7762', address: '5510 S Congress Ave, Austin TX 78745', status: 'Active', balance: 0, joinDate: '2023-06-17', plan: 'Standard' },
  { id: 'C010', userId: '9f2b6d54-8c01-4e37-b293-5d0a1f7e4c63', firstName: 'Matthew', lastName: 'Lewis', email: 'matt.lewis@gmail.com', phone: '(555) 203-4418', address: '1100 E 41st St, Austin TX 78751', status: 'Active', balance: 27.50, joinDate: '2021-02-28', plan: 'Premium' },
  { id: 'C011', userId: '4c0e3a17-7d85-41f9-c624-8b2f6e9d0a54', firstName: 'Stephanie', lastName: 'Lee', email: 'slee@outlook.com', phone: '(555) 305-8834', address: '4800 S Lamar Blvd, Austin TX 78745', status: 'Inactive', balance: 0, joinDate: '2020-08-11', plan: 'Basic' },
  { id: 'C012', userId: 'e8d1f965-4b23-40c7-a381-2e5c9a0f7b45', firstName: 'Ryan', lastName: 'Walker', email: 'r.walker@company.com', phone: '(555) 408-2256', address: '12331 N MoPac Expy, Austin TX 78758', status: 'Active', balance: 11.25, joinDate: '2022-06-05', plan: 'Standard' },
  { id: 'C013', userId: '2a7f4e08-9c36-4d51-b740-6f1e8b3c2a96', firstName: 'Lauren', lastName: 'Hall', email: 'lauren.hall@email.com', phone: '(555) 502-6671', address: '3410 Far West Blvd, Austin TX 78731', status: 'Active', balance: 24.00, joinDate: '2023-02-22', plan: 'Premium' },
  { id: 'C014', userId: '5b3c7f19-0e42-4a86-d295-1c4d9e6b8f07', firstName: 'Kevin', lastName: 'Young', email: 'kyoung@gmail.com', phone: '(555) 601-3345', address: '701 E 6th St, Austin TX 78701', status: 'Active', balance: 5.75, joinDate: '2021-10-14', plan: 'Basic' },
  { id: 'C016', userId: '0d5f9b41-6c28-4e03-b167-3a8e4d7c5f29', firstName: 'Brandon', lastName: 'Wright', email: 'b.wright@work.com', phone: '(555) 807-1123', address: '6500 N Lamar Blvd, Austin TX 78752', status: 'Active', balance: 29.75, joinDate: '2020-12-07', plan: 'Premium' },
  { id: 'C017', userId: '7e1c4a52-2d39-40f8-b916-4b5f7e2d8c30', firstName: 'Nicole', lastName: 'Scott', email: 'nicole.scott@email.com', phone: '(555) 901-5548', address: '8012 Mesa Dr, Austin TX 78759', status: 'Active', balance: 14.25, joinDate: '2023-03-18', plan: 'Standard' },
  { id: 'C018', userId: 'f3b6d803-5e14-4c27-a059-2c9a8f1e6b41', firstName: 'Tyler', lastName: 'Green', email: 't.green@gmail.com', phone: '(555) 104-7762', address: '3303 Bee Cave Rd, Austin TX 78746', status: 'Active', balance: 0, joinDate: '2021-09-25', plan: 'Basic' },
  { id: 'C019', userId: '1a9e7c64-3f05-4d18-b273-5d0c6b4f9e52', firstName: 'Brittany', lastName: 'Adams', email: 'brittany.a@outlook.com', phone: '(555) 207-3316', address: '1910 E Riverside Dr, Austin TX 78741', status: 'Active', balance: 19.50, joinDate: '2022-07-12', plan: 'Premium' },
  { id: 'C020', userId: '8c2f5e75-4a16-4b39-d184-6e1d9c3a7f63', firstName: 'Justin', lastName: 'Baker', email: 'jbaker@company.com', phone: '(555) 301-8841', address: '500 W 5th St, Austin TX 78701', status: 'Inactive', balance: 0, joinDate: '2020-05-03', plan: 'Basic' },
  { id: 'C021', userId: '4d0b8f86-7c27-4e40-a295-7f2e0d5c1a74', firstName: 'Samantha', lastName: 'Nelson', email: 'sam.nelson@email.com', phone: '(555) 404-2267', address: '4001 N Lamar Blvd, Austin TX 78756', status: 'Active', balance: 7.00, joinDate: '2023-05-29', plan: 'Standard' },
  { id: 'C022', userId: 'b7e3c197-0d38-4f51-a306-8a4f1e8b2c85', firstName: 'Andrew', lastName: 'Carter', email: 'a.carter@gmail.com', phone: '(555) 508-6693', address: '2800 S I-35 Frontage Rd, Austin TX 78704', status: 'Active', balance: 22.00, joinDate: '2021-01-17', plan: 'Premium' },
  { id: 'C023', userId: '5f4a1d08-8e49-4c62-b417-9b5c2f7e3a96', firstName: 'Kayla', lastName: 'Mitchell', email: 'kayla.m@icloud.com', phone: '(555) 602-4419', address: '11410 Century Oaks Terrace, Austin TX 78758', status: 'Active', balance: 22.75, joinDate: '2022-10-08', plan: 'Basic' },
  { id: 'C025', userId: '9a5c3e20-6b71-4d84-a639-1d4f0e8c6b18', firstName: 'Rachel', lastName: 'Roberts', email: 'rachel.roberts@email.com', phone: '(555) 809-1151', address: '6301 W Parmer Ln, Austin TX 78729', status: 'Active', balance: 16.25, joinDate: '2023-07-04', plan: 'Premium' },
];

export const searchCustomers = async (
  query: string,
  field: 'name' | 'email'
): Promise<Customer[]> => {
  await new Promise((res) => setTimeout(res, 300));
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return customers.filter((c) => {
    if (field === 'email') return c.email.toLowerCase().includes(q);
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q)
    );
  });
};

export type RefundStatus = 'Refund Requested' | 'Refund Pending' | 'Refund Complete' | 'Refund Denied';

export type Transaction = {
  id: string;
  date: string;
  time: string;
  orderId: string;
  type: string;
  details: string;
  amount: number;
  status: 'Done' | 'Completed' | 'Failed' | 'Pending' | 'Closed';
  coupon?: string;
  refundStatus?: RefundStatus;
  refundReason?: string;
  refundNote?: string;
  refundDate?: string;
  refundTime?: string;
};

export const getCustomerById = (id: string): Customer | undefined =>
  customers.find((c) => c.id === id);

export const getTransactions = (customerId: string): Transaction[] => [
  { id: `${customerId}-1`, date: '08/24/2025', time: '3:21:28 PM', orderId: '2344075', type: 'Washer', details: 'Washer #3 — Sunset Location', amount: 1.75, status: 'Done', coupon: 'App Download Bonus up to $5.00' },
  { id: `${customerId}-2`, date: '08/20/2025', time: '11:15:42 AM', orderId: '2344012', type: 'Dryer', details: 'Dryer #1 — Sunset Location', amount: 1.75, status: 'Done' },
  { id: `${customerId}-3`, date: '08/18/2025', time: '9:05:10 AM', orderId: '2343890', type: 'Washer', details: 'Washer #5 — Riverside Location', amount: 1.75, status: 'Done' },
  { id: `${customerId}-4`, date: '08/15/2025', time: '2:33:00 PM', orderId: '2343742', type: 'Funds Added', details: 'Visa •••• 4242', amount: 25.00, status: 'Completed' },
  { id: `${customerId}-5`, date: '08/12/2025', time: '4:10:55 PM', orderId: '2343601', type: 'Washer', details: 'Washer #2 — Northside Location', amount: 1.75, status: 'Done' },
  { id: `${customerId}-7`, date: '08/05/2025', time: '7:44:30 AM', orderId: '2343310', type: 'Dryer', details: 'Dryer #3 — Sunset Location', amount: 1.75, status: 'Done', refundStatus: 'Refund Complete', refundReason: 'Machine Malfunction', refundDate: '08/08/2025', refundTime: '10:22:11 AM' },
  { id: `${customerId}-8`, date: '08/01/2025', time: '1:00:00 PM', orderId: '2343199', type: 'Funds Added', details: 'Mastercard •••• 8817', amount: 10.00, status: 'Completed' },
  { id: `${customerId}-10`, date: '07/25/2025', time: '8:30:00 AM', orderId: '2342910', type: 'Washer', details: 'Washer #6 — Downtown Location', amount: 1.75, status: 'Failed' },
];

export default customers;
