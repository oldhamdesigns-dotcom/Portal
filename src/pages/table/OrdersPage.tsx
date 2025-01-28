import { memo, useEffect } from 'react';
import Table from '@components/table/Table';
import { useQuery } from 'react-query';
import { useTenant } from '@/context/TenantContext';
import Input from '@components/forms/Input';
import { Controller, useForm } from 'react-hook-form';
import { useQueryParams } from '@hooks/useQueryParams';
import { getOrders } from '@services/orders.service';
import { CopyFormatter, FormatValue } from '@utils/formatter/FormatValue';
import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';

const columns = [
  {
    field: 'id',
    header: '#',
    sort: true,
  },
  {
    field: 'order_number',
    header: 'Order',
  },
  { field: 'first_name', header: 'First Name', sort: true },
  { field: 'last_name', header: 'Last Name', sort: true },
  {
    field: 'requested_date_time',
    header: 'Date',
    sort: true,
    formattedValue: (value: string) => (
      <FormatValue
        prop={'DATE'}
        value={value}
      >
        {value}
      </FormatValue>
    ),
  },
  { field: 'service_name', header: 'Service', sort: true },
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
  {
    field: 'customer_id',
    header: 'Customer Id',
    formattedValue: (value: string) => (
      <CopyFormatter
        textToCopy={value}
        className={'justify-end'}
      >
        {value}
      </CopyFormatter>
    ),
  },
];

const defaultFilters = {
  searchTerm: '',
  page: '0',
  pageSize: '15',
  sortProperty: 'requested_date_time',
  order: 'DESC',
};

const OrdersPage = () => {
  const { tenantData } = useTenant();
  const [params, setParams] = useQueryParams(defaultFilters);
  const { reset, control } = useForm({ defaultValues: defaultFilters, mode: 'onTouched' });

  const { data, refetch } = useQuery({
    initialData: { content: [], page: { number: 0, size: 0, totalElements: 0, totalPages: 0 } },
    queryKey: 'orders',
    queryFn: async () => await getOrders(tenantData?.activeTenant, params),
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
        <h2 className={'flex grow text-xl font-bold'}>{'Orders'}</h2>
      </div>
      <div className={'flex justify-between p-2'}>
        <div className={'grow-0'}>
          <Controller
            name={'searchTerm'}
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

export default memo(OrdersPage);
