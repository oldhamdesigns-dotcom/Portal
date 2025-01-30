import { handleURLSearchParams } from '@services/search.params.service';
import ApiInstance from '@services/api.instance';

const PROPERTY_PARENT_ID = 1;

const getNodeTypes = async (
  { page = 0, pageSize: count = 15, ...filter }: any | undefined = {
    page: 0,
    pageSize: 15,
  }
): Promise<{
  content: NodeType[];
  page: Page;
}> => {
  const params = handleURLSearchParams({ page, count, ...filter });
  return (await ApiInstance.get(`/node/api/nodeType`, { params }))?.data;
};

const getOneNodeType = async (id?: number): Promise<NodeType | undefined> => {
  if (!id) {
    return undefined;
  }
  return (await ApiInstance.get(`/node/api/nodeType/${id}`))?.data;
};

const getNodeMenu = async (): Promise<NodeTypeMenu[]> => {
  return (await ApiInstance.get(`/node/api/nodeType/menu/${PROPERTY_PARENT_ID}`))?.data;
};

const getNodeTypeById = async (
  tenant?: Partial<Tenant>,
  nodeId?: number,
  { sortProperty: sortBy, order, page, pageSize: count, ...filter }: Record<string, string> = {}
): Promise<{
  content: Node[];
  page: Page;
}> => {
  if (!tenant) {
    return { content: [], page: { number: 0, totalPages: 0, size: 0, totalElements: 0 } };
  }

  const params = handleURLSearchParams({ sortBy, order, page, count, ...filter });
  return (await ApiInstance.get(`/node/api/node/nodeTypeId/${nodeId}/${tenant?.uuid}?${params}`))
    ?.data;
};

export { getNodeTypes, getOneNodeType, getNodeMenu, getNodeTypeById };
