import { memo, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useTenant } from '@/context/TenantContext';
import { Controller, useForm } from 'react-hook-form';
import { useQueryParams } from '@hooks/useQueryParams';
import { getOrders } from '@services/orders.service';
import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';
import { cn } from '@utils/CN';
import { MOCK_KIOSK_ORDERS, MOCK_APP_TRANSACTIONS } from '@/data/orders';

// ─── Style maps ───────────────────────────────────────────────────────────────

const TX_TYPE_STYLE: Record<string, string> = {
  'Washer':      'text-text-subtle bg-border',
  'Dryer':       'text-text-subtle bg-border',
  'Funds Added': 'text-ds-green-900 bg-ds-green-500',
};

const TX_TYPE_LABEL: Record<string, string> = {
  'Washer': 'Purchase',
  'Dryer':  'Purchase',
};

const STATUS_STYLE: Record<string, string> = {
  done:      'bg-surface text-text-subtle border-border',
  completed: 'bg-ds-green-100 text-ds-green-900 border-ds-green-300',
  failed:    'bg-ds-red-100 text-ds-red-900 border-ds-red-300',
  pending:   'bg-ds-yellow-100 text-ds-yellow-900 border-ds-yellow-300',
  closed:    'bg-surface text-ds-neutral-500 border-border',
};

// ─── Icons ────────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg className="size-4 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="size-4 text-text-subtle shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
  </svg>
);

const SortIcon = ({ dir }: { dir?: 'asc' | 'desc' }) => (
  <svg className="size-3.5 text-[#9ca3af] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4" opacity={dir === 'asc' ? 1 : 0.3} />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 15l4 4 4-4" opacity={dir === 'desc' ? 1 : 0.3} />
  </svg>
);

const CopyIcon = () => (
  <svg className="size-3.5 shrink-0 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const key = status.toLowerCase();
  const style = STATUS_STYLE[key] ?? 'bg-surface text-text-subtle border-border';
  return (
    <span className={cn('text-ds-caption font-medium px-2 py-0.5 rounded border whitespace-nowrap', style)}>
      {capitalize(startCase(status))}
    </span>
  );
};

