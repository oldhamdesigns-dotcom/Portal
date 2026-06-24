// ─── Types ────────────────────────────────────────────────────────────────────

export type KioskOrder = {
  id: string;
  date: string;
  order: string;
  kioskId: string;
  status: string;
  as400Room: string;
  licensePlate: string;
  amount: string;
  cc4digits: string;
};

export type AppTransaction = {
  id: string;
  date: string;
  orderId: string;
  customer: string;
  customerId: string;
  type: string;
  details: string;
  amount: number;
  status: string;
  refundStatus?: string;
  coupon?: boolean;
};

// ─── Mock data ────────────────────────────────────────────────────────────────
// Used for UI development only. Replace with real API calls from
// src/services/orders.service.ts once the Kiosk and App transaction
// endpoints are available.

// TODO: replace with ordersService.getKioskOrders(tenantUuid, params)
export const MOCK_KIOSK_ORDERS: KioskOrder[] = [
  { id: '23269817', date: '05/05/2026', order: '23269817', kioskId: '30003196', status: 'done', as400Room: '', licensePlate: '', amount: '3.00', cc4digits: '4127' },
  { id: '23269814', date: '05/05/2026', order: '23269814', kioskId: '30002074', status: 'done', as400Room: '', licensePlate: '', amount: '3.25', cc4digits: '0978' },
  { id: '23269811', date: '05/05/2026', order: '23269811', kioskId: '30004199', status: 'done', as400Room: '', licensePlate: '', amount: '3.25', cc4digits: '5090' },
  { id: '23269801', date: '05/05/2026', order: '23269801', kioskId: '30001777', status: 'done', as400Room: '', licensePlate: '', amount: '2.50', cc4digits: '8751' },
  { id: '23269796', date: '05/05/2026', order: '23269796', kioskId: '30002053', status: 'done', as400Room: '', licensePlate: '', amount: '3.25', cc4digits: '7598' },
  { id: '23269793', date: '05/05/2026', order: '23269793', kioskId: '30009618', status: 'done', as400Room: '', licensePlate: '', amount: '2.00', cc4digits: '4872' },
  { id: '23269787', date: '05/05/2026', order: '23269787', kioskId: '30012884', status: 'done', as400Room: '', licensePlate: '', amount: '2.50', cc4digits: '0250' },
  { id: '23269784', date: '05/05/2026', order: '23269784', kioskId: '30009674', status: 'done', as400Room: '', licensePlate: '', amount: '1.50', cc4digits: '6550' },
  { id: '23269759', date: '05/05/2026', order: '23269759', kioskId: '30010842', status: 'done', as400Room: '', licensePlate: '', amount: '2.50', cc4digits: '7793' },
  { id: '23269730', date: '05/05/2026', order: '23269730', kioskId: '30010451', status: 'done', as400Room: '', licensePlate: '', amount: '2.50', cc4digits: '6247' },
  { id: '23269727', date: '05/05/2026', order: '23269727', kioskId: '30006138', status: 'done', as400Room: '', licensePlate: '', amount: '2.75', cc4digits: '0856' },
  { id: '23269712', date: '05/05/2026', order: '23269712', kioskId: '30010842', status: 'done', as400Room: '', licensePlate: '', amount: '2.50', cc4digits: '7793' },
  { id: '23269711', date: '05/05/2026', order: '23269711', kioskId: '30007104', status: 'done', as400Room: '', licensePlate: '', amount: '2.25', cc4digits: '4515' },
  { id: '23269708', date: '05/05/2026', order: '23269708', kioskId: '30004627', status: 'done', as400Room: '', licensePlate: '', amount: '3.00', cc4digits: '3109' },
  { id: '23269678', date: '05/05/2026', order: '23269678', kioskId: '30004656', status: 'done', as400Room: '', licensePlate: '', amount: '2.50', cc4digits: '1416' },
];

