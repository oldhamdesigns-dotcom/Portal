import { memo, useEffect } from 'react';
import Table from '@components/table/Table';
import { useQuery } from 'react-query';
import { useTenant } from '@/context/TenantContext';
import Input from '@components/forms/Input';
import { Controller, useForm } from 'react-hook-form';
import { getMobileUsers } from '@services/mobile-users.service';
import { CopyFormatter, FormatValue } from '@utils/formatter/FormatValue';
import { useQueryParams } from '@hooks/useQueryParams';

const columns = [
  { field: 'firstName', header: 'First Name', sort: true, headerClassName: 'w-1/8', sortByColumn: 'first_name' },
  { field: 'lastName', header: 'Last Name', sort: true, headerClassName: 'w-1/8', sortByColumn: 'last_name' },
  { field: 'status', header: 'Status', sort: true },
  { field: 'emails', header: 'Email' },
  { field: 'phones', header: 'Phone' },
  {
    field: 'createdAt',
    header: 'User Since',
    sort: true,
    formattedValue: (value: string) => <FormatValue prop={'DATE'} value={value}>{value}</FormatValue>,
  },
  {
    field: 'id',
    header: 'User ID',
    formattedValue: (value: string) => <CopyFormatter textToCopy={value}
                                                      className={'justify-end'}>{value}</CopyFormatter>,
  },
];

const defaultFilters = { term: '', page: '0', pageSize: '15' };

const MobileUsersPage = () => {
  const { tenantData } = useTenant();
  const { reset, control } = useForm({ defaultValues: defaultFilters, mode: 'onTouched' });

  const [params, setParams] = useQueryParams(defaultFilters);

  const { data, refetch } = useQuery({
    initialData: { content: [], page: { number: 0, size: 0, totalElements: 0, totalPages: 0 } },
    queryKey: 'mobile-users',
    queryFn: async () => await getMobileUsers(tenantData?.activeTenant, params),
  });

  useEffect(() => {
    (async () => await refetch())();
  }, [refetch, params]);

  useEffect(() => {
    reset(params);
  }, [reset, params]);

  return <div className={'flex flex-col p-4'}>
    <div>
      <h2 className={'flex grow font-bold text-xl'}>{'User Management'}</h2>
    </div>
    <div className={'flex justify-between p-2'}>
      <div className={'grow-0'}>
        <Controller name={'term'}
                    control={control}
                    render={({ field }) =>
                      <Input {...field}
                             placeholder={'Search...'}
                             onChange={(e) => {
                               field.onChange(e);
                               setParams({ [field.name]: e.target.value, page: '0' });
                             }}
                      />}
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
  </div>;
};

export default memo(MobileUsersPage);