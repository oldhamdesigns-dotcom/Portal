import { handleURLSearchParams } from '@services/search.params.service';
import ApiInstance from '@services/api.instance';

const getTemplateAccessRoles = async (
  { page = 0, pageSize: count = 15, ...filter }: any | undefined = {
    page: 0,
    pageSize: 15,
  }
): Promise<{
  content: TemplateAccessRole[];
  page: Page;
}> => {
  const params = handleURLSearchParams({ page, count, ...filter });
  return (
    await ApiInstance.get(`/user/template-access-role`, {
      params,
    })
  )?.data;
};

export { getTemplateAccessRoles };
