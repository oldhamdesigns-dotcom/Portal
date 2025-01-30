import routes from '@/navigation/routes.json';
import DashboardIcon from '@icons/navigation/DashboardIcon';
import MobileUsersIcon from '@icons/navigation/MobileUsersIcon';
import UsersIcon from '@icons/navigation/UsersIcon';
import ServicesIcon from '@icons/navigation/ServiceIcon';
import OffersIcon from '@icons/navigation/OffersIcon';
import StorefrontIcon from '@icons/navigation/StorefrontIcon';
import OrdersIcon from '@icons/navigation/OrdersIcon';
import PostsIcon from '@icons/navigation/PostsIcon';
import MarketingIcon from '@icons/navigation/MarketingIcon';
import AdvertisementIcon from '@icons/navigation/AdvertisementIcon';
import TemplateAccessRoleIcon from '@icons/navigation/TemplateAccessRoleIcon';
import TenantsIcon from '@icons/navigation/TenantsIcon';
import EventsIcon from '@icons/navigation/EventsIcon';
import ReportsIcon from '@icons/navigation/ReportsIcon';
import NodeTypesIcon from '@icons/navigation/NodeTypesIcon';
import { useTenant } from '@/context/TenantContext';
import UsersPage from '@pages/table/UsersPage';
import MobileUsersPage from '@pages/table/MobileUsersPage';
import OrdersPage from '@pages/table/OrdersPage';
import NodeTypesPage from '@pages/table/NodeTypesPage';
import { useQuery } from 'react-query';
import { getNodeMenu } from '@services/node-types.service';
import { nodeTypesToRoute } from '@utils/NodeTypeUtils';
import RefundRequestsPage from '@pages/table/RefundRequestsPage';
import TemplateAccessRolesPage from '@pages/table/TemplateAccessRolesPage';
import TenantsPage from '@pages/table/TenantsPage';
import StorefrontPage from '@pages/table/StorefrontPage';
import PostsPage from '@pages/table/PostsPage';
import EventsPage from '@pages/table/EventsPage';
import ReportsPage from '@pages/table/ReportsPage';
import { NavigationRoute } from '@/types/navigation-route';

