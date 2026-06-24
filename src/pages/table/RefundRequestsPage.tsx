import { memo, useEffect, useRef, useState } from 'react';
import Table from '@components/table/Table';
import { useQuery } from 'react-query';
import { useTenant } from '@/context/TenantContext';
import Input from '@components/forms/Input';
import { Controller, useForm } from 'react-hook-form';
import { useQueryParams } from '@hooks/useQueryParams';
import { getRefundRequests } from '@services/refund-requests.service';
import { FormatValue } from '@utils/formatter/FormatValue';
import startCase from 'lodash/startCase';
import capitalize from 'lodash/capitalize';
import { cn } from '@utils/CN';

const formatReason = (reason: string) =>
  capitalize(startCase(reason.replace(/_/g, ' ').toLowerCase()));

const formatDateTime = (val: string | Date) => {
  const d = new Date(val);
  return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const STATUS_STYLE: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  COMPLETED: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-400', dot: 'bg-green-500' },
  REFUND_REQUESTED: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-400', dot: 'bg-yellow-500' },
  COMPLETED_WITHOUT_PAYMENT: { bg: 'bg-surface', text: 'text-text-muted', border: 'border-[#bbb]', dot: 'bg-ds-neutral-500' },
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray last:border-0 gap-4">
    <p className="text-ds-body-sm text-text-body shrink-0">{label}</p>
    <p className="text-ds-label font-medium text-text-body truncate max-w-[60%] text-right">{value}</p>
  </div>
);

const StatRow = ({ label, value, warn = false }: { label: string; value: string | number; warn?: boolean }) => (
  <div className={cn('flex items-center justify-between py-2.5 border-b border-gray last:border-0 gap-4', warn && 'bg-orange-50 px-3 -mx-3 rounded')}>
    <p className={cn('text-ds-body-sm', warn ? 'text-orange-700' : 'text-text-body')}>{label}</p>
    <p className={cn('text-ds-label font-semibold', warn ? 'text-orange-700' : 'text-text-body')}>{value}</p>
  </div>
);

