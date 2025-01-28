import { memo, useEffect } from 'react';
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

const columns = [
  {
    field: 'orderId',
    header: 'Request ID',
  },
  {
    field: 'parentOrderId',
    header: 'Reference',
    sortable: true,
  },
  { field: 'firstName', header: 'First Name', sort: true },
  { field: 'lastName', header: 'Last Name', sort: true },
  {
    field: 'refundType',
    header: 'Refund type',
    formattedValue: (value: string) => capitalize(startCase(value)),
  },
  {
    field: 'requestedDateTime',
    header: 'Request Date',
    sort: true,
    formattedValue: (value: string) => (
      <FormatValue
        prop={'DATE_TIME'}
        value={value}
      >
        {value}
      </FormatValue>
    ),
  },
  {
    field: 'status',
    header: 'Status',
    sort: true,
    formattedValue: (value: string) => capitalize(startCase(value)),
  },
  {
    field: 'amount',
    header: 'Amount',
    sort: true,
    formattedValue: (value: string) => (
      <FormatValue
        prop={'AMOUNT'}
        value={value}
      >
        {value}
      </FormatValue>
    ),
  },
];

const defaultFilters = { filter: '', page: '0', pageSize: '15' };

const RefundRequestsPage = () => {
  const { tenantData } = useTenant();
  const { reset, control } = useForm({ defaultValues: defaultFilters, mode: 'onTouched' });

  const [params, setParams] = useQueryParams(defaultFilters);

  const { data, refetch } = useQuery({
    initialData: { content: [], page: { number: 0, size: 0, totalElements: 0, totalPages: 0 } },
    queryKey: 'refund-requests',
    queryFn: async () => await getRefundRequests(tenantData?.activeTenant, params),
  });

  useEffect(() => {
    (async () => await refetch())();
  }, [refetch, params]);

  useEffect(() => {
    reset(params);
  }, [reset, params]);

  return (
    <div className={'flex flex-col p-4'}>
      <div>
        <h2 className={'flex grow text-xl font-bold'}>{'Refund requests'}</h2>
      </div>
      <div className={'flex justify-between p-2'}>
        <div className={'grow-0'}>
          <Controller
            name={'filter'}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={'Search...'}
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
        tableClassName={'min-w-full'}
        columns={columns}
        data={data}
        filters={params}
        onChangeFilters={setParams}
      />
    </div>
  );
};

export default memo(RefundRequestsPage);