const NavigationRoutes: NavigationRoute[] = [
  { path: routes.MAIN_DASHBOARD, title: 'Dashboard', labels: [], Icon: DashboardIcon },
  {
    path: routes.USERS,
    title: 'Users',
    labels: ['VIEW_ROLE'],
    Icon: UsersIcon,
    Component: UsersPage,
    breadcrumbs: [
      { path: routes.MAIN_DASHBOARD, title: 'Home' },
      { path: routes.USERS, title: 'Users' },
    ],
  },
  {
    path: routes.MOBILE_USERS,
    title: 'Mobile users',
    labels: ['VIEW_RESOURCE'],
    Icon: MobileUsersIcon,
    Component: MobileUsersPage,
    breadcrumbs: [
      { path: routes.MAIN_DASHBOARD, title: 'Home' },
      { path: routes.MOBILE_USERS, title: 'Mobile Users' },
    ],
  },
  {
    path: routes.SERVICES,
    title: 'Services',
    labels: ['VIEW_SERVICE', 'MANAGE_SERVICE'],
    Icon: ServicesIcon,
  },
  { path: routes.OFFERS, title: 'Offers', labels: ['VIEW_OFFER'], Icon: OffersIcon },
  {
    path: routes.STOREFRONTS,
    title: 'Storefront',
    labels: ['VIEW_STOREFRONT'],
    Icon: StorefrontIcon,
    Component: StorefrontPage,
    breadcrumbs: [
      { path: routes.MAIN_DASHBOARD, title: 'Home' },
      { path: routes.STOREFRONTS, title: 'StoreFront' },
    ],
  },
  {
    path: routes.ORDERS,
    title: 'Orders',
    labels: ['VIEW_ORDER', 'MANAGE_ORDER'],
    Icon: OrdersIcon,
    Component: OrdersPage,
    breadcrumbs: [
      { path: routes.MAIN_DASHBOARD, title: 'Home' },
      { path: routes.ORDERS, title: 'Orders' },
    ],
  },
  {
    path: routes.POSTS,
    title: 'Posts',
    labels: ['VIEW_POST', 'MANAGE_POST'],
    Icon: PostsIcon,
    Component: PostsPage,
    breadcrumbs: [
      { path: routes.MAIN_DASHBOARD, title: 'Home' },
      { path: routes.POSTS, title: 'Posts' },
    ],
  },
  {
    path: routes.MARKETING,
    title: 'Marketing',
    labels: ['VIEW_CAROUSEL', 'MANAGE_CAROUSEL'],
    Icon: MarketingIcon,
  },
  {
    path: routes.ADVERTISEMENT,
    title: 'Advertisement',
    labels: ['VIEW_CAROUSEL', 'MANAGE_CAROUSEL'],
    Icon: AdvertisementIcon,
  },
  {
    path: routes.TEMPLATE_ACCESS_ROLE,
    title: 'Template Access Role',
    labels: ['SUPER_ADMIN'],
    Icon: TemplateAccessRoleIcon,
    Component: TemplateAccessRolesPage,
    breadcrumbs: [
      { path: routes.MAIN_DASHBOARD, title: 'Home' },
      { path: routes.TEMPLATE_ACCESS_ROLE, title: 'Template access role' },
    ],
  },
  {
    path: routes.TENANTS,
    title: 'Tenants',
    labels: ['MANAGE_TENANT'],
    Icon: TenantsIcon,
    Component: TenantsPage,
    breadcrumbs: [
      { path: routes.MAIN_DASHBOARD, title: 'Home' },
      { path: routes.TENANTS, title: 'Tenants' },
    ],
  },
  {
    path: routes.REFUNDS,
    title: 'Refunds',
    labels: ['GET_REFUND_REQUEST'],
    Icon: OffersIcon,
    Component: RefundRequestsPage,
    breadcrumbs: [
      { path: routes.MAIN_DASHBOARD, title: 'Home' },
      { path: routes.REFUNDS, title: 'Refunds' },
    ],
  },
  {
    path: routes.EVENTS,
    title: 'Events',
    labels: ['VIEW_POST', 'MANAGE_POST'],
    Icon: EventsIcon,
    Component: EventsPage,
    breadcrumbs: [
      { path: routes.MAIN_DASHBOARD, title: 'Home' },
      { path: routes.EVENTS, title: 'Events' },
    ],
  },
  {
    path: routes.REPORTS,
    title: 'Reports',
    labels: ['MANAGE_REPORT'],
    Icon: ReportsIcon,
    Component: ReportsPage,
    breadcrumbs: [
      { path: routes.MAIN_DASHBOARD, title: 'Home' },
      { path: routes.TENANTS, title: 'Reports' },
    ],
  },
  {
    path: routes.NODE_TYPES,
    title: 'Node types',
    labels: ['VIEW_NODE_TYPE', 'MANAGE_NODE_TYPE'],
    Icon: NodeTypesIcon,
    Component: NodeTypesPage,
    breadcrumbs: [
      { path: routes.MAIN_DASHBOARD, title: 'Home' },
      { path: routes.NODE_TYPES, title: 'Node types' },
    ],
  },
];

const useNavigationRoutes = (): NavigationRoute[] => {
  const {
    tenantData: {
      activeTenantPermission: { permissionList = [], isSuperAdmin = false } = {
        permissionList: [],
      },
    } = {
      activeTenantPermission: { permissionList: [] },
    },
  } = useTenant() ?? {
    tenantData: { activeTenantPermission: { permissionList: [] } },
  };

  const { data } = useQuery({
    initialData: [],
    queryKey: 'node-types-menu',
    queryFn: async () => nodeTypesToRoute(await getNodeMenu()),
  });

  return [
    ...NavigationRoutes.filter(
      (nr) => !nr.labels.length || permissionList.some((item) => nr.labels.includes(item))
    ),
    ...(isSuperAdmin ? (data ?? []) : []),
  ];
};

export { useNavigationRoutes };