const RefundDetailModal = ({ refund, onClose }: { refund: RefundRequest; onClose: () => void }) => {
  const statusStyle = STATUS_STYLE[refund.status] ?? STATUS_STYLE.COMPLETED_WITHOUT_PAYMENT;
  const initials = `${String(refund.firstName)[0] ?? ''}${String(refund.lastName)[0] ?? ''}`.toUpperCase();
  const customerSince = '09/06/2025';

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
            <div className="flex items-center gap-3">
              <p className="text-ds-h4 font-semibold text-text-body">
                Refund Request — {refund.orderId}
              </p>
              <span className={cn('flex items-center gap-1.5 text-ds-body-sm font-medium px-2.5 py-0.5 rounded-full border', statusStyle.bg, statusStyle.text, statusStyle.border)}>
                <span className={cn('size-1.5 rounded-full', statusStyle.dot)} />
                {formatReason(refund.status)}
              </span>
            </div>
            <p className="text-ds-body-sm text-text-muted">
              Parent Order ID: <span className="text-primary font-medium">{refund.parentOrderId}</span>
              {' · '}
              Requested: {formatDateTime(refund.requestedDateTime)}
            </p>
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

          {/* Left column */}
          <div className="flex flex-col gap-4 flex-1 min-w-0">
            {/* Request Details */}
            <div className="border border-border rounded-lg p-4">
              <p className="text-ds-label font-semibold text-text-body mb-1">Request Details</p>
              <DetailRow label="Amount" value={`$${parseFloat(String(refund.amount)).toFixed(2)}`} />
              <DetailRow label="Refund Type" value={formatReason(refund.refundType)} />
              <DetailRow label="Reason" value={formatReason(refund.reason)} />
              {refund.note ? <DetailRow label="Note" value={String(refund.note)} /> : null}
            </div>

            {/* Refund Approval */}
            <div className="border border-border rounded-lg p-4 flex-1">
              <p className="text-ds-label font-semibold text-text-body mb-1">Refund Approval</p>
              {refund.resolution
                ? <DetailRow label="Resolution" value={formatReason(refund.resolution)} />
                : null}
              <DetailRow label="Refunded Amount" value={`$${parseFloat(String(refund.refundedAmount)).toFixed(2)}`} />
              {refund.adminNotice ? <DetailRow label="Admin Notice" value={refund.adminNotice} /> : null}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4 w-[220px] shrink-0">
            {/* Customer card */}
            <div className="border border-border rounded-lg p-4">
              <p className="text-ds-label font-semibold text-text-body mb-3">Customer Summary</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="size-[40px] rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="text-white text-ds-body font-semibold">{initials}</span>
                </div>
                <div>
                  <p className="text-ds-label font-semibold text-text-body">{refund.firstName} {refund.lastName}</p>
                  <p className="text-ds-caption text-text-muted">Since {customerSince}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="border border-border rounded-lg p-4">
              <p className="text-ds-label font-semibold text-text-body mb-1">PayRange Info</p>
              <StatRow label="Total Loads" value={62} />
              <StatRow label="Refund Requests" value={8} />
              <StatRow label="Last 6 months" value={3} warn />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-border rounded-lg text-ds-label font-semibold text-text-body hover:bg-surface transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const columns = [
  { field: 'orderId', header: 'Request ID' },
  { field: 'parentOrderId', header: 'Reference', sortable: true },
  { field: 'firstName', header: 'First Name', sort: true },
  { field: 'lastName', header: 'Last Name', sort: true },
  { field: 'refundType', header: 'Refund Type', formattedValue: (v: string) => capitalize(startCase(v)) },
  {
    field: 'requestedDateTime',
    header: 'Request Date',
    sort: true,
    formattedValue: (value: string) => (
      <FormatValue prop={'DATE_TIME'} value={value}>{value}</FormatValue>
    ),
  },
  { field: 'status', header: 'Status', sort: true, formattedValue: (v: string) => capitalize(startCase(v)) },
  {
    field: 'amount',
    header: 'Amount',
    sort: true,
    formattedValue: (value: string) => (
      <FormatValue prop={'AMOUNT'} value={value}>{value}</FormatValue>
    ),
  },
];

const defaultFilters = { filter: '', page: '0', pageSize: '15' };

const RefundRequestsPage = () => {
  const { tenantData } = useTenant();
  const { reset, control } = useForm({ defaultValues: defaultFilters, mode: 'onTouched' });
  const [params, setParams] = useQueryParams(defaultFilters);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);

  const { data, refetch } = useQuery({
    initialData: { content: [], page: { number: 0, size: 0, totalElements: 0, totalPages: 0 } },
    queryKey: 'refund-requests',
    queryFn: async () => await getRefundRequests(tenantData?.activeTenant, params),
  });

  useEffect(() => { (async () => await refetch())(); }, [refetch, params]);
  useEffect(() => { reset(params); }, [reset, params]);

  return (
    <div className="flex flex-col p-4">
      <div>
        <h2 className="flex grow text-xl font-bold">Refund Requests</h2>
      </div>
      <div className="flex justify-between p-2">
        <div className="grow-0">
          <Controller
            name="filter"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Search..."
                onChange={(e) => {
                  field.onChange(e);
                  setParams({ [field.name]: e.target.value, page: '0' });
                }}
              />
            )}
          />
        </div>
      </div>
      <Table
        tableClassName="min-w-full"
        columns={columns}
        data={data}
        filters={params}
        onChangeFilters={setParams}
        onClickRow={(_e, row) => setSelectedRefund(row as RefundRequest)}
      />

      {selectedRefund && (
        <RefundDetailModal
          refund={selectedRefund}
          onClose={() => setSelectedRefund(null)}
        />
      )}
    </div>
  );
};

export default memo(RefundRequestsPage);
