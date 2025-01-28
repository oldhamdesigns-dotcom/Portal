import { Route, Routes } from 'react-router';
import Login from '@pages/Login';
import routes from '@/navigation/routes.json';
import MainDashboard from '@pages/MainDashboard';
import { QueryClient, QueryClientProvider } from 'react-query';
import Layout from '@layout/Layout';
import NoMatch from '@pages/NoMatch';
import { useNavigationRoutes } from '@hooks/useNavigationRoutes';
import { TenantProvider } from '@/context/TenantContext';
import { Provider } from 'react-redux';
import store from '@/store';
import LoadingView from '@components/LoadingView';
import { ToastContainer } from 'react-toastify';


const RoutesDefinition = () => {
  const authRoutes = useNavigationRoutes();

  return (
    <Routes>
      <Route
        path={''}
        element={<Layout />}
      >
        <Route
          element={<MainDashboard />}
          path={routes.MAIN_DASHBOARD}
        />
        {authRoutes.length
          ? authRoutes.map(({ path, Component = () => <></> }, idx) => (
            <Route
              path={path}
              key={'route-' + idx}
              element={<Component />}
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

const queryClient = new QueryClient();

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <LoadingView />
        <ToastContainer
          pauseOnFocusLoss={false}
          pauseOnHover={false}
        />
        <TenantProvider>
          <RoutesDefinition />
        </TenantProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;














