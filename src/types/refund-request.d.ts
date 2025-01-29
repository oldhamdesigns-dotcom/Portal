type RefundRequest = {
  orderId: number;
  amount: string | number;
  reason:
    | 'MACHINE_MALFUNCTION'
    | 'OTHER_LOAD'
    | 'MACHINE_DID_NOT_START'
    | 'OTHER_FINANCIAL'
    | 'MOVING_OUT'
    | 'FUNDS_ACCIDENTALLY_ADDED'
    | 'CLOSE_ACCOUNT'
    | string;
  note: string | number;
  parentOrderId: number;
  userId: string;
  status: 'COMPLETED' | 'REFUND_REQUESTED' | 'COMPLETED_WITHOUT_PAYMENT' | string;
  requestedDateTime: string | Date;
  firstName: string | number;
  lastName: string;
  orderNumber: string | number;
  refundType: 'WALLET_BALANCE' | 'FINANCIAL' | string;
  resolution?:
    | 'FREE_PURCHASE'
    | 'ADD_TO_BALANCE'
    | 'CHECK_REFUND'
    | 'REFUND_TO_PAYMENT_SOURCE'
    | 'DECLINE'
    | null;
  adminNotice?: string;
  refundedAmount: string | number;
};
