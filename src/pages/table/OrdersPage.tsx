import { memo, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useTenant } from '@/context/TenantContext';
import { Controller, useForm } from 'react-hook-form';
import { useQueryParams } from '@hooks/useQueryParams';
import { getOrders } from '@services/orders.service';
import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';
import { cn } from '@utils/CN';

// ─── Style maps ───────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, string> = {
  done:      'bg-[#f2f2f2] text-[#444] border-[#ccc]',
  completed: 'bg-ds-green-100 text-ds-green-900 border-ds-green-300',
  failed:    'bg-ds-red-100 text-ds-red-900 border-ds-red-300',
  pending:   'bg-ds-yellow-100 text-ds-yellow-900 border-ds-yellow-300',
  closed:    'bg-[#f2f2f2] text-[#888] border-[#ccc]',
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

// ─── Mock kiosk data ──────────────────────────────────────────────────────────

type KioskOrder = {
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

const MOCK_KIOSK_ORDERS: KioskOrder[] = [
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

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const key = status.toLowerCase();
  const style = STATUS_STYLE[key] ?? 'bg-[#f2f2f2] text-[#444] border-[#ccc]';
  return (
    <span className={cn('text-[12px] font-medium px-2 py-0.5 rounded border whitespace-nowrap', style)}>
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
      className="h-[36px] w-full rounded-lg border border-border bg-white pl-3 pr-8 text-[13px] text-text-body placeholder:text-text-muted focus:border-primary focus:outline-none"
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
        className="h-[36px] w-full flex items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 text-[13px] text-text-body focus:border-primary focus:outline-none"
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
                'w-full text-left px-3 py-2 text-[13px] hover:bg-surface transition-colors',
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
    <p className="text-[13px] font-medium text-[#6a7282] whitespace-nowrap">{label}</p>
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

const STATUS_OPTIONS = ['Done', 'Completed', 'Failed', 'Pending', 'Closed'];
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

  const sortField = params.sortProperty;
  const sortDir = params.order as 'ASC' | 'DESC';

  return (
    <div className="flex flex-col px-8 py-6 min-h-full max-w-[1400px] mx-auto w-full">

      {/* Title + toggle */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[22px] font-bold text-text-body">Orders</h1>
        <div className="flex items-center rounded-full border border-border overflow-hidden text-[13px] font-semibold">
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
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#f0f0f0]">
          {mode === 'app' ? (
            <>
              <div className="flex-1 min-w-0">
                <Controller
                  name="searchTerm"
                  control={control}
                  render={({ field }) => (
                    <FilterInput
                      placeholder="Search by order"
                      value={field.value}
                      onChange={(v) => { field.onChange(v); setParams({ searchTerm: v, page: '0' }); }}
                      icon={<SearchIcon />}
                    />
                  )}
                />
              </div>
              <div className="w-[160px]">
                <Controller
                  name="customerId"
                  control={control}
                  render={({ field }) => (
                    <FilterInput
                      placeholder="Customer"
                      value={field.value}
                      onChange={(v) => { field.onChange(v); setParams({ customerId: v, page: '0' }); }}
                    />
                  )}
                />
              </div>
              <div className="w-[160px]">
                <Controller
                  name="serviceName"
                  control={control}
                  render={({ field }) => (
                    <FilterInput
                      placeholder="Service"
                      value={field.value}
                      onChange={(v) => { field.onChange(v); setParams({ serviceName: v, page: '0' }); }}
                    />
                  )}
                />
              </div>
              <div className="w-[160px]">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FilterDropdown
                      placeholder="Status"
                      value={field.value}
                      options={STATUS_OPTIONS}
                      onChange={(v) => { field.onChange(v); setParams({ status: v.toLowerCase(), page: '0' }); }}
                    />
                  )}
                />
              </div>
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

        {/* APP table */}
        {mode === 'app' && (
          <>
            <div className="flex bg-[#f9fafb]">
              {[
                { label: '#', w: 'w-[100px]', key: 'id' },
                { label: 'Order', w: 'w-[110px]', key: 'order_number' },
                { label: 'First Name', w: 'w-[130px]', key: 'first_name' },
                { label: 'Last Name', w: 'w-[140px]', key: 'last_name' },
                { label: 'Date', w: 'w-[130px]', key: 'requested_date_time' },
                { label: 'Service', w: 'flex-1', key: 'service_name' },
                { label: 'Status', w: 'w-[120px]', key: 'status' },
                { label: 'Amount', w: 'w-[100px]', key: 'amount' },
                { label: 'Customer ID', w: 'w-[340px]' },
              ].map(({ label, w, key }) => (
                <HeaderCell key={label} label={label} w={w} sortKey={key} sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              ))}
            </div>

            {(data?.content ?? []).length === 0 ? (
              <div className="px-4 py-8 text-[14px] text-text-muted text-center">No orders found.</div>
            ) : (
              (data?.content ?? []).map((order, i) => (
                <div
                  key={order.id}
                  className={cn('flex items-center border-t border-[#f0f0f0] hover:bg-primary-50 transition-colors', { 'border-t-0': i === 0 })}
                >
                  <div className="w-[100px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-[13px] text-text-muted truncate">{order.id}</p>
                  </div>
                  <div className="w-[110px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-[14px] font-medium text-primary truncate">{order.order_number}</p>
                  </div>
                  <div className="w-[130px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-[14px] text-text-body truncate">{order.first_name}</p>
                  </div>
                  <div className="w-[140px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-[14px] text-text-body truncate">{order.last_name}</p>
                  </div>
                  <div className="w-[130px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-[14px] text-text-body">
                      {order.requested_date_time
                        ? new Date(order.requested_date_time).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
                        : '—'}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0 px-[10px] py-[10px]">
                    <p className="text-[14px] text-text-body truncate">{order.service_name}</p>
                  </div>
                  <div className="w-[120px] shrink-0 px-[10px] py-[10px]">
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="w-[100px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-[14px] font-semibold text-text-body">
                      {order.amount ? `$${parseFloat(order.amount).toFixed(2)}` : '—'}
                    </p>
                  </div>
                  <div className="w-[340px] shrink-0 px-[10px] py-[10px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <button
                        onClick={() => navigator.clipboard.writeText(order.customer_id)}
                        className="shrink-0 hover:opacity-70 transition-opacity"
                      >
                        <CopyIcon />
                      </button>
                      <p className="text-[13px] text-text-muted font-mono truncate">{order.customer_id}</p>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
              <p className="text-[13px] text-[#6a7282]">
                {appTotalElements > 0
                  ? `Showing ${(parseInt(params.page) * PAGE_SIZE) + 1}–${Math.min((parseInt(params.page) + 1) * PAGE_SIZE, appTotalElements)} of ${appTotalElements.toLocaleString()} orders`
                  : 'No orders'}
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={appPage <= 1}
                  onClick={() => setParams({ page: String(parseInt(params.page) - 1) })}
                  className="size-[26px] border border-border rounded flex items-center justify-center disabled:opacity-40"
                >
                  <ChevronLeftIcon />
                </button>
                {Array.from({ length: Math.min(appTotalPages, 5) }, (_, i) => {
                  const start = Math.max(0, appPage - 3);
                  return start + i + 1;
                }).filter(p => p <= appTotalPages).map((p) => (
                  <button
                    key={p}
                    onClick={() => setParams({ page: String(p - 1) })}
                    className={cn(
                      'size-[26px] text-[13px] rounded flex items-center justify-center',
                      p === appPage ? 'bg-black text-white' : 'border border-border text-[#727272] hover:bg-surface'
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={appPage >= appTotalPages}
                  onClick={() => setParams({ page: String(parseInt(params.page) + 1) })}
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
            <div className="flex bg-[#f9fafb]">
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
                  <p className="text-[13px] font-medium text-[#6a7282] whitespace-nowrap">{label}</p>
                </div>
              ))}
            </div>

            {kioskPaginated.length === 0 ? (
              <div className="px-4 py-8 text-[14px] text-text-muted text-center">No kiosk orders found.</div>
            ) : (
              kioskPaginated.map((order, i) => (
                <div
                  key={order.id}
                  className={cn('flex items-center border-t border-[#f0f0f0] hover:bg-primary-50 transition-colors', { 'border-t-0': i === 0 })}
                >
                  <div className="w-[110px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-[13px] text-text-muted">{order.id}</p>
                  </div>
                  <div className="w-[120px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-[14px] text-text-body">{order.date}</p>
                  </div>
                  <div className="w-[110px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-[14px] font-medium text-primary">{order.order}</p>
                  </div>
                  <div className="w-[120px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-[14px] text-text-body">{order.kioskId}</p>
                  </div>
                  <div className="w-[110px] shrink-0 px-[10px] py-[10px]">
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="w-[130px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-[14px] text-text-muted">{order.as400Room || '—'}</p>
                  </div>
                  <div className="flex-1 min-w-0 px-[10px] py-[10px]">
                    <p className="text-[14px] text-text-muted">{order.licensePlate || '—'}</p>
                  </div>
                  <div className="w-[100px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-[14px] font-semibold text-text-body">${parseFloat(order.amount).toFixed(2)}</p>
                  </div>
                  <div className="w-[110px] shrink-0 px-[10px] py-[10px]">
                    <p className="text-[14px] text-text-body font-mono">{order.cc4digits}</p>
                  </div>
                </div>
              ))
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
              <p className="text-[13px] text-[#6a7282]">
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
                      'size-[26px] text-[13px] rounded flex items-center justify-center',
                      p === kioskPage ? 'bg-black text-white' : 'border border-border text-[#727272] hover:bg-surface'
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
