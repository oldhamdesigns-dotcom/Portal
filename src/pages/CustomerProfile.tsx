import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { cn } from '@utils/CN';
import { getCustomerById, getTransactions, type Transaction } from '@/data/customers';
import routes from '@/navigation/routes.json';
import { useTenant } from '@/context/TenantContext';

const STATUS_BADGE: Record<string, { bg: string; text: string; border: string }> = {
  Active: { bg: 'bg-primary-50', text: 'text-primary', border: 'border-primary' },
  Inactive: { bg: 'bg-[#f2f2f2]', text: 'text-[#666]', border: 'border-[#bbb]' },
  Suspended: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-400' },
};

const TX_STATUS_STYLE: Record<string, string> = {
  Done:      'bg-[#f2f2f2] text-[#444] border-[#ccc]',
  Completed: 'bg-ds-green-100 text-ds-green-900 border-ds-green-300',
  Failed:    'bg-ds-red-100 text-ds-red-900 border-ds-red-300',
  Pending:   'bg-ds-yellow-100 text-ds-yellow-900 border-ds-yellow-300',
  Closed:    'bg-[#f2f2f2] text-[#888] border-[#ccc]',
};

const TX_TYPE_STYLE: Record<string, string> = {
  'Washer':      'text-[#333333] bg-[#DDDDDD]',
  'Dryer':       'text-[#333333] bg-[#DDDDDD]',
  'Funds Added': 'text-ds-green-900 bg-[#B6DFA8]',
};

const TX_TYPE_LABEL: Record<string, string> = {
  'Washer': 'Purchase',
  'Dryer':  'Purchase',
};

const LaundryIcon = () => (
  <svg className="size-5 shrink-0" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12.8164 23.4057C12.8164 21.989 13.3981 20.7028 14.3346 19.7752C15.2711 18.8477 16.5697 18.2716 18 18.2716C19.4304 18.2716 20.729 18.8477 21.6655 19.7752C22.602 20.7028 23.1836 21.989 23.1836 23.4057V26.9999H26.6442V23.4057C26.6442 21.0434 25.6785 18.902 24.1128 17.3549C22.5507 15.8042 20.3888 14.8477 18.0037 14.8477C15.6186 14.8477 13.4566 15.8042 11.8946 17.3549C10.3289 18.9057 9.36316 21.0434 9.36316 23.4057V26.9999H12.8201V23.4057H12.8164Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M9.44363 14.9348C10.585 13.8044 11.9202 12.9239 13.3615 12.3334C14.8101 11.7392 16.3831 11.4239 17.9963 11.4239C19.6096 11.4239 21.1826 11.7392 22.6349 12.3334C24.0762 12.9239 25.4114 13.8044 26.5527 14.9348L29 12.5145C27.5477 11.0761 25.8284 9.94928 23.9481 9.17754C22.0715 8.4058 20.0522 8 18 8C15.9478 8 13.9285 8.4058 12.0519 9.17754C10.1716 9.94928 8.44862 11.0761 7 12.5145L9.44363 14.9348Z" fill="currentColor"/>
  </svg>
);

const TX_TYPE_ICON: Record<string, React.ReactNode> = {
  'Washer': <LaundryIcon />,
  'Dryer':  <LaundryIcon />,
  'Funds Added': (
    <svg className="size-5 shrink-0" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6C24.6274 6 30 11.3726 30 18C30 24.6274 24.6274 30 18 30C11.3726 30 6 24.6274 6 18C6 11.3726 11.3726 6 18 6ZM18 8.875C17.4477 8.875 17 9.32272 17 9.875V10.75H16.75C15.656 10.75 14.6066 11.1844 13.833 11.958C13.0594 12.7316 12.625 13.781 12.625 14.875C12.625 15.969 13.0594 17.0184 13.833 17.792C14.6066 18.5656 15.656 19 16.75 19H17V23.25H16.125C15.5614 23.25 15.0206 23.0264 14.6221 22.6279C14.2236 22.2294 14 21.6886 14 21.125C14 20.5727 13.5523 20.125 13 20.125C12.4477 20.125 12 20.5727 12 21.125C12 22.219 12.4344 23.2684 13.208 24.042C13.9816 24.8156 15.031 25.25 16.125 25.25H17V26.125C17 26.6773 17.4477 27.125 18 27.125C18.5523 27.125 19 26.6773 19 26.125V25.25H19.875C20.969 25.25 22.0184 24.8156 22.792 24.042C23.5656 23.2684 24 22.219 24 21.125C24 20.031 23.5656 18.9816 22.792 18.208C22.0184 17.4344 20.969 17 19.875 17H19V12.75H19.25C19.5291 12.75 19.8057 12.8053 20.0635 12.9121C20.3212 13.0189 20.5557 13.1748 20.7529 13.3721C20.9502 13.5693 21.1061 13.8038 21.2129 14.0615C21.4242 14.5717 22.0093 14.8138 22.5195 14.6025C23.0297 14.3912 23.2717 13.8071 23.0605 13.2969C22.8532 12.7964 22.55 12.341 22.167 11.958C21.784 11.575 21.3286 11.2718 20.8281 11.0645C20.3277 10.8572 19.7916 10.75 19.25 10.75H19V9.875C19 9.32272 18.5523 8.875 18 8.875ZM19.875 19C20.4386 19 20.9794 19.2236 21.3779 19.6221C21.7764 20.0206 22 20.5614 22 21.125C22 21.6886 21.7764 22.2294 21.3779 22.6279C20.9794 23.0264 20.4386 23.25 19.875 23.25H19V19H19.875ZM17 12.75V17H16.75C16.1864 17 15.6456 16.7764 15.2471 16.3779C14.8486 15.9794 14.625 15.4386 14.625 14.875C14.625 14.3114 14.8486 13.7706 15.2471 13.3721C15.6456 12.9736 16.1864 12.75 16.75 12.75H17Z" fill="currentColor"/>
    </svg>
  ),
};

const FILTER_TYPES = ['All Types', 'Purchase', 'Funds Added'];
const FILTER_STATUSES = ['All Statuses', 'Done', 'Completed', 'Pending', 'Refund Requested', 'Refund Pending', 'Refund Completed'];

const FILTER_STATUS_GROUPS = [
  { label: null, options: ['All Statuses'] },
  { label: 'Purchase', options: ['Done', 'Pending'] },
  { label: 'Funds Added', options: ['Completed'] },
  { label: 'Refund', options: ['Refund Requested', 'Refund Pending', 'Refund Completed'] },
];
const FILTER_SORTS = ['Most Recent', 'Oldest First', 'Amount: High to Low', 'Amount: Low to High'];

const PAGE_SIZE = 8;

