import { memo, useCallback, useMemo } from 'react';
import SortIcon from '@icons/table/SortIcon';
import { cn } from '@utils/CN';
import Pagination from '@components/table/Pagination';
import CaretArrowIcon from '@icons/arrows/CaretArrowIcon';
import get from 'lodash/get';
import VoidFn from '@utils/fn-utils';

type Column = {
  field: string;
  header: string;
  headerClassName?: any;
  formattedValue?: (columnValue: any, row?: any, idx?: number) => any;
  sort?: boolean;
  sortByColumn?: string;
  valueClassName?: string;
  onClick?: (e?: any) => void;
};
type Data = { content: any[]; page: Page } | undefined;

const TableHeader = ({
  sort = false,
  onClick,
  ...props
}: {
  sort?: boolean;
  onClick?: (e?: any) => void;
} & Record<string, any>) => {
  return sort ? (
    <button
      onClick={onClick}
      {...props}
    />
  ) : (
    <div {...props} />
  );
};

const Table = ({
  columns,
  hidePagination = false,
  data,
  filters,
  onChangeFilters = (value: Record<string, string>) => VoidFn(value),
  tableClassName,
  onClickRow = (e: any, row: any) => VoidFn('onClickRow', e, row),
}: {
  columns: Column[];
  hidePagination?: boolean;
  data: Data;
  tableClassName?: any;
  filters?: Record<string, string | number>;
  onChangeFilters: (value: Record<string, string>) => void;
  onClickRow?: (e: any, row: any) => void;
}) => {
  const sort = useMemo(() => {
    return {
      sortProperty: filters?.sortProperty ?? '',
      order: filters?.order ?? '',
    };
  }, [filters?.sortProperty, filters?.order]);

  const onChangeSort = useCallback(
    (sortProperty = '') => {
      if (!sortProperty) {
        return;
      }
      let orderValue = 'ASC';
      if (sortProperty === sort.sortProperty) {
        if (sort?.order === '') {
          orderValue = 'ASC';
        } else if (sort?.order === 'ASC') {
          orderValue = 'DESC';
        } else if (sort?.order === 'DESC') {
          orderValue = 'ASC';
        }
      }
      onChangeFilters({
        sortProperty,
        order: orderValue,
      });
    },
    [onChangeFilters, sort?.sortProperty, sort?.order]
  );
  return (
    <div className={'w-full overflow-x-auto'}>
      <table className={cn('border border-gray-1', tableClassName)}>
        <thead>
          <tr className={'border border-gray-2'}>
            {columns.map((column, idx) => (
              <th
                className={cn('border border-gray-2 p-2', column.headerClassName)}
                key={'header-' + idx}
              >
                <TableHeader
                  sort={column?.sort}
                  onClick={() => onChangeSort(column.sortByColumn ?? column.field)}
                  className={cn('flex w-full justify-center', {
                    'justify-between': column?.sort,
                  })}
                >
                  <p
                    className={cn('font-medium text-gray-1', {
                      'font-bold text-black':
                        sort.sortProperty === (column.sortByColumn ?? column.field),
                    })}
                  >
                    {column.header}
                  </p>
                  {column?.sort ? (
                    <>
                      {sort.sortProperty === (column.sortByColumn ?? column.field) ? (
                        <CaretArrowIcon rotate={sort.order === 'ASC' ? 0 : 180} />
                      ) : (
                        <SortIcon />
                      )}
                    </>
                  ) : null}
                </TableHeader>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={''}>
          {data?.content.map((row, idxR) => (
            <tr
              key={'row-' + idxR}
              className={'cursor-pointer border border-gray-2'}
              onClick={(e) => onClickRow(e, row)}
            >
              {columns.map((column, idx) => (
                <td
                  key={'column-' + idx}
                  className={'border border-gray-2 px-2.5 py-2'}
                  onClick={
                    column.onClick
                      ? (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (column.onClick) {
                            column.onClick(e);
                          }
                        }
                      : undefined
                  }
                >
                  {column?.formattedValue ? (
                    column.formattedValue(get(row, column.field, ''), row, idxR)
                  ) : (
                    <p className={cn('text-left text-sm', column?.valueClassName)}>
                      {get(row, column.field, '')}
                    </p>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!hidePagination ? (
        <Pagination
          page={filters?.page}
          onChangePage={(v: number) => onChangeFilters({ page: `${v}` })}
          pageData={data?.page}
          pageSize={filters?.pageSize}
          onChangePageSize={(v) => onChangeFilters({ pageSize: `${v}` })}
        />
      ) : null}
    </div>
  );
};

export default memo(Table);
