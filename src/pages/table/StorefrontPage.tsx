import { memo, useEffect } from 'react';
import Table from '@components/table/Table';
import { useQuery } from 'react-query';
import { useTenant } from '@/context/TenantContext';
import Input from '@components/forms/Input';
import { Controller, useForm } from 'react-hook-form';
import { useQueryParams } from '@hooks/useQueryParams';
import { getStorefronts } from '@services/storefront.service';

const columns = [
  {
    field: 'rowIdx',
    header: '#',
    formattedValue: (cell: any, row?: any, idx?: number) => <p>{(idx ?? 0) + 1}</p>,
  },
  {
    field: 'storefrontFiles',
    header: 'Logo',
    formattedValue: (cell: StorefrontImage[]) => {
      const logo = cell?.find((c) => c?.imageType === 'LOGO');
      if (!logo) {
        return <></>;
      }
      return (
        <div className={'flex justify-center'}>
          <img
            src={logo?.fileDTO?.filePath}
            className={'size-[25px]'}
            alt={logo.fileDTO.fileName}
          />
        </div>
      );
    },
  },
  { field: 'name', header: 'Name', sort: true, valueClassName: 'text-nowrap' },
  {
    field: 'description',
    header: 'Description',
    headerClassName: 'w-1/2',
    valueClassName: 'line-clamp-3',
  },
];

const defaultFilters = { term: '', page: '0', pageSize: '15' };

const StorefrontPage = () => {
  const { tenantData } = useTenant();
  const { reset, control } = useForm({ defaultValues: defaultFilters, mode: 'onTouched' });

  const [params, setParams] = useQueryParams(defaultFilters);

  const { data, refetch } = useQuery({
    initialData: { content: [], page: { number: 0, size: 0, totalElements: 0, totalPages: 0 } },
    queryKey: 'storefronts',
    queryFn: async () => await getStorefronts(tenantData?.activeTenant, params),
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
        <h2 className={'flex grow text-xl font-bold'}>{'Storefront'}</h2>
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

export default memo(StorefrontPage);
