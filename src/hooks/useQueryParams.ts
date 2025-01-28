import { useSearchParams } from 'react-router';
import { useMemo } from 'react';
import debounce from 'lodash.debounce';

export const useQueryParams = (
  defaultValues = {}
): [filters: { [key: string]: string }, (filters: { [key: string]: string }) => void] => {
  const [params, setParams] = useSearchParams(defaultValues);

  const filterParams: { [key: string]: string } = useMemo((): { [key: string]: string } => {
    return Object.fromEntries(params.entries());
  }, [params]);

  const setSearchParams: (filters: { [key: string]: string }) => void = debounce(
    (filters: { [key: string]: string }) => setParams({ ...filterParams, ...filters }),
    800
  );

  return [filterParams, setSearchParams];
};
