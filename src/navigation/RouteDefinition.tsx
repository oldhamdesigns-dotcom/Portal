import { useNavigationRoutes } from '@hooks/useNavigationRoutes';
import { Route, Routes } from 'react-router';
import Layout from '@layout/Layout';
import MainDashboard from '@pages/MainDashboard';
import Dashboard from '@pages/Dashboard';
import SearchResults from '@pages/SearchResults';
import CustomerProfile from '@pages/CustomerProfile';
import routes from '@/navigation/routes.json';
import NoMatch from '@pages/NoMatch';
import Login from '@pages/Login';
import { memo } from 'react';
import BreadcrumbsLayout from '@layout/BreadcrumbsLayout';
import useNonNavigationRoutes from '@hooks/useNonNavigationRoutes';

const RoutesDefinition = () => {
  const authRoutes = useNavigationRoutes();
  const nonNavigationRoutes = useNonNavigationRoutes();

  return (
    <Routes>
      <Route
        path={''}
        element={<Layout />}
      >
        <Route element={<MainDashboard />} path={routes.MAIN_DASHBOARD} />
        <Route element={<Dashboard />} path={routes.DASHBOARD} />
        <Route element={<SearchResults />} path={routes.SEARCH_RESULTS} />
        <Route element={<CustomerProfile />} path={routes.CUSTOMER_PROFILE} />
        {authRoutes.length
          ? authRoutes.map(({ path, Component = () => <></>, breadcrumbs = [] }, idx) => (
              <Route
                path={path}
                key={'route-' + idx}
                element={
                  <BreadcrumbsLayout breadcrumbs={breadcrumbs}>
                    <Component />
                  </BreadcrumbsLayout>
                }
              />
            ))
          : null}
        {nonNavigationRoutes.length
          ? nonNavigationRoutes.map(({ path, Component = () => <></>, breadcrumbs = [] }, idx) => (
              <Route
                path={path}
                key={'route-' + idx}
                element={
                  <BreadcrumbsLayout breadcrumbs={breadcrumbs}>
                    <Component />
                  </BreadcrumbsLayout>
                }
              />
            ))
          : null}
        <Route
          path={'*'}
          element={<NoMatch />}
        />
      </Route>
      <Route
        element={<Login />}
        path={routes.LOGIN}
      />
    </Routes>
  );
};

export default memo(RoutesDefinition);