// TODO: replace with ordersService.getAppTransactions(tenantUuid, params)
export const MOCK_APP_TRANSACTIONS: AppTransaction[] = [
  { id: 'TX-001', date: '05/05/2026 9:14 AM',   orderId: '23269817', customer: 'Sarah Johnson',  customerId: 'C001', type: 'Funds Added', details: 'Visa •••• 4242',                      amount: 15.00, status: 'Completed' },
  { id: 'TX-002', date: '05/05/2026 8:52 AM',   orderId: '23269814', customer: 'Marcus Lee',     customerId: 'C002', type: 'Washer',      details: 'Washer #3 — Riverside Location',      amount: 1.75,  status: 'Completed' },
  { id: 'TX-003', date: '05/05/2026 8:31 AM',   orderId: '23269811', customer: 'Priya Patel',    customerId: 'C003', type: 'Dryer',       details: 'Dryer #5 — Oak St. Location',         amount: 1.50,  status: 'Completed' },
  { id: 'TX-004', date: '05/05/2026 8:10 AM',   orderId: '23269801', customer: 'James Rivera',   customerId: 'C004', type: 'Funds Added', details: 'Mastercard •••• 9010',                amount: 20.00, status: 'Completed' },
  { id: 'TX-005', date: '05/05/2026 7:58 AM',   orderId: '23269796', customer: 'Sarah Johnson',  customerId: 'C001', type: 'Washer',      details: 'Washer #6 — Riverside Location',      amount: 1.75,  status: 'Completed' },
  { id: 'TX-006', date: '05/05/2026 7:44 AM',   orderId: '23269793', customer: 'Emily Nguyen',   customerId: 'C005', type: 'Funds Added', details: 'Visa •••• 3311',                      amount: 10.00, status: 'Completed' },
  { id: 'TX-007', date: '05/05/2026 7:29 AM',   orderId: '23269787', customer: 'Marcus Lee',     customerId: 'C002', type: 'Dryer',       details: 'Dryer #2 — Oak St. Location',         amount: 1.50,  status: 'Completed' },
  { id: 'TX-008', date: '05/05/2026 7:12 AM',   orderId: '23269784', customer: 'David Kim',      customerId: 'C006', type: 'Washer',      details: 'Washer #1 — Central Location',        amount: 2.00,  status: 'Completed' },
  { id: 'TX-009', date: '05/04/2026 6:55 PM',   orderId: '23269759', customer: 'Priya Patel',    customerId: 'C003', type: 'Funds Added', details: 'Visa •••• 4242',                      amount: 15.00, status: 'Completed' },
  { id: 'TX-010', date: '05/04/2026 6:38 PM',   orderId: '23269730', customer: 'James Rivera',   customerId: 'C004', type: 'Washer',      details: 'Washer #4 — Riverside Location',      amount: 1.75,  status: 'Completed' },
  { id: 'TX-011', date: '05/04/2026 6:20 PM',   orderId: '23269727', customer: 'Emily Nguyen',   customerId: 'C005', type: 'Dryer',       details: 'Dryer #7 — Oak St. Location',         amount: 1.50,  status: 'Completed' },
  { id: 'TX-012', date: '05/04/2026 6:05 PM',   orderId: '23269712', customer: 'David Kim',      customerId: 'C006', type: 'Funds Added', details: 'Mastercard •••• 5577',                amount: 25.00, status: 'Completed' },
  { id: 'TX-013', date: '05/04/2026 5:50 PM',   orderId: '23269711', customer: 'Sarah Johnson',  customerId: 'C001', type: 'Washer',      details: 'Washer #2 — Central Location',        amount: 1.75,  status: 'Completed' },
  { id: 'TX-014', date: '05/04/2026 5:33 PM',   orderId: '23269708', customer: 'Marcus Lee',     customerId: 'C002', type: 'Funds Added', details: 'Visa •••• 1122',                      amount: 10.00, status: 'Completed' },
  { id: 'TX-015', date: '05/04/2026 5:15 PM',   orderId: '23269678', customer: 'Anna Torres',    customerId: 'C007', type: 'Washer',      details: 'Washer #8 — Riverside Location',      amount: 1.75,  status: 'Pending' },
  { id: 'TX-016', date: '05/04/2026 4:58 PM',   orderId: '23269670', customer: 'Priya Patel',    customerId: 'C003', type: 'Dryer',       details: 'Dryer #3 — Oak St. Location',         amount: 1.50,  status: 'Completed', refundStatus: 'Refund Complete' },
  { id: 'TX-017', date: '05/04/2026 4:40 PM',   orderId: '23269652', customer: 'James Rivera',   customerId: 'C004', type: 'Funds Added', details: 'Visa •••• 6688',                      amount: 20.00, status: 'Completed' },
  { id: 'TX-018', date: '05/04/2026 4:22 PM',   orderId: '23269641', customer: 'Emily Nguyen',   customerId: 'C005', type: 'Washer',      details: 'Washer #5 — Central Location',        amount: 2.00,  status: 'Completed' },
  { id: 'TX-019', date: '05/04/2026 4:08 PM',   orderId: '23269628', customer: 'David Kim',      customerId: 'C006', type: 'Dryer',       details: 'Dryer #1 — Riverside Location',       amount: 1.50,  status: 'Completed' },
  { id: 'TX-020', date: '05/04/2026 3:50 PM',   orderId: '23269610', customer: 'Anna Torres',    customerId: 'C007', type: 'Funds Added', details: 'Mastercard •••• 2244',                amount: 15.00, status: 'Completed' },
  { id: 'TX-021', date: '05/04/2026 3:33 PM',   orderId: '23269591', customer: 'Sarah Johnson',  customerId: 'C001', type: 'Washer',      details: 'Washer #6 — Riverside Location',      amount: 1.75,  status: 'Completed', coupon: true },
  { id: 'TX-022', date: '05/04/2026 3:15 PM',   orderId: '23269580', customer: 'Marcus Lee',     customerId: 'C002', type: 'Dryer',       details: 'Dryer #4 — Central Location',         amount: 1.50,  status: 'Failed' },
  { id: 'TX-023', date: '05/04/2026 2:55 PM',   orderId: '23269562', customer: 'Priya Patel',    customerId: 'C003', type: 'Funds Added', details: 'Visa •••• 4242',                      amount: 10.00, status: 'Completed' },
  { id: 'TX-024', date: '05/04/2026 2:38 PM',   orderId: '23269540', customer: 'James Rivera',   customerId: 'C004', type: 'Washer',      details: 'Washer #3 — Oak St. Location',        amount: 1.75,  status: 'Completed' },
  { id: 'TX-025', date: '05/04/2026 2:20 PM',   orderId: '23269515', customer: 'Emily Nguyen',   customerId: 'C005', type: 'Dryer',       details: 'Dryer #6 — Riverside Location',       amount: 1.50,  status: 'Completed' },
  { id: 'TX-026', date: '05/04/2026 2:02 PM',   orderId: '23269490', customer: 'David Kim',      customerId: 'C006', type: 'Funds Added', details: 'Mastercard •••• 9900',                amount: 20.00, status: 'Completed' },
  { id: 'TX-027', date: '05/04/2026 1:44 PM',   orderId: '23269471', customer: 'Anna Torres',    customerId: 'C007', type: 'Washer',      details: 'Washer #1 — Central Location',        amount: 2.00,  status: 'Completed' },
  { id: 'TX-028', date: '05/04/2026 1:27 PM',   orderId: '23269450', customer: 'Sarah Johnson',  customerId: 'C001', type: 'Dryer',       details: 'Dryer #2 — Oak St. Location',         amount: 1.50,  status: 'Completed' },
  { id: 'TX-029', date: '05/04/2026 1:09 PM',   orderId: '23269430', customer: 'Marcus Lee',     customerId: 'C002', type: 'Funds Added', details: 'Visa •••• 1122',                      amount: 15.00, status: 'Completed' },
  { id: 'TX-030', date: '05/04/2026 12:50 PM',  orderId: '23269410', customer: 'Priya Patel',    customerId: 'C003', type: 'Washer',      details: 'Washer #7 — Riverside Location',      amount: 1.75,  status: 'Completed' },
];
