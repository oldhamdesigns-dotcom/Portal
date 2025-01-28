import { memo, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { getNodeTypeById } from '@services/node-types.service';
import { useTenant } from '@/context/TenantContext';
import Table from '@components/table/Table';
import startCase from 'lodash/startCase';
import last from 'lodash/last';
import { useQueryParams } from '@hooks/useQueryParams';
import { Controller, useForm } from 'react-hook-form';
import Input from '@components/forms/Input';

const defaultFilters = { page: '0', pageSize: '15', name: '' };

const NodeTypeListPage = ({ item = {} }: { item: Partial<NodeTypeMenu> }) => {
  const { tenantData } = useTenant();

  const [params, setParams] = useQueryParams(defaultFilters);
  const { reset, control } = useForm({ defaultValues: defaultFilters, mode: 'onTouched' });

  // const yardiActionsShowList = ['property', 'resident', 'unit', 'charge'];

  const { data, refetch } = useQuery({
    initialData: { content: [], page: { number: 0, size: 0, totalElements: 0, totalPages: 0 } },
    queryKey: 'mobile-users',
    queryFn: async () => await getNodeTypeById(tenantData?.activeTenant, item.nodeTypeId, params),
  });

  useEffect(() => {
    (async () => await refetch())();
  }, [refetch, params]);

  useEffect(() => {
    reset(params);
  }, [reset, params]);

  const columns = useMemo(() => {
    return [
      { field: 'id', header: 'Id', sort: true },
      {
        field: 'name',
        header: 'Name',
        sort: true,
      },
      ...(item?.columns?.map((column) => ({
        field: `payload.${column}`,
        header: startCase(last(column.split('.'))),
      })) ?? []),
    ];
  }, [item?.columns]);

  return (
    <>
      <div className={'flex justify-between p-2'}>
        <h1 className={'text-2xl font-bold'}>{item?.title}</h1>
        <div>
          <div className={'grow-0'}>
            <Controller
              name={'name'}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder={'Search by name...'}
                  onChange={(e) => {
                    field.onChange(e);
                    setParams({ [field.name]: e.target.value, page: '0' });
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
      <Table
        tableClassName={'min-w-full'}
        columns={columns}
        data={data}
        filters={params}
        onChangeFilters={setParams}
      />
    </>
  );
};

export default memo(NodeTypeListPage);
