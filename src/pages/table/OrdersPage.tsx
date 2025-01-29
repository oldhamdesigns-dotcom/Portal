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
import Dropdown from '@components/forms/Dropdown';
import { OrderStatusOptions } from '@/conststants/OrderStatusOptions';

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
  customerId: '',
  serviceName: '',
  status: '',
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
        <div className={'basis-1/5'}>
          <Controller
            name={'searchTerm'}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={'Search by order, first name or last  name'}
                onChange={(e) => {
                  field.onChange(e);
                  setParams({ [field.name]: e.target.value, page: '0' });
                }}
              />
            )}
          />
        </div>
        <div className={'basis-1/5'}>
          <Controller
            name={'serviceName'}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={'Service'}
                onChange={(e) => {
                  field.onChange(e);
                  setParams({ [field.name]: e.target.value, page: '0' });
                }}
              />
            )}
          />
        </div>
        <div className={'flex w-full basis-1/5'}>
          <Controller
            name={'status'}
            control={control}
            render={({ field }) => (
              <Dropdown
                options={OrderStatusOptions}
                placeholder={'Status'}
                selectedOption={field?.value}
                getOptionLabel={(v) => v?.label}
                getOptionValue={(v) => v?.value}
                compareWith={(o) => o.value === field?.value}
                buttonClassName={'bg-white text-black border border-gray p-2 rounded-lg w-full'}
                optionClassName={'bg-white text-black w-full justify-start px-2'}
                selectedOptionClassName={'bg-black text-white'}
                optionContainerClassName={'bg-white h-[200px] overflow-y-auto mt-0'}
                onChange={(e) => {
                  if (field?.value === e.target.value) {
                    field.onChange({ ...e, target: { ...e.target, value: undefined } });
                    setParams({ [field.name]: '', page: '0' });
                  } else {
                    field.onChange(e);
                    setParams({ [field.name]: e.target.value ?? '', page: '0' });
                  }
                }}
              />
            )}
          />
        </div>
        <div className={'basis-1/5'}>
          <Controller
            name={'customerId'}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={'Customer ID'}
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