const FilterInput = ({
  placeholder,
  value,
  onChange,
  icon,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) => (
  <div className="relative flex items-center">
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-[36px] w-full rounded-lg border border-border bg-white pl-3 pr-8 text-ds-body-sm text-text-body placeholder:text-text-muted focus:border-primary focus:outline-none"
    />
    {icon && <div className="absolute right-2.5 pointer-events-none">{icon}</div>}
  </div>
);

const FilterDropdown = ({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-[36px] w-full flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 text-ds-body-sm text-text-body focus:border-primary focus:outline-none"
      >
        <span className={value ? 'text-text-body' : 'text-text-muted'}>{value || placeholder}</span>
        <ChevronDownIcon />
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-border rounded-lg shadow-md z-20 overflow-hidden">
          {[placeholder, ...options].map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt === placeholder ? '' : opt); setOpen(false); }}
              className={cn(
                'w-full text-left px-3 py-2 text-ds-body-sm hover:bg-surface transition-colors',
                (opt === placeholder ? '' : opt) === value ? 'bg-primary-50 text-primary font-medium' : 'text-text-body'
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Header cell ──────────────────────────────────────────────────────────────

const HeaderCell = ({
  label, w, sortKey, sortField, sortDir, onSort,
}: {
  label: string; w: string; sortKey?: string;
  sortField: string; sortDir: 'ASC' | 'DESC';
  onSort: (key: string) => void;
}) => (
  <div className={cn('px-[10px] py-[10px] shrink-0 flex items-center gap-1', w)}>
    <p className="text-ds-body-sm font-medium text-gray-1 whitespace-nowrap">{label}</p>
    {sortKey && (
      <button onClick={() => onSort(sortKey)} className="shrink-0">
        <SortIcon dir={sortField === sortKey ? (sortDir === 'ASC' ? 'asc' : 'desc') : undefined} />
      </button>
    )}
  </div>
);

// ─── Constants ────────────────────────────────────────────────────────────────

const defaultFilters = {
  searchTerm: '',
  customerId: '',
  serviceName: '',
  status: '',
  page: '0',
  pageSize: '15',
  sortProperty: 'requested_date_time',
  order: 'DESC',
};

const STATUS_OPTIONS = ['Completed', 'Failed', 'Pending', 'Closed'];
const PAGE_SIZE = 15;

// ─── Main component ───────────────────────────────────────────────────────────

const OrdersPage = () => {
  const { tenantData } = useTenant();
  const [params, setParams] = useQueryParams(defaultFilters);
  const { reset, control } = useForm({ defaultValues: defaultFilters, mode: 'onTouched' });
  const [mode, setMode] = useState<'app' | 'kiosk'>('app');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [kioskPage, setKioskPage] = useState(1);
  const [txSearch, setTxSearch] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState('');
  const [txStatusFilter, setTxStatusFilter] = useState('');
  const [txDateFrom, setTxDateFrom] = useState('');
  const [txDateTo, setTxDateTo] = useState('');
  const [txPage, setTxPage] = useState(1);

  const { data, refetch } = useQuery({
    initialData: { content: [], page: { number: 0, size: 0, totalElements: 0, totalPages: 0 } },
    queryKey: 'orders',
    queryFn: async () => await getOrders(tenantData?.activeTenant, params),
  });

  useEffect(() => { (async () => await refetch())(); }, [refetch, params]);
  useEffect(() => { reset(params); }, [reset, params]);

  const handleSort = (key: string) => {
    setParams({
      sortProperty: key,
      order: params.sortProperty === key && params.order === 'DESC' ? 'ASC' : 'DESC',
      page: '0',
    });
  };

  // Kiosk pagination
  const kioskFiltered = MOCK_KIOSK_ORDERS.filter((o) => {
    if (searchTerm && !o.order.includes(searchTerm) && !o.kioskId.includes(searchTerm)) return false;
    if (statusFilter && o.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    return true;
  });
  const kioskTotalPages = Math.ceil(kioskFiltered.length / PAGE_SIZE);
  const kioskPaginated = kioskFiltered.slice((kioskPage - 1) * PAGE_SIZE, kioskPage * PAGE_SIZE);

  // App pagination
  const appPage = parseInt(params.page) + 1;
  const appTotalPages = data?.page?.totalPages ?? 0;
  const appTotalElements = data?.page?.totalElements ?? 0;

  // Transactions pagination
  const txFiltered = MOCK_APP_TRANSACTIONS.filter((tx) => {
    const q = txSearch.toLowerCase();
    if (q && !tx.customer.toLowerCase().includes(q) && !tx.orderId.includes(q) && !tx.details.toLowerCase().includes(q)) return false;
    if (txTypeFilter && tx.type !== txTypeFilter) return false;
    if (txStatusFilter && tx.status.toLowerCase() !== txStatusFilter.toLowerCase()) return false;
    if (txDateFrom || txDateTo) {
      const txDate = new Date(tx.date);
      if (txDateFrom && txDate < new Date(txDateFrom)) return false;
      if (txDateTo) {
        const to = new Date(txDateTo);
        to.setHours(23, 59, 59, 999);
        if (txDate > to) return false;
      }
    }
    return true;
  });
  const txTotalPages = Math.ceil(txFiltered.length / PAGE_SIZE);
  const txPaginated = txFiltered.slice((txPage - 1) * PAGE_SIZE, txPage * PAGE_SIZE);

  const sortField = params.sortProperty;
  const sortDir = params.order as 'ASC' | 'DESC';

  return (
    <div className="flex flex-col px-8 py-6 min-h-full max-w-[1400px] mx-auto w-full">

      {/* Title + toggle */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-ds-h4 font-bold text-text-body">Orders</h1>
        <div className="flex items-center rounded-full border border-border overflow-hidden text-ds-body-sm font-semibold">
          <button
            onClick={() => setMode('app')}
            className={cn('px-4 py-1.5 transition-colors', mode === 'app' ? 'bg-black text-white' : 'bg-white text-text-body hover:bg-surface')}
          >
            APP
          </button>
          <button
            onClick={() => setMode('kiosk')}
            className={cn('px-4 py-1.5 transition-colors', mode === 'kiosk' ? 'bg-black text-white' : 'bg-white text-text-body hover:bg-surface')}
          >
            KIOSK
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="border border-border rounded-lg shadow-[0px_2px_8px_rgba(0,0,0,0.08)] bg-white">

        {/* Filters */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray">
          {mode === 'app' ? (
            <>
              <div className="flex-1 min-w-0">
                <FilterInput
                  placeholder="Search customer, order ID..."
                  value={txSearch}
                  onChange={(v) => { setTxSearch(v); setTxPage(1); }}
                  icon={<SearchIcon />}
                />
              </div>
              <div className="w-[160px]">
                <FilterDropdown
                  placeholder="Type"
                  value={txTypeFilter}
                  options={['Washer', 'Dryer', 'Funds Added']}
                  onChange={(v) => { setTxTypeFilter(v); setTxPage(1); }}
                />
              </div>
              <div className="w-[160px]">
                <FilterDropdown
                  placeholder="Status"
                  value={txStatusFilter}
                  options={['Completed', 'Pending', 'Failed']}
                  onChange={(v) => { setTxStatusFilter(v); setTxPage(1); }}
                />
              </div>
              <input
                type="date"
                value={txDateFrom}
                onChange={(e) => { setTxDateFrom(e.target.value); setTxPage(1); }}
                className="h-[36px] w-[140px] shrink-0 rounded-lg border border-border bg-white px-3 text-ds-body-sm text-text-body focus:border-primary focus:outline-none"
              />
              <input
                type="date"
                value={txDateTo}
                onChange={(e) => { setTxDateTo(e.target.value); setTxPage(1); }}
                className="h-[36px] w-[140px] shrink-0 rounded-lg border border-border bg-white px-3 text-ds-body-sm text-text-body focus:border-primary focus:outline-none"
              />
            </>
          ) : (
            <>
              <div className="flex-1 min-w-0">
                <FilterInput
                  placeholder="Search by order attributes"
                  value={searchTerm}
                  onChange={setSearchTerm}
                  icon={<SearchIcon />}
                />
              </div>
              <div className="flex-1 min-w-0">
                <FilterInput
                  placeholder="Search by kiosk attributes..."
                  value={''}
                  onChange={() => {}}
                />
              </div>
              <div className="w-[160px]">
                <FilterDropdown
                  placeholder="Status"
                  value={statusFilter}
                  options={STATUS_OPTIONS}
                  onChange={setStatusFilter}
                />
              </div>
            </>
          )}
        </div>

        {/* APP — transactions table */}
        {mode === 'app' && (
          <>
            <div className="flex bg-ds-neutral-50">
              {[
                { label: 'Date / Time', w: 'w-[160px]' },
                { label: 'Order ID', w: 'w-[120px]' },
                { label: 'Customer', w: 'w-[160px]' },
                { label: 'Type', w: 'w-[130px]' },
                { label: 'Details', w: 'flex-1' },
                { label: 'Amount', w: 'w-[100px]' },
                { label: 'Status', w: 'w-[140px]' },
              ].map(({ label, w }) => (
                <div key={label} className={cn('px-[10px] py-[10px] shrink-0', w)}>
                  <p className="text-ds-body-sm font-medium text-gray-1 whitespace-nowrap">{label}</p>
                </div>
              ))}
            </div>

            {txPaginated.length === 0 ? (
              <div className="px-4 py-8 text-ds-body-sm text-text-muted text-center">No transactions found.</div>
            ) : (
              txPaginated.map((tx, i) => (
                <div
                  key={tx.id}
                  className={cn('flex items-center border-t border-gray hover:bg-primary-50 transition-colors', { 'border-t-0': i === 0 })}
                >
                  <div className="w-[160px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-ds-body-sm text-text-body">{tx.date}</p>
                  </div>
                  <div className="w-[120px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-ds-label font-medium text-primary truncate">{tx.orderId}</p>
                  </div>
                  <div className="w-[160px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-ds-body-sm text-text-body truncate">{tx.customer}</p>
                  </div>
                  <div className="w-[130px] shrink-0 px-[10px] py-[10px]">
                    <span className={cn('inline-flex items-center text-ds-caption font-medium px-2 py-0.5 rounded-md whitespace-nowrap', TX_TYPE_STYLE[tx.type] ?? 'bg-surface text-text-subtle')}>
                      {TX_TYPE_LABEL[tx.type] ?? tx.type}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 px-[10px] py-[10px]">
                    <p className="text-ds-body-sm text-text-muted truncate">{tx.details}</p>
                  </div>
                  <div className="w-[100px] shrink-0 px-[10px] py-[10px]">
                    <p className={cn('text-ds-label font-semibold', tx.type === 'Funds Added' ? 'text-blue-500' : 'text-text-body')}>
                      {tx.type === 'Washer' || tx.type === 'Dryer' ? `-$${tx.amount.toFixed(2)}` : `$${tx.amount.toFixed(2)}`}
                    </p>
                  </div>
                  <div className="w-[140px] shrink-0 px-[10px] py-[10px]">
                    <StatusBadge status={tx.refundStatus ?? tx.status} />
                  </div>
                </div>
              ))
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
              <p className="text-ds-body-sm text-gray-1">
                Showing {txPaginated.length > 0 ? `${(txPage - 1) * PAGE_SIZE + 1}–${Math.min(txPage * PAGE_SIZE, txFiltered.length)}` : '0'} of {txFiltered.length} transactions
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={txPage <= 1}
                  onClick={() => setTxPage((p) => p - 1)}
                  className="size-[26px] border border-border rounded flex items-center justify-center disabled:opacity-40"
                >
                  <ChevronLeftIcon />
                </button>
                {Array.from({ length: Math.min(txTotalPages, 5) }, (_, i) => {
                  const start = Math.max(0, txPage - 3);
                  return start + i + 1;
                }).filter(p => p <= txTotalPages).map((p) => (
                  <button
                    key={p}
                    onClick={() => setTxPage(p)}
                    className={cn(
                      'size-[26px] text-ds-body-sm rounded flex items-center justify-center',
                      p === txPage ? 'bg-black text-white' : 'border border-border text-text-muted hover:bg-surface'
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={txPage >= txTotalPages}
                  onClick={() => setTxPage((p) => p + 1)}
                  className="size-[26px] border border-border rounded flex items-center justify-center disabled:opacity-40"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          </>
        )}

        {/* KIOSK table */}
        {mode === 'kiosk' && (
          <>
            <div className="flex bg-ds-neutral-50">
              {[
                { label: 'ID', w: 'w-[110px]' },
                { label: 'Date', w: 'w-[120px]' },
                { label: 'Order', w: 'w-[110px]' },
                { label: 'Kiosk ID', w: 'w-[120px]' },
                { label: 'Status', w: 'w-[110px]' },
                { label: 'as400-room', w: 'w-[130px]' },
                { label: 'License Plate', w: 'flex-1' },
                { label: 'Amount', w: 'w-[100px]' },
                { label: 'CC 4 digits', w: 'w-[110px]' },
              ].map(({ label, w }) => (
                <div key={label} className={cn('px-[10px] py-[10px] shrink-0', w)}>
                  <p className="text-ds-body-sm font-medium text-gray-1 whitespace-nowrap">{label}</p>
                </div>
              ))}
            </div>

            {kioskPaginated.length === 0 ? (
              <div className="px-4 py-8 text-ds-body-sm text-text-muted text-center">No kiosk orders found.</div>
            ) : (
              kioskPaginated.map((order, i) => (
                <div
                  key={order.id}
                  className={cn('flex items-center border-t border-gray hover:bg-primary-50 transition-colors', { 'border-t-0': i === 0 })}
                >
                  <div className="w-[110px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-ds-body-sm text-text-muted">{order.id}</p>
                  </div>
                  <div className="w-[120px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-ds-body-sm text-text-body">{order.date}</p>
                  </div>
                  <div className="w-[110px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-ds-label font-medium text-primary">{order.order}</p>
                  </div>
                  <div className="w-[120px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-ds-body-sm text-text-body">{order.kioskId}</p>
                  </div>
                  <div className="w-[110px] shrink-0 px-[10px] py-[10px]">
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="w-[130px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-ds-body-sm text-text-muted">{order.as400Room || '—'}</p>
                  </div>
                  <div className="flex-1 min-w-0 px-[10px] py-[10px]">
                    <p className="text-ds-body-sm text-text-muted">{order.licensePlate || '—'}</p>
                  </div>
                  <div className="w-[100px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-ds-label font-semibold text-text-body">${parseFloat(order.amount).toFixed(2)}</p>
                  </div>
                  <div className="w-[110px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-ds-body-sm text-text-body font-mono">{order.cc4digits}</p>
                  </div>
                </div>
              ))
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
              <p className="text-ds-body-sm text-gray-1">
                Showing {Math.min(kioskPaginated.length, PAGE_SIZE)} of {kioskFiltered.length} orders
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={kioskPage <= 1}
                  onClick={() => setKioskPage((p) => p - 1)}
                  className="size-[26px] border border-border rounded flex items-center justify-center disabled:opacity-40"
                >
                  <ChevronLeftIcon />
                </button>
                {Array.from({ length: kioskTotalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setKioskPage(p)}
                    className={cn(
                      'size-[26px] text-ds-body-sm rounded flex items-center justify-center',
                      p === kioskPage ? 'bg-black text-white' : 'border border-border text-text-muted hover:bg-surface'
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={kioskPage >= kioskTotalPages}
                  onClick={() => setKioskPage((p) => p + 1)}
                  className="size-[26px] border border-border rounded flex items-center justify-center disabled:opacity-40"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default memo(OrdersPage);
