export const handleURLSearchParams = (params: Record<string, string | number>) => {
  const filters: Record<string, string> = {};

  Object.keys(params).forEach((key: string) => {
    let value = params[key];
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'number') {
        value = `${value}`;
      }
      filters[key] = value;
    }
  });

  return new URLSearchParams(filters);
};
