import { memo, useEffect } from 'react';
import Table from '@components/table/Table';
import { useQuery } from 'react-query';
import { useTenant } from '@/context/TenantContext';
import Input from '@components/forms/Input';
import { Controller, useForm } from 'react-hook-form';
import { useQueryParams } from '@hooks/useQueryParams';
import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';
import { getEvents } from '@services/events.service';
import { FormatValue } from '@utils/formatter/FormatValue';

const columns = [
  {
    field: 'id',
    header: 'Id',
    sort: true,
  },
  {
    field: 'name',
    header: 'Name',
    sort: true,
  },
  {
    field: 'eventDate',
    header: 'Date and time',
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
    field: 'eventType',
    header: 'Event type',
    formattedValue: (value: string) => capitalize(startCase(value)),
  },
  {
    field: 'address',
    header: 'Address',
  },
  {
    field: 'postTitle',
    header: 'Post title',
  },
  {
    field: 'postStatus',
    header: 'Post status',
    formattedValue: (value: string) => capitalize(startCase(value)),
  },
  {
    field: 'storefronts',
    header: 'Storefronts',
    formattedValue: (cell: any[]) => {
      const storefronts = Array.isArray(cell) && cell.find((el) => !!el.name)?.name;
      return <>{storefronts ?? "Storefront for this event doesn't exists anymore"}</>;
    },
  },
];

const defaultFilters = { term: '', page: '0', pageSize: '15' };

const EventsPage = () => {
  const { tenantData } = useTenant();
  const { reset, control } = useForm({ defaultValues: defaultFilters, mode: 'onTouched' });

  const [params, setParams] = useQueryParams(defaultFilters);

  const { data, refetch } = useQuery({
    initialData: { content: [], page: { number: 0, size: 0, totalElements: 0, totalPages: 0 } },
    queryKey: 'events',
    queryFn: async () => await getEvents(tenantData?.activeTenant, params),
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
        <h2 className={'flex grow text-xl font-bold'}>{'Events'}</h2>
      </div>
      <div className={'flex justify-between p-2'}>
        <div className={'grow-0'}>
          <Controller
            name={'term'}
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

export default memo(EventsPage);
