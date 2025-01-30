import { useSearchParams } from 'react-router';
import { useMemo } from 'react';
import debounce from 'lodash.debounce';

export const useQueryParams = (
  defaultValues = {}
): [filters: Record<string, string>, (filters: Record<string, string>) => void] => {
  const [params, setParams] = useSearchParams(defaultValues);

  const filterParams: Record<string, string> = useMemo((): Record<string, string> => {
    return Object.fromEntries(params.entries());
  }, [params]);

  const setSearchParams: (filters: Record<string, string>) => void = debounce(
    (filters: Record<string, string>) => setParams({ ...filterParams, ...filters }),
    800
  );

  return [filterParams, setSearchParams];
};
