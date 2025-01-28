import { memo, useEffect } from 'react';
import Table from '@components/table/Table';
import { useQuery } from 'react-query';
import Input from '@components/forms/Input';
import { Controller, useForm } from 'react-hook-form';
import { useQueryParams } from '@hooks/useQueryParams';
import { getTemplateAccessRoles } from '@services/template-access-roles.service';
import capitalize from 'lodash/capitalize';
import startCase from 'lodash/startCase';

const columns = [
  { field: 'id', header: 'Id' },
  { field: 'name', header: 'Permission name', sort: true },
  {
    field: 'tenantType',
    header: 'Tenant type',
    formattedValue: (value: string) => capitalize(startCase(value)),
  },
  {
    field: 'accessPermissionDTOS',
    header: 'Assigned permissions',
    formattedValue: (cell: []) => cell.length,
  },
];

const defaultFilters = { name: '', page: '0', pageSize: '15' };

const TemplateAccessRolesPage = () => {
  const { reset, control } = useForm({ defaultValues: defaultFilters, mode: 'onTouched' });

  const [params, setParams] = useQueryParams(defaultFilters);

  const { data, refetch } = useQuery({
    initialData: { content: [], page: { number: 0, size: 0, totalElements: 0, totalPages: 0 } },
    queryKey: 'access-template-roles',
    queryFn: async () => await getTemplateAccessRoles(params),
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
        <h2 className={'flex grow text-xl font-bold'}>{'Template access roles'}</h2>
      </div>
      <div className={'flex justify-between p-2'}>
        <div className={'grow-0'}>
          <Controller
            name={'name'}
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

export default memo(TemplateAccessRolesPage);
