import routes from '@/navigation/routes.json';
import { NavigationRoute } from '@/types/navigation-route';
import NodeTypeDetails from '@pages/details/NodeTypeDetails';

const useNonNavigationRoutes = (): NavigationRoute[] => {
  return [
    {
      path: routes.NODE_TYPE_DETAILS,
      labels: ['MANAGE_NODE'],
      Component: NodeTypeDetails,
      breadcrumbs: [
        { path: routes.MAIN_DASHBOARD, title: 'Home' },
        { path: routes.NODE_TYPES, title: 'Node types' },
      ],
    },
  ];
};

export default useNonNavigationRoutes;