const ChevronDownIcon = () => (
  <svg className="size-4 text-text-subtle shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronRightIcon = ({ size = 4 }: { size?: number }) => (
  <svg className={`size-${size} text-text-muted`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const EmailIcon = () => (
  <svg className="size-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const PhoneIcon = ({ small = false }: { small?: boolean }) => (
  <svg className={cn(small ? 'size-3.5' : 'size-5', 'text-primary shrink-0')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const HomeIcon = ({ small = false }: { small?: boolean }) => (
  <svg className={cn(small ? 'size-3.5' : 'size-5', 'text-primary shrink-0')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const CalendarIcon = ({ small = false }: { small?: boolean }) => (
  <svg className={cn(small ? 'size-3.5' : 'size-5', 'text-primary shrink-0')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const SmartphoneIcon = ({ small = false }: { small?: boolean }) => (
  <svg className={cn(small ? 'size-3.5' : 'size-5', 'text-primary shrink-0')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
  </svg>
);

const CopyableId = ({ id }: { id: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 group text-left"
      title={id}
    >
      <span className="text-[12px] text-text-muted font-mono">
        {id.length > 8 ? `${id.slice(0, 8)}…` : id}
      </span>
      {copied ? (
        <svg className="size-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="size-3.5 text-text-muted group-hover:text-text-subtle shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
};

const InlineId = ({ id }: { id: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 group" title={id}>
      <span className="text-[14px] font-medium text-text-body truncate max-w-[300px]">{id}</span>
      {copied ? (
        <svg className="size-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="size-3.5 text-text-muted group-hover:text-text-subtle shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
};

type SelectProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  groups?: { label: string | null; options: string[] }[];
};

const FilterSelect = ({ label, options, value, onChange, groups }: SelectProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-1 flex-1 min-w-0 relative">
      <p className="text-[12px] text-[#6a7282]">{label}</p>
      <button
        className="flex items-center justify-between gap-2 h-[40px] px-4 bg-white border border-border rounded-lg text-sm text-text-body hover:bg-surface transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="truncate">{value}</span>
        <ChevronDownIcon />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-border rounded-lg shadow-md z-50 overflow-hidden">
          {groups ? (
            groups.map((group, gi) => (
              <div key={gi}>
                {group.label && (
                  <p className="px-4 pt-2 pb-1 text-[11px] font-semibold text-text-muted uppercase tracking-wide">{group.label}</p>
                )}
                {group.options.map((opt) => (
                  <button
                    key={opt}
                    className={cn(
                      'w-full px-4 py-2 text-left text-sm hover:bg-primary-50 transition-colors',
                      group.label ? 'pl-5' : '',
                      opt === value ? 'text-primary font-medium' : 'text-text-subtle'
                    )}
                    onClick={() => { onChange(opt); setOpen(false); }}
                  >
                    {opt}
                  </button>
                ))}
                {gi < groups.length - 1 && <div className="border-t border-[#f0f0f0] my-1" />}
              </div>
            ))
          ) : (
            options.map((opt) => (
              <button
                key={opt}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm hover:bg-primary-50 transition-colors',
                  opt === value ? 'text-primary font-medium' : 'text-text-subtle'
                )}
                onClick={() => { onChange(opt); setOpen(false); }}
              >
                {opt}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const REFUND_REASONS = [
  'Machine malfunction',
  'Cycle did not complete',
  'Incorrect charge',
  'Double charge',
  'Other',
];

const DetailRow = ({ label, value, chip = true }: { label: string; value: string; chip?: boolean }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-[#f0f0f0] last:border-0 gap-4">
    <p className="text-[14px] text-text-body shrink-0">{label}</p>
    <p className="text-[14px] font-medium text-text-body truncate max-w-[60%] text-right">{value}</p>
  </div>
);

const TxDetailView = ({ tx, customer, onCreateRefund, onClose, txStats }: { tx: Transaction; customer: NonNullable<ReturnType<typeof getCustomerById>>; onCreateRefund?: () => void; onClose: () => void; txStats: TxStats }) => {
  const locationName = tx.details.split('—')[1]?.trim() ?? 'Sunset Location';
  const cycleEndMin = String((parseInt(tx.time.split(':')[1] ?? '0') + 32) % 60).padStart(2, '0');
  const cycleEnd = tx.time.replace(/:(\d{2}):/, `:${cycleEndMin}:`);
  const txIdx = parseInt(tx.id.split('-')[1] ?? '1');
  const as400Num = 1400000 + parseInt(tx.orderId.slice(-4));
  const fakeTransactionId = `${tx.orderId.slice(0,4)}cc9c0-d45a-4927-8864-ee52a7ee6dc2`;

  if (tx.type === 'Funds Added') {
    return (
      <div className="px-6 py-5 flex gap-5 overflow-y-auto flex-1">
        {/* Left */}
        <div className="flex flex-col gap-4 w-[45%] shrink-0">
          <div className="border border-border rounded-lg p-4">
            <p className="text-[14px] text-text-subtle mb-1">Customer Info</p>
            <DetailRow label="Name" value={`${customer.firstName} ${customer.lastName}`} />
            <DetailRow label="Address" value={customer.address} />
          </div>
          <div className="border border-border rounded-lg p-4">
            <p className="text-[14px] text-text-subtle mb-1">Attributes</p>
            <DetailRow label="walletId" value="CSC_USD" />
            <DetailRow label="amount" value={`$${tx.amount.toFixed(2)}`} />
            <DetailRow label="upperMachine" value="false" />
            <DetailRow label="type" value="USD" />
            <DetailRow label="transactionId" value={fakeTransactionId} />
          </div>
        </div>
        {/* Right */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <div className="border border-border rounded-lg p-4">
            <p className="text-[14px] text-text-subtle mb-1">PayRange Info</p>
            <DetailRow label="Lifetime Laundry Loads" value={String(txStats.loads)} />
            <DetailRow label="Lifetime Laundry Spend" value={`$${txStats.spend.toFixed(2)}`} />
            <DetailRow label="Refund Request Count" value={String(txStats.refundCount)} />
            <DetailRow label="Total Refunded Value" value={`$${txStats.refundTotal.toFixed(2)}`} />
            <DetailRow label="Laundry Location" value={locationName.toUpperCase()} />
            <DetailRow label="Default Room" value={`${as400Num}-0${(txIdx % 9) + 1}3`} />
            <DetailRow label="Current Balance" value={`$${txStats.balance.toFixed(2)}`} />
          </div>
          <div className="border border-border rounded-lg p-4">
            <p className="text-[14px] text-text-subtle mb-1">Transaction</p>
            <DetailRow label="Transaction Date" value={`${tx.date} 12:00:00 AM`} />
            <DetailRow label="Order Number" value={tx.orderId} />
            <DetailRow label="Amount Paid" value={`$${tx.amount.toFixed(2)}`} />
            <DetailRow label="Payment Method" value={tx.details} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-6 py-5 flex gap-5 overflow-y-auto flex-1">
        {/* Left column */}
        <div className="flex flex-col gap-4 w-[45%] shrink-0">
          <div className="border border-border rounded-lg p-4">
            <p className="text-[14px] text-text-subtle mb-1">Customer Info</p>
            <DetailRow label="Name" value={`${customer.firstName} ${customer.lastName}`} />
            <DetailRow label="Address" value={customer.address} />
          </div>

          <div className="border border-border rounded-lg p-4 flex-1">
            <p className="text-[14px] text-text-subtle mb-1">Transaction Details</p>
            <DetailRow label="Order ID" value={tx.orderId} />
            <DetailRow label="Date" value={tx.date} />
            <DetailRow label="Time" value={tx.time} />
            <DetailRow label="Load Price" value={`$${Math.abs(tx.amount).toFixed(2)}`} />
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <div className="border border-border rounded-lg p-4">
            <p className="text-[14px] text-text-subtle mb-1">Load Details</p>
            <DetailRow label="Location" value={locationName.toUpperCase()} />
            <DetailRow label="AS400" value={String(as400Num)} />
            <DetailRow label="RoomID" value={`${as400Num}-0${(txIdx % 9) + 1}3`} />
            <DetailRow label="Load Price" value={`$${Math.abs(tx.amount).toFixed(2)}`} />
            <DetailRow label="Cycle Start Time" value={tx.time} />
            <DetailRow label="Cycle End Time" value={cycleEnd} />
            <DetailRow label="Machine Position" value={String((txIdx * 7 % 98) + 1)} />
            <DetailRow label="BluKey ID" value={tx.orderId} />
            <DetailRow label="Record Created Time" value={tx.time} />
            <DetailRow label="Record Created Date" value={tx.date} />
          </div>
        </div>
      </div>
    </>
  );
};

const CreateRefundView = ({ tx, onBack, onClose, onSuccess }: { tx: Transaction; onBack: () => void; onClose: () => void; onSuccess: (tx: Transaction, reason: string, note: string) => void }) => {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [showReasons, setShowReasons] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-text-muted hover:text-text-body transition-colors mr-1">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <p className="text-[20px] font-semibold text-text-body">Create Refund</p>
        </div>
        <button onClick={onClose} className="text-text-muted hover:text-text-body transition-colors">
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="border-t border-border shrink-0" />

      <div className="px-6 py-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-[14px] text-text-muted">Reason</p>
          <div className="relative">
            <button
              className="w-full flex items-center justify-between h-[52px] px-4 bg-white border-2 border-primary rounded-lg text-[16px]"
              onClick={() => setShowReasons((v) => !v)}
            >
              <span className={reason ? 'text-text-body' : 'text-text-muted'}>{reason || 'Select a reason'}</span>
              <svg className="size-5 text-text-subtle shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showReasons && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-border rounded-lg shadow-md z-10 overflow-hidden">
                {REFUND_REASONS.map((r) => (
                  <button
                    key={r}
                    className="w-full px-4 py-3 text-left text-[14px] hover:bg-primary-50 transition-colors"
                    onClick={() => { setReason(r); setShowReasons(false); }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[14px] text-text-muted">Note</p>
          <textarea
            className="w-full h-[130px] border border-border rounded-lg px-4 py-3 text-[14px] text-text-body placeholder:text-text-muted outline-none focus:border-primary resize-none transition-colors"
            placeholder="Add a note"
            value={note}
            maxLength={150}
            onChange={(e) => setNote(e.target.value)}
          />
          <p className="text-[12px] text-text-muted text-right">{note.length}/150</p>
        </div>

        <button
          disabled={!reason}
          onClick={() => onSuccess(tx, reason, note)}
          className="w-full h-[52px] bg-black text-white text-[16px] font-semibold rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          Create
        </button>
      </div>
    </>
  );
};


const REFUND_STATUS_STYLE: Record<string, string> = {
  'Refund Requested': 'bg-ds-yellow-100 text-ds-yellow-900 border-ds-yellow-300',
  'Refund Pending':   'bg-ds-orange-100 text-ds-orange-900 border-ds-orange-300',
  'Refund Complete':         'bg-ds-green-100 text-ds-green-900 border-ds-green-300',
  'Refund Denied':    'bg-ds-red-100 text-ds-red-900 border-ds-red-300',
};

const RefundDetailTab = ({ tx, customer }: { tx: Transaction; customer: NonNullable<ReturnType<typeof getCustomerById>> }) => {
  const joinFormatted = new Date(customer.joinDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  return (
    <div className="flex gap-5 px-6 py-5 overflow-y-auto flex-1">
      <div className="flex flex-col gap-4 w-[45%] shrink-0">
        <div className="border border-border rounded-lg p-4">
          <p className="text-[14px] text-text-subtle mb-1">Customer Info</p>
          <DetailRow label="Name" value={`${customer.firstName} ${customer.lastName}`} />
          <DetailRow label="Address" value={customer.address} />
          <DetailRow label="Member Since" value={joinFormatted} />
        </div>
        <div className="border border-border rounded-lg p-4">
          <p className="text-[14px] text-text-subtle mb-1">Request Details</p>
          <DetailRow label="Order ID" value={tx.orderId} />
          {tx.refundDate && <DetailRow label="Date Initiated" value={`${tx.refundDate} · ${tx.refundTime ?? ''}`} />}
          {tx.refundReason && <DetailRow label="Reason" value={tx.refundReason} />}
          {tx.refundNote && <DetailRow label="Note" value={tx.refundNote} />}
          <DetailRow label="Refund Amount" value={`$${Math.abs(tx.amount).toFixed(2)}`} />
        </div>
      </div>
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <div className="border border-border rounded-lg p-4">
          <p className="text-[14px] text-text-subtle mb-1">PayRange Info</p>
          <div className="flex items-center justify-between py-2.5 border-b border-[#f0f0f0] gap-4">
            <p className="text-[14px] text-text-body">Total Loads</p>
            <p className="text-[14px] text-text-subtle">8</p>
          </div>
          <div className="flex items-center justify-between py-2.5 border-b border-[#f0f0f0] gap-4">
            <p className="text-[14px] text-text-body">Refund Requests</p>
            <p className="text-[14px] text-text-subtle">1</p>
          </div>
          <div className="flex items-center justify-between py-2.5 rounded gap-4 bg-orange-50 px-3 -mx-3">
            <p className="text-[14px] text-orange-700">Last 6 months</p>
            <p className="text-[14px] font-semibold text-orange-700">1</p>
          </div>
        </div>
        {tx.refundStatus === 'Refund Complete' && (
          <div className="border border-border rounded-lg p-4">
            <p className="text-[14px] text-text-subtle mb-1">Refund Approval</p>
            <DetailRow label="Resolution" value="Free Purchase" />
            <DetailRow label="Refund Complete Amount" value={`$${Math.abs(tx.amount).toFixed(2)}`} />
          </div>
        )}
      </div>
    </div>
  );
};

const TransactionModal = ({ tx, customer, onClose, onRefundCreated, txStats }: { tx: Transaction; customer: NonNullable<ReturnType<typeof getCustomerById>>; onClose: () => void; onRefundCreated: (tx: Transaction, reason: string, note: string) => void; txStats: TxStats }) => {
  const hasRefund = !!tx.refundStatus;
  const [tab, setTab] = useState<'refund' | 'transaction'>(hasRefund ? 'refund' : 'transaction');
  const [view, setView] = useState<'tabs' | 'create-refund'>('tabs');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (view === 'create-refund') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-lg border border-border shadow-xl flex flex-col w-full max-w-[540px]">
          <CreateRefundView tx={tx} onBack={() => setView('tabs')} onClose={onClose} onSuccess={onRefundCreated} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg border border-border shadow-xl w-full max-w-[900px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-3 shrink-0">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <p className="text-[20px] font-semibold text-text-body">{tx.type === 'Funds Added' ? `Wallet Reload Service order: ${tx.orderId}` : `${tx.type} — Order: ${tx.orderId}`}</p>
              {tx.refundStatus && (
                <span className={cn('text-[12px] font-medium px-2 py-0.5 rounded border', REFUND_STATUS_STYLE[tx.refundStatus])}>
                  {tx.refundStatus}
                </span>
              )}
            </div>
            <p className="text-[13px] text-text-muted">{tx.date} · {tx.time}</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-body transition-colors mt-1">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs — only shown when a refund exists */}
        {hasRefund && (
          <div className="flex px-6 border-b border-border shrink-0">
            {(['refund', 'transaction'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-4 py-2.5 text-[14px] font-medium border-b-2 -mb-px transition-colors capitalize',
                  tab === t ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-subtle'
                )}
              >
                {t === 'refund' ? 'Refund' : 'Transaction'}
              </button>
            ))}
          </div>
        )}
        {!hasRefund && <div className="border-t border-border shrink-0" />}

        {/* Body */}
        {hasRefund && tab === 'refund' ? (
          <RefundDetailTab tx={tx} customer={customer} />
        ) : (
          <TxDetailView
            tx={tx}
            customer={customer}
            onCreateRefund={hasRefund ? undefined : () => setView('create-refund')}
            onClose={onClose}
            txStats={txStats}
          />
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
          {!hasRefund && tab !== 'refund' && (
            <button
              onClick={() => setView('create-refund')}
              className="px-5 py-2 bg-black text-white text-[14px] font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Create Refund
            </button>
          )}
          <button onClick={onClose} className="px-5 py-2 border border-border rounded-lg text-[14px] text-text-subtle hover:bg-surface transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, green = false }: { label: string; value: string; green?: boolean }) => (
  <div className={cn('border border-border rounded-lg p-[10px] flex flex-col gap-1', green ? 'bg-[#f2f9ef]' : 'bg-white')}>
    <p className={cn('text-[14px]', green ? 'text-[#27481e]' : 'text-[#101828]')}>{label}</p>
    <p className={cn('text-[16px] font-semibold', green ? 'text-[#1b3910]' : 'text-text-body')}>{value}</p>
  </div>
);

type TxStats = { balance: number; loads: number; spend: number; refundCount: number; refundTotal: number };

type PayRangeTabsProps = {
  txStats: TxStats;
  actionsRef: React.RefObject<HTMLDivElement>;
  showActions: boolean;
  setShowActions: (fn: (v: boolean) => boolean) => void;
  setShowOffersModal: (v: boolean) => void;
  role: string;
  offers: Offer[];
  onOfferClick: (offer: Offer) => void;
};

const PayRangeTabs = ({ txStats, actionsRef, showActions, setShowActions, setShowOffersModal, role, offers, onOfferClick }: PayRangeTabsProps) => {
  const [tab, setTab] = useState<'payrange' | 'offers'>('payrange');

  return (
    <div className="flex flex-col flex-1 basis-[40%] self-start">
      {/* Tab row — sits above the card */}
      <div className="flex items-end">
        {(['payrange', 'offers'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'px-5 py-2.5 text-[14px] font-medium rounded-tl-lg rounded-tr-lg relative -mb-px transition-colors',
              tab === t
                ? 'bg-white border border-border border-b-white text-primary z-10'
                : 'text-text-muted hover:text-text-subtle'
            )}
          >
            {t === 'payrange' ? 'PayRange Info' : `Partner Offers (${offers.length})`}
          </button>
        ))}
      </div>

      {/* Card — corner opposite active tab gets rounded top */}
      <div className={cn(
        'bg-white border border-border shadow-[0px_2px_8px_rgba(0,0,0,0.08)] p-4 flex flex-col gap-3 relative z-0 flex-1',
        tab === 'payrange' ? 'rounded-b-lg rounded-tr-lg' : 'rounded-b-lg rounded-tl-lg'
      )}>
        {/* Both tab contents rendered simultaneously — inactive is invisible but holds height */}
        <div className="grid">
          {/* PayRange stats */}
          <div className={cn('col-start-1 row-start-1 flex flex-col gap-3', tab !== 'payrange' ? 'invisible pointer-events-none' : '')}>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Current Balance" value={`$${txStats.balance.toFixed(2)}`} />
              <StatCard label="Lifetime Laundry Spend" value={`$${txStats.spend.toFixed(2)}`} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Lifetime Loads" value={String(txStats.loads)} />
              <StatCard label="Refund Requests" value={String(txStats.refundCount)} green />
              <StatCard label="Total Refunded" value={`$${txStats.refundTotal.toFixed(2)}`} />
            </div>
          </div>

          {/* Offers list */}
          <div className={cn('col-start-1 row-start-1', tab !== 'offers' ? 'invisible pointer-events-none' : '')}>
            {offers.length === 0 ? (
              <div className="flex items-center justify-center py-8 text-[14px] text-text-muted">
                No offers issued yet
              </div>
            ) : (
              <div className="border border-border rounded-lg overflow-hidden">
                {offers.map((offer, i) => (
                  <button
                    key={offer.id}
                    onClick={() => onOfferClick(offer)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 hover:bg-surface transition-colors text-left',
                      i > 0 ? 'border-t border-[#f0f0f0]' : ''
                    )}
                  >
                    <p className="text-[14px] text-text-body">{offer.title}</p>
                    <span className="text-[13px] font-semibold text-text-body shrink-0 ml-4">
                      ${offer.amount.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions — always visible at bottom */}
        <div className="flex justify-end mt-auto">
          <div className="relative w-[200px]" ref={actionsRef}>
            <button
              onClick={() => setShowActions((v) => !v)}
              className="flex items-center justify-between px-4 py-2 bg-black text-white rounded-lg h-[40px] w-full hover:opacity-90 transition-opacity"
            >
              <span className="text-[14px] font-semibold">Actions</span>
              <svg className={cn('size-4 text-white shrink-0 transition-transform duration-200', { 'rotate-180': showActions })} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showActions && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-border rounded-lg shadow-lg overflow-hidden z-10">
                <button className="w-full px-4 py-3 text-left text-[14px] text-text-body hover:bg-primary-50 transition-colors border-b border-[#f0f0f0]"
                  onClick={() => { setShowActions(() => false); setShowOffersModal(true); }}>
                  Issue User Offers
                </button>
                {role !== 'Customer Support' && (
                  <>
                    <button className="w-full px-4 py-3 text-left text-[14px] text-text-body hover:bg-primary-50 transition-colors border-b border-[#f0f0f0]"
                      onClick={() => setShowActions(() => false)}>
                      Add To User Wallet Balance
                    </button>
                    <button className="w-full px-4 py-3 text-left text-[14px] text-text-body hover:bg-primary-50 transition-colors"
                      onClick={() => setShowActions(() => false)}>
                      Deduct from Balance
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

type AccountDetailsModalProps = {
  customer: NonNullable<ReturnType<typeof getCustomerById>>;
  initials: string;
  badge: { bg: string; text: string; border: string };
  joinFormatted: string;
  onClose: () => void;
};

const DETAIL_ROWS = [
  { label: 'Role', value: 'END USER' },
  { label: 'Marketing Options', value: 'No' },
  { label: 'Status', value: 'GUEST' },
  { label: 'Lease Expiry Date', value: 'N/A' },
  { label: 'Phones', value: 'N/A' },
];

const MOCK_DEVICES = [
  {
    allowsPush: true,
    isTester: false,
    fingerprint: '5755B9AF-A93B-4DBB-B9F7-33F808117033',
    appVersion: 'one_tap_away_1.9.25',
    createdAt: '08/24/2025 07:45:20 AM',
    updatedAt: '04/13/2026 07:53:50 AM',
  },
];

const AccountDetailsModal = ({ customer, initials, badge, joinFormatted, onClose }: AccountDetailsModalProps) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [tab, setTab] = useState<'details' | 'devices'>('details');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg border-2 border-[#99a1af] shadow-xl w-full max-w-[796px] h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-3 shrink-0">
          <p className="text-[20px] font-semibold text-[#0f172a]">Account Details</p>
          <button onClick={onClose} className="text-text-muted hover:text-text-body transition-colors">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-border shrink-0">
          {(['details', 'devices'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'px-4 py-2.5 text-[14px] font-medium border-b-2 -mb-px transition-colors capitalize',
                tab === t ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-subtle'
              )}
            >
              {t === 'details' ? 'Details' : 'Devices'}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">
          {tab === 'details' ? (
            <div className="px-6 py-6 flex flex-col gap-6 min-h-full">
              {/* Customer name + avatar */}
              <div className="flex items-center gap-3">
                <div className="size-[48px] rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-white text-[18px] font-semibold">{initials}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[18px] font-semibold text-text-body">{customer.firstName} {customer.lastName}</p>
                    <span className={cn('text-[13px] font-medium px-2 py-0.5 rounded-full border', badge.bg, badge.text, badge.border)}>
                      {customer.status}
                    </span>
                  </div>
                  <CopyableId id={customer.userId ?? customer.id} />
                </div>
              </div>

              {/* Contact info card */}
              <div className="border border-border rounded-lg flex items-stretch">
                <div className="flex flex-col gap-2 flex-1 px-4 py-4 justify-start">
                  <EmailIcon />
                  <p className="text-[14px] text-text-subtle">{customer.email}</p>
                </div>
                <div className="w-px my-3 bg-[#e2e8f0] shrink-0" />
                <div className="flex flex-col gap-2 flex-1 px-4 py-4 justify-start">
                  <PhoneIcon />
                  <p className="text-[14px] text-text-subtle">{customer.phone}</p>
                </div>
                <div className="w-px my-3 bg-[#e2e8f0] shrink-0" />
                <div className="flex flex-col gap-2 flex-1 px-4 py-4 justify-start">
                  <HomeIcon />
                  <p className="text-[14px] text-text-subtle">{customer.address}</p>
                </div>
                <div className="w-px my-3 bg-[#e2e8f0] shrink-0" />
                <div className="flex flex-col gap-2 flex-1 px-4 py-4 justify-start">
                  <CalendarIcon />
                  <p className="text-[14px] text-text-subtle">Member since: {joinFormatted}</p>
                </div>
              </div>

              {/* Account detail rows */}
              <div className="border border-border rounded-lg p-4 flex flex-col">
                <div className="flex items-center justify-between py-2.5 border-b border-[#f0f0f0] gap-4">
                  <p className="text-[14px] text-text-body shrink-0">Property</p>
                  <button onClick={() => setHasChanges(true)} className="flex items-center gap-2 h-[32px] px-3 bg-white border border-border rounded-lg text-sm text-text-body min-w-[160px] justify-between">
                    <span>OTA flow B</span>
                    <svg className="size-4 text-text-subtle shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {DETAIL_ROWS.map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-b border-[#f0f0f0] gap-4">
                    <p className="text-[14px] text-text-body shrink-0">{label}</p>
                    <p className="text-[14px] font-medium text-text-body">{value}</p>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2.5 gap-4">
                  <p className="text-[14px] text-text-body shrink-0">Tags</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-primary-50 rounded-full px-3 py-1">
                      <span className="text-[14px] text-text-subtle">Technician</span>
                      <button onClick={() => setHasChanges(true)} className="text-text-muted hover:text-text-body transition-colors">
                        <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <button onClick={() => setHasChanges(true)} className="flex items-center gap-2 px-3 py-1 h-[34px] bg-white border border-border rounded-lg text-[14px] text-text-body hover:bg-surface transition-colors">
                      Add Tag
                      <svg className="size-4 text-text-subtle shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="px-6 py-5 flex flex-col gap-4">
              {/* Devices header */}
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-semibold text-text-body">Users Devices</p>
                <button
                  onClick={() => {
                    const headers = ['Allows Push', 'Is Tester', 'Device Fingerprint', 'App Version', 'Created At', 'Updated At'];
                    const rows = MOCK_DEVICES.map((d) => [String(d.allowsPush), String(d.isTester), d.fingerprint, d.appVersion, d.createdAt, d.updatedAt]);
                    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `devices-${customer.firstName}-${customer.lastName}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="text-[14px] text-primary hover:underline transition-colors"
                >
                  Export CSV
                </button>
              </div>

              {/* Table */}
              <div className="border border-border rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex bg-[#f9fafb]">
                  {[
                    { label: 'Allows Push', w: 'w-[10%]' },
                    { label: 'Is Tester', w: 'w-[9%]' },
                    { label: 'Device Fingerprint', w: 'flex-1' },
                    { label: 'App Version', w: 'w-[16%]' },
                    { label: 'Created at', w: 'w-[18%]' },
                    { label: 'Updated at', w: 'w-[18%]' },
                  ].map(({ label, w }) => (
                    <div key={label} className={cn('px-3 py-2.5', w)}>
                      <p className="text-[13px] font-medium text-[#6a7282]">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {MOCK_DEVICES.map((device, i) => (
                  <div key={i} className="flex items-start border-t border-[#f0f0f0]">
                    <div className="w-[10%] px-3 py-3">
                      <p className="text-[14px] text-text-body">{String(device.allowsPush)}</p>
                    </div>
                    <div className="w-[9%] px-3 py-3">
                      <p className="text-[14px] text-text-body">{String(device.isTester)}</p>
                    </div>
                    <div className="flex-1 px-3 py-3">
                      <p className="text-[13px] text-text-body font-mono break-all">{device.fingerprint}</p>
                    </div>
                    <div className="w-[16%] px-3 py-3">
                      <p className="text-[14px] text-text-body break-words">{device.appVersion}</p>
                    </div>
                    <div className="w-[18%] px-3 py-3">
                      <p className="text-[13px] text-text-body">{device.createdAt}</p>
                    </div>
                    <div className="w-[18%] px-3 py-3">
                      <p className="text-[13px] text-text-body">{device.updatedAt}</p>
                    </div>
                  </div>
                ))}

                {/* Footer */}
                <div className="flex items-center px-3 py-2 border-t border-border bg-white">
                  <p className="text-[13px] text-[#6a7282]">Showing {MOCK_DEVICES.length} of {MOCK_DEVICES.length} devices</p>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Shared footer — always pinned to bottom */}
        <div className="flex justify-end gap-3 px-6 pb-5 shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 border border-border rounded-lg text-[16px] font-semibold text-text-body hover:bg-surface transition-colors">
            Close
          </button>
          {tab === 'details' && (
            <button
              disabled={!hasChanges}
              className="px-6 py-2.5 bg-black rounded-lg text-[16px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const OFFER_DURATIONS = ['7 days', '14 days', '30 days', '60 days', '90 days'];

const IssueUserOffersModal = ({ onClose, onSubmit }: { onClose: () => void; onSubmit: (offer: Offer) => void }) => {
  const [amount, setAmount] = useState('');
  const [purchases, setPurchases] = useState('1');
  const [showTitles, setShowTitles] = useState(false);
  const [note, setNote] = useState('');
  const [duration, setDuration] = useState('30 days');
  const [showDurations, setShowDurations] = useState(false);

  const amt = parseFloat(amount) || 0;
  const qty = parseInt(purchases) || 1;
  const computedTitle = amt > 0 ? `One Tap Away Credit: $${amt.toFixed(2)}` : '';
  const totalLabel = `$${(amt * qty).toFixed(2)} for ${qty} purchase${qty !== 1 ? 's' : ''} of $${amt.toFixed(2)} each`;
  const canSubmit = amt > 0;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg border border-border shadow-xl w-full max-w-[500px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
          <p className="text-[20px] font-semibold text-text-body">Issue User Offers</p>
          <button onClick={onClose} className="text-text-muted hover:text-text-body transition-colors">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-4">
          {/* Amount */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[14px] text-text-muted">Amount</p>
            <input
              type="number"
              min="0"
              step="0.01"
              className="h-[48px] px-4 border border-border rounded-lg text-[15px] text-text-body placeholder:text-text-muted outline-none focus:border-primary transition-colors"
              placeholder="$0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Number of Purchases */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[14px] text-text-muted">Number of Purchases</p>
            <input
              type="number"
              min="1"
              className="h-[48px] px-4 border border-border rounded-lg text-[15px] text-text-body outline-none focus:border-primary transition-colors"
              value={purchases}
              onChange={(e) => setPurchases(e.target.value)}
            />
          </div>

          {/* Total Amount */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[14px] text-text-muted">Total Amount</p>
            <div className="h-[48px] px-4 bg-[#f2f2f2] border border-border rounded-lg flex items-center">
              <p className="text-[15px] text-text-subtle">{totalLabel}</p>
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[14px] text-text-muted">Title</p>
            <div className="relative">
              <button
                className="w-full flex items-center justify-between h-[48px] px-4 bg-white border border-border rounded-lg text-[15px] hover:bg-surface transition-colors"
                onClick={() => amt > 0 && setShowTitles((v) => !v)}
              >
                <span className={computedTitle ? 'text-text-body' : 'text-text-muted'}>{computedTitle || 'Enter an amount first'}</span>
                <svg className="size-4 text-text-subtle shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showTitles && amt > 0 && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-border rounded-lg shadow-md z-10 overflow-hidden">
                  <button
                    className="w-full px-4 py-3 text-left text-[14px] bg-primary text-white"
                    onClick={() => setShowTitles(false)}
                  >
                    {computedTitle}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Note */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[14px] text-text-muted">Note</p>
            <textarea
              className="w-full h-[110px] border border-border rounded-lg px-4 py-3 text-[14px] text-text-body placeholder:text-text-muted outline-none focus:border-primary resize-none transition-colors"
              placeholder="Add a note"
              value={note}
              maxLength={150}
              onChange={(e) => setNote(e.target.value)}
            />
            <p className="text-[12px] text-text-muted text-right">{note.length}/150</p>
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[14px] text-text-muted">Duration in days</p>
            <div className="relative">
              <button
                className="w-full flex items-center justify-between h-[48px] px-4 bg-white border border-border rounded-lg text-[15px] text-text-body hover:bg-surface transition-colors"
                onClick={() => setShowDurations((v) => !v)}
              >
                <span>{duration}</span>
                <svg className="size-4 text-text-subtle shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showDurations && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-border rounded-lg shadow-md z-10 overflow-hidden">
                  {OFFER_DURATIONS.map((d) => (
                    <button
                      key={d}
                      className={cn('w-full px-4 py-3 text-left text-[14px] hover:bg-primary-50 transition-colors', d === duration ? 'text-primary font-medium' : 'text-text-subtle')}
                      onClick={() => { setDuration(d); setShowDurations(false); }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            disabled={!canSubmit}
            onClick={() => {
              const now = new Date();
              onSubmit({
                id: String(Math.floor(Math.random() * 90000000) + 10000000),
                title: computedTitle,
                amount: amt,
                numPurchases: qty,
                note,
                duration,
                createdAt: now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              });
              onClose();
            }}
            className="w-full h-[52px] bg-black text-white text-[16px] font-semibold rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity mt-1"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

type Offer = {
  id: string;
  title: string;
  amount: number;
  numPurchases: number;
  note: string;
  duration: string;
  createdAt: string;
};

const BadgeRow = ({ label, value, green = false }: { label: string; value: string; green?: boolean }) => (
  <div className={cn('flex items-center justify-between py-2.5 border-b border-[#f0f0f0] last:border-0 gap-4', green ? 'bg-[#f2f9ef] px-3 -mx-3 rounded' : '')}>
    <p className={cn('text-[14px] shrink-0', green ? 'text-ds-green-900' : 'text-text-body')}>{label}</p>
    <span className="text-[13px] font-medium bg-[#f2f2f2] border border-[#ddd] rounded px-2 py-0.5 text-text-body">{value}</span>
  </div>
);

const OfferDetailModal = ({ offer, customer, txStats, onClose }: { offer: Offer; customer: NonNullable<ReturnType<typeof getCustomerById>>; txStats: { balance: number; loads: number; spend: number; refundCount: number; refundTotal: number }; onClose: () => void }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg border border-border shadow-xl w-full max-w-[900px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-3 shrink-0">
          <div className="flex flex-col gap-1">
            <p className="text-[20px] font-semibold text-text-body">Partner Offer Service order: {offer.id}</p>
            <p className="text-[13px] text-text-muted">{offer.createdAt}</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-body transition-colors mt-1">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="border-t border-border shrink-0" />

        {/* Body */}
        <div className="flex gap-5 px-6 py-5 overflow-y-auto flex-1">
          {/* Left */}
          <div className="flex flex-col gap-4 w-[45%] shrink-0">
            <div className="border border-border rounded-lg p-4">
              <p className="text-[14px] text-text-subtle mb-1">Customer Info</p>
              <DetailRow label="Name" value={`${customer.firstName} ${customer.lastName}`} />
              <DetailRow label="Address" value={customer.address} />
            </div>
            <div className="border border-border rounded-lg p-4">
              <p className="text-[14px] text-text-subtle mb-1">Attributes</p>
              <DetailRow label="note" value={offer.note || offer.title} />
              <DetailRow label="amount" value={`$${offer.amount.toFixed(2)}`} />
              <DetailRow label="numPurchases" value={String(offer.numPurchases)} />
              <DetailRow label="description" value={offer.title} />
              <DetailRow label="title" value={offer.title} />
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            <div className="border border-border rounded-lg p-4">
              <p className="text-[14px] text-text-subtle mb-1">PayRange Info</p>
              <DetailRow label="Lifetime Laundry Loads" value={String(txStats.loads)} />
              <DetailRow label="Lifetime Laundry Spend" value={`$${txStats.spend.toFixed(2)}`} />
              <DetailRow label="Refund Request Count" value={String(txStats.refundCount)} />
              <DetailRow label="Total Refunded Value" value={`$${txStats.refundTotal.toFixed(2)}`} />
              <DetailRow label="Laundry Location" value="Laundry location not found" />
              <DetailRow label="Default Room" value="Default room not found" />
              <DetailRow label="Current Balance" value={`$${txStats.balance.toFixed(2)}`} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-border shrink-0">
          <button onClick={onClose} className="px-5 py-2 border border-border rounded-lg text-[14px] text-text-subtle hover:bg-surface transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DevicesModal = ({ customer, onClose }: { customer: NonNullable<ReturnType<typeof getCustomerById>>; onClose: () => void }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg border border-border shadow-xl w-full max-w-[860px] max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
          <p className="text-[18px] font-semibold text-text-body">Devices</p>
          <button onClick={onClose} className="text-text-muted hover:text-text-body transition-colors">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 overflow-y-auto flex flex-col gap-4">
          <div className="flex items-center justify-end">
            <button
              onClick={() => {
                const headers = ['Allows Push', 'Is Tester', 'Device Fingerprint', 'App Version', 'Created At', 'Updated At'];
                const rows = MOCK_DEVICES.map((d) => [String(d.allowsPush), String(d.isTester), d.fingerprint, d.appVersion, d.createdAt, d.updatedAt]);
                const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `devices-${customer.firstName}-${customer.lastName}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-[14px] text-primary hover:underline transition-colors"
            >
              Export CSV
            </button>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <div className="flex bg-[#f9fafb]">
              {[
                { label: 'Allows Push', w: 'w-[10%]' },
                { label: 'Is Tester', w: 'w-[9%]' },
                { label: 'Device Fingerprint', w: 'flex-1' },
                { label: 'App Version', w: 'w-[16%]' },
                { label: 'Created at', w: 'w-[18%]' },
                { label: 'Updated at', w: 'w-[18%]' },
              ].map(({ label, w }) => (
                <div key={label} className={cn('px-3 py-2.5', w)}>
                  <p className="text-[13px] font-medium text-[#6a7282]">{label}</p>
                </div>
              ))}
            </div>
            {MOCK_DEVICES.map((device, i) => (
              <div key={i} className="flex items-start border-t border-[#f0f0f0]">
                <div className="w-[10%] px-3 py-3"><p className="text-[14px] text-text-body">{String(device.allowsPush)}</p></div>
                <div className="w-[9%] px-3 py-3"><p className="text-[14px] text-text-body">{String(device.isTester)}</p></div>
                <div className="flex-1 px-3 py-3"><p className="text-[13px] text-text-body font-mono break-all">{device.fingerprint}</p></div>
                <div className="w-[16%] px-3 py-3"><p className="text-[14px] text-text-body break-words">{device.appVersion}</p></div>
                <div className="w-[18%] px-3 py-3"><p className="text-[13px] text-text-body">{device.createdAt}</p></div>
                <div className="w-[18%] px-3 py-3"><p className="text-[13px] text-text-body">{device.updatedAt}</p></div>
              </div>
            ))}
            <div className="flex items-center px-3 py-2 border-t border-border bg-white">
              <p className="text-[13px] text-[#6a7282]">Showing {MOCK_DEVICES.length} of {MOCK_DEVICES.length} devices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomerProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const customer = id ? getCustomerById(id) : undefined;
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(() => id ? getTransactions(id) : []);
  const [successAlert, setSuccessAlert] = useState<string | null>(null);

  const { tenantData } = useTenant();
  const role = tenantData?.activeTenantPermission?.role ?? 'Customer Support';
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) {
        setShowActions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!successAlert) return;
    const t = setTimeout(() => setSuccessAlert(null), 4000);
    return () => clearTimeout(t);
  }, [successAlert]);

  const handleRefundCreated = (parentTx: Transaction, reason: string, note: string) => {
    const now = new Date();
    const refundDate = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    const refundTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setAllTransactions((prev) =>
      prev.map((tx) =>
        tx.id === parentTx.id
          ? { ...tx, refundStatus: 'Refund Requested' as const, refundReason: reason, refundNote: note || undefined, refundDate, refundTime }
          : tx
      )
    );
    setSelectedTx(null);
    setSuccessAlert(`Refund request for Order ${parentTx.orderId} submitted successfully.`);
  };
  const [txSearch, setTxSearch] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [filterSort, setFilterSort] = useState('Most Recent');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-lg text-text-subtle">Customer not found.</p>
        <Link to={routes.MAIN_DASHBOARD} className="text-primary underline text-sm">Back to home</Link>
      </div>
    );
  }

  const initials = `${customer.firstName[0]}${customer.lastName[0]}`.toUpperCase();
  const badge = STATUS_BADGE[customer.status] ?? STATUS_BADGE.Inactive;
  const joinFormatted = new Date(customer.joinDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

  const filtered = allTransactions
    .filter((tx) => {
      const q = txSearch.toLowerCase();
      if (q && !tx.orderId.includes(q) && !tx.type.toLowerCase().includes(q) && !tx.details.toLowerCase().includes(q)) return false;
      if (filterType === 'Purchase' && tx.type !== 'Washer' && tx.type !== 'Dryer') return false;
      if (filterType !== 'All Types' && filterType !== 'Purchase' && tx.type !== filterType) return false;
      if (filterStatus === 'Refund Requested' && tx.refundStatus !== 'Refund Requested') return false;
      if (filterStatus === 'Refund Pending' && tx.refundStatus !== 'Refund Pending') return false;
      if (filterStatus === 'Refund Completed' && tx.refundStatus !== 'Refund Complete') return false;
      if (!['All Statuses', 'Refund Requested', 'Refund Pending', 'Refund Completed'].includes(filterStatus) && tx.status !== filterStatus) return false;
      return true;
    })
    .sort((a, b) => {
      if (filterSort === 'Amount: High to Low') return b.amount - a.amount;
      if (filterSort === 'Amount: Low to High') return a.amount - b.amount;
      if (filterSort === 'Oldest First') return parseInt(a.orderId) - parseInt(b.orderId);
      return parseInt(b.orderId) - parseInt(a.orderId);
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const runningBalanceMap = useMemo(() => {
    const sorted = [...allTransactions].sort((a, b) => parseInt(a.orderId) - parseInt(b.orderId));
    const map: Record<string, number> = {};
    let balance = 0;
    for (const tx of sorted) {
      if (tx.status !== 'Failed' && tx.status !== 'Pending') {
        if (tx.type === 'Funds Added') balance += tx.amount;
        else if ((tx.type === 'Washer' || tx.type === 'Dryer') && tx.refundStatus !== 'Refund Complete') balance -= tx.amount;
      }
      map[tx.id] = Math.max(0, balance);
    }
    return map;
  }, [allTransactions]);

  const txStats = {
    balance: customer.balance,
    loads: allTransactions.filter((t) => t.type === 'Washer' || t.type === 'Dryer').length,
    spend: allTransactions.filter((t) => (t.type === 'Washer' || t.type === 'Dryer') && t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
    refundCount: allTransactions.filter((t) => t.refundStatus).length,
    refundTotal: allTransactions.filter((t) => t.refundStatus === 'Refund Complete').reduce((sum, t) => sum + t.amount, 0),
  };

  return (
    <div className="flex flex-col px-8 py-6 min-h-full max-w-[1400px] mx-auto w-full">
      {/* Success toast */}
      {successAlert && (
        <div className="fixed top-6 right-6 z-[100] w-[440px] bg-white rounded-lg shadow-[0px_8px_16px_rgba(0,0,0,0.15)] overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-[#169c43]">
            <svg className="size-[26px] text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="flex-1 text-white text-[18px] font-semibold leading-[28px] truncate">Refund Submitted</p>
            <button onClick={() => setSuccessAlert(null)} className="text-white/70 hover:text-white transition-colors shrink-0 ml-2">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-4 py-5">
            <p className="text-[15px] text-text-body leading-relaxed">{successAlert}</p>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-1 mb-5 text-sm">
        <Link to={routes.MAIN_DASHBOARD} className="text-text-muted underline hover:text-text-subtle transition-colors">
          Support Portal
        </Link>
        <ChevronRightIcon size={3} />
        <Link to={-1 as any} className="text-text-muted underline hover:text-text-subtle transition-colors">
          Search Results
        </Link>
        <ChevronRightIcon size={3} />
        <span className="text-text-body font-semibold">{customer.firstName} {customer.lastName}</span>
      </div>

      {showModal && (
        <AccountDetailsModal
          customer={customer}
          initials={initials}
          badge={badge}
          joinFormatted={joinFormatted}
          onClose={() => setShowModal(false)}
        />
      )}

      {showDevicesModal && (
        <DevicesModal customer={customer} onClose={() => setShowDevicesModal(false)} />
      )}

      {selectedOffer && (
        <OfferDetailModal offer={selectedOffer} customer={customer} txStats={txStats} onClose={() => setSelectedOffer(null)} />
      )}

      {/* Main layout */}
      <div className="flex flex-col gap-4">
        {/* Top row: header card + PayRange tabs */}
        <div className="flex gap-5 items-stretch">
        <div className="flex-1 min-w-0 basis-[60%]">
          <div className="border border-border rounded-lg shadow-[0px_2px_8px_rgba(0,0,0,0.08)] bg-white p-6 flex flex-col gap-6 h-full">

          {/* Customer header card */}
          {/* Identity */}
          <div className="flex items-start gap-4">
            <div className="size-[52px] rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-white text-[18px] font-semibold">{initials}</span>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              {/* Row 1: name + status badge */}
              <div className="flex items-center gap-2">
                <p className="text-[20px] font-bold text-text-body">{customer.firstName} {customer.lastName}</p>
                <span className={cn('text-[13px] font-medium px-3 py-0.5 rounded-full border', badge.bg, badge.text, badge.border)}>
                  {customer.status}
                </span>
              </div>
              {/* Row 2: email */}
              <div className="flex items-center gap-1.5 text-[13px] text-text-subtle">
                <span>{customer.email}</span>
              </div>
              {/* Row 3: member since */}
              <div className="flex items-center gap-1.5 text-text-subtle">
                <CalendarIcon small />
                <span className="text-[13px]">Member since {joinFormatted}</span>
              </div>
            </div>
          </div>

          {/* Contact card */}
          <div className="flex items-stretch border border-border rounded-xl">
            <div className="flex items-start gap-3 flex-1 px-6 py-3">
              <SmartphoneIcon />
              <div className="flex flex-col gap-0.5">
                <p className="text-[13px] text-text-body font-medium">App Version</p>
                <p className="text-[14px] text-text-subtle">{MOCK_DEVICES[0]?.appVersion ?? '—'}</p>
                <button
                  onClick={() => setShowDevicesModal(true)}
                  className="text-[12px] text-primary hover:underline transition-colors text-left mt-1"
                >
                  View Devices
                </button>
              </div>
            </div>
            <div className="w-px self-stretch bg-border shrink-0" />
            <div className="flex items-start gap-3 flex-1 px-6 py-3">
              <HomeIcon />
              <div className="flex flex-col gap-0.5">
                <p className="text-[13px] text-text-body font-medium">Address</p>
                <p className="text-[14px] text-text-subtle">{customer.address}</p>
              </div>
            </div>
            <div className="w-px self-stretch bg-border shrink-0" />
            <div className="flex items-start gap-3 flex-1 px-6 py-3">
              <PhoneIcon />
              <div className="flex flex-col gap-0.5">
                <p className="text-[13px] text-text-body font-medium">Phone</p>
                <p className="text-[14px] text-text-subtle">{customer.phone}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="flex items-center gap-1 text-[13px] text-primary hover:underline transition-colors"
            >
              {showDetails ? 'Hide details' : 'View more details'}
              <svg className={cn('size-3 transition-transform duration-200', showDetails ? 'rotate-180' : '')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {showDetails && (
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 flex flex-col">
                <div className="flex items-center justify-between py-2.5 border-b border-[#f0f0f0] gap-4">
                  <p className="text-[14px] text-text-body shrink-0">ID</p>
                  <InlineId id={customer.userId ?? customer.id} />
                </div>
                {DETAIL_ROWS.map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-b border-[#f0f0f0] gap-4">
                    <p className="text-[14px] text-text-body shrink-0">{label}</p>
                    <p className="text-[14px] font-medium text-text-body">{value}</p>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2.5 border-b border-[#f0f0f0] gap-4">
                  <p className="text-[14px] text-text-body shrink-0">Tags</p>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1.5 bg-primary-50 rounded-full px-3 py-1">
                      <span className="text-[13px] text-text-subtle">Technician</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          </div>
        </div>

        {/* PayRange tabs panel */}
        <PayRangeTabs txStats={txStats} actionsRef={actionsRef} showActions={showActions} setShowActions={setShowActions} setShowOffersModal={setShowOffersModal} role={role} offers={offers} onOfferClick={setSelectedOffer} />
        </div>

        {/* Transactions card — full width */}
        <div className="border border-border rounded-lg shadow-[0px_2px_8px_rgba(0,0,0,0.08)] bg-white p-6">
          <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-text-body">User Transactions</h2>
            <button
              onClick={() => {
                const headers = ['Date', 'Time', 'Order ID', 'Type', 'Details', 'Amount', 'Balance', 'Status'];
                const rows = filtered.map((tx) => {
                  const bal = Math.max(0, runningBalanceMap[tx.id] ?? 0);
                  return [
                    tx.date, tx.time, tx.orderId, tx.type, tx.details,
                    `$${tx.amount.toFixed(2)}`,
                    `$${bal.toFixed(2)}`,
                    tx.status,
                  ];
                });
                const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `transactions-${customer.firstName}-${customer.lastName}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-[14px] text-primary hover:underline transition-colors"
            >
              Export CSV
            </button>
          </div>

          {/* Search + Filter toggle */}
          <div className="flex items-end gap-3">
            <div className="flex flex-col gap-1 flex-1 max-w-[298px]">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  className="w-full h-[40px] pl-[40px] pr-4 border border-[#d1d5dc] rounded-lg text-[14px] placeholder:text-[rgba(15,23,42,0.5)] outline-none focus:border-primary transition-colors"
                  placeholder="Search by ID, type, details..."
                  value={txSearch}
                  onChange={(e) => { setTxSearch(e.target.value); setPage(1); }}
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={cn(
                'flex items-center gap-2 h-[40px] px-4 rounded-lg border text-[14px] transition-colors shrink-0',
                showFilters
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-text-body border-border hover:bg-surface'
              )}
            >
              <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2" />
              </svg>
              Filters
              {(filterType !== 'All Types' || filterStatus !== 'All Statuses' || filterSort !== 'Most Recent') && (
                <span className={cn(
                  'size-[18px] rounded-full text-[11px] font-semibold flex items-center justify-center',
                  showFilters ? 'bg-white text-primary' : 'bg-primary text-white'
                )}>
                  {[filterType !== 'All Types', filterStatus !== 'All Statuses', filterSort !== 'Most Recent'].filter(Boolean).length}
                </span>
              )}
            </button>
            {(filterType !== 'All Types' || filterStatus !== 'All Statuses' || filterSort !== 'Most Recent') && (
              <button
                onClick={() => { setFilterType('All Types'); setFilterStatus('All Statuses'); setFilterSort('Most Recent'); setPage(1); }}
                className="flex items-center gap-1.5 h-[40px] px-3 rounded-lg text-[14px] text-text-muted hover:text-text-body transition-colors shrink-0"
              >
                <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear
              </button>
            )}
          </div>

          {/* Collapsible filters */}
          {showFilters && (
            <div className="flex gap-3 items-end">
              <FilterSelect label="Type" options={FILTER_TYPES} value={filterType} onChange={(v) => { setFilterType(v); setPage(1); }} />
              <FilterSelect label="Status" options={FILTER_STATUSES} value={filterStatus} onChange={(v) => { setFilterStatus(v); setPage(1); }} />
              <FilterSelect label="Sort By" options={FILTER_SORTS} value={filterSort} onChange={(v) => { setFilterSort(v); setPage(1); }} />
            </div>
          )}

          {/* Table */}
          <div className="border border-[#efefef] rounded-lg overflow-hidden">
            {/* Header */}
            <div className="flex bg-[#f9fafb]">
              {[
                { label: 'Date', w: 'w-[180px]' },
                { label: 'Order ID', w: 'w-[110px]' },
                { label: 'Type', w: 'w-[180px]' },
                { label: 'Details', w: 'flex-1' },
                { label: 'Amount', w: 'w-[90px]' },
                { label: 'Balance', w: 'w-[100px]' },
                { label: 'Status', w: 'w-[160px]' },
              ].map(({ label, w }) => (
                <div key={label} className={cn('p-[10px] shrink-0', w)}>
                  <p className="text-[14px] font-medium text-[#6a7282] whitespace-nowrap">{label}</p>
                </div>
              ))}
            </div>

            {/* Rows */}
            {paginated.length === 0 ? (
              <div className="px-4 py-6 text-sm text-text-muted">No transactions match your filters.</div>
            ) : (
              paginated.map((tx, i) => (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className={cn('flex items-center border-t border-[#f0f0f0] hover:bg-primary-50 transition-colors cursor-pointer', { 'border-t-0': i === 0 })}
                >
                  <div className="w-[180px] shrink-0 px-[10px] py-[8px]">
                    <span className="text-[14px] font-medium text-text-body">{tx.date}</span>{' '}
                    <span className="text-[12px] text-text-muted">{tx.time}</span>
                  </div>
                  <div className="w-[110px] shrink-0 px-[10px] py-[8px]">
                    <p className="text-[14px] text-text-body">{tx.orderId}</p>
                  </div>
                  <div className="w-[180px] shrink-0 px-[10px] py-[8px]">
                    <span className={cn('inline-flex items-center gap-1 text-[12px] font-medium px-1.5 py-0.5 rounded-md whitespace-nowrap', TX_TYPE_STYLE[tx.type] ?? 'bg-surface text-text-subtle')}>
                      {TX_TYPE_ICON[tx.type] ?? null}
                      {TX_TYPE_LABEL[tx.type] ?? tx.type}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 px-[10px] py-[8px]">
                    <p className="text-[14px] text-text-body truncate">
                      {(tx.type === 'Washer' || tx.type === 'Dryer') ? tx.details.split('—')[0].trim() : tx.details}
                    </p>
                    {tx.refundStatus && (
                      <p className="text-[12px] text-primary truncate">
                        {tx.refundStatus === 'Refund Complete'
                          ? `Refunded · $${tx.amount.toFixed(2)}`
                          : `Refund Request - ${tx.refundReason ?? ''}`}
                      </p>
                    )}
                    {tx.coupon && <p className="text-[12px] text-primary truncate">{tx.coupon}</p>}
                  </div>
                  <div className="w-[90px] shrink-0 px-[10px] py-[8px]">
                    <p className={cn('text-[14px] font-semibold', tx.type === 'Funds Added' ? 'text-blue-500' : 'text-text-body')}>
                      {tx.amount < 0 ? `-$${Math.abs(tx.amount).toFixed(2)}` : `$${tx.amount.toFixed(2)}`}
                    </p>
                  </div>
                  <div className="w-[100px] shrink-0 px-[10px] py-[8px]">
                    {(() => {
                      const bal = Math.max(0, runningBalanceMap[tx.id] ?? 0);
                      return (
                        <p className="text-[14px] text-text-body">
                          {`$${bal.toFixed(2)}`}
                        </p>
                      );
                    })()}
                  </div>
                  <div className="w-[160px] shrink-0 px-[10px] py-[8px]">
                    {tx.refundStatus ? (
                      <span className={cn('text-[12px] font-medium px-2 py-0.5 rounded border', REFUND_STATUS_STYLE[tx.refundStatus])}>
                        {tx.refundStatus}
                      </span>
                    ) : (
                      <span className={cn('text-[12px] font-medium px-2 py-0.5 rounded border', TX_STATUS_STYLE[tx.status])}>
                        {tx.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-white">
              <p className="text-[14px] text-[#6a7282]">
                Showing {Math.min(paginated.length, PAGE_SIZE)} of {filtered.length} entries
              </p>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      'size-[26px] text-[14px] rounded flex items-center justify-center',
                      p === page ? 'bg-black text-white' : 'border border-black text-[#727272]'
                    )}
                  >
                    {p}
                  </button>
                ))}
                {page < totalPages && (
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="size-[26px] border border-black rounded flex items-center justify-center"
                  >
                    <ChevronRightIcon size={3} />
                  </button>
                )}
              </div>
            </div>
          </div>
          </div>
          </div>

      </div>

      {showOffersModal && (
        <IssueUserOffersModal
          onClose={() => setShowOffersModal(false)}
          onSubmit={(offer) => { setOffers((prev) => [...prev, offer]); setShowOffersModal(false); }}
        />
      )}

      {selectedTx && (
        <TransactionModal tx={selectedTx} customer={customer} onClose={() => setSelectedTx(null)} onRefundCreated={handleRefundCreated} txStats={txStats} />
      )}
    </div>
  );
};

export default memo(CustomerProfilePage);
