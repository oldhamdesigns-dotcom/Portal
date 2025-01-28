export const handleURLSearchParams = (params: { [key: string]: string | number }) => {
  const filters: { [key: string]: string } = {};

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
