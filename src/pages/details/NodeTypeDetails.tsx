import { memo } from 'react';
import { useParams } from 'react-router';
import { useQuery } from 'react-query';
import { getOneNodeType } from '@services/node-types.service';
import { useBreadcrumbs } from '@layout/BreadcrumbsLayout';
import routes from '@/navigation/routes.json';

const NodeTypeDetails = () => {
  const { id } = useParams();
  const { setBreadcrumbs } = useBreadcrumbs();

  const { data: node } = useQuery({
    initialData: undefined,
    queryKey: ['nodeType', id],
    queryFn: async () => {
      const data = await getOneNodeType(id ? +id : undefined);
      setBreadcrumbs([{ path: `${routes.NODE_TYPES}/${id}`, title: data?.name ?? '' }]);
      return data;
    },
  });
  console.log(node);

  return <></>;
};

export default memo(NodeTypeDetails);
