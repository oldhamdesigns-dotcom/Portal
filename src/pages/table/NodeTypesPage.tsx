import { memo, useEffect } from 'react';
import Table from '@components/table/Table';
import { useQuery } from 'react-query';
import Input from '@components/forms/Input';
import { Controller, useForm } from 'react-hook-form';
import { useQueryParams } from '@hooks/useQueryParams';
import { getNodeTypes } from '@services/node-types.service';

const columns = [
  {
    field: 'id',
    header: 'Id',
  },
  {
    field: 'name',
    header: 'Node type name',
    sort: true,
  },
  {
    field: 'description',
    header: 'Description',
    sort: true,
  },
];

const defaultFilters = {
  name: '',
  page: '0',
  pageSize: '15',
};

const NodeTypesPage = () => {
  const [params, setParams] = useQueryParams(defaultFilters);
  const { reset, control } = useForm({ defaultValues: defaultFilters, mode: 'onTouched' });

  const { data, refetch } = useQuery({
    initialData: { content: [], page: { number: 0, size: 0, totalElements: 0, totalPages: 0 } },
    queryKey: 'node-types',
    queryFn: async () => await getNodeTypes(params),
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
        <h2 className={'flex grow text-xl font-bold'}>{'User Management'}</h2>
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

export default memo(NodeTypesPage);
