import { QueryClient, QueryClientProvider } from 'react-query';
import { TenantProvider } from '@/context/TenantContext';
import { Provider } from 'react-redux';
import store from '@/store';
import LoadingView from '@components/LoadingView';
import { ToastContainer } from 'react-toastify';
import RoutesDefinition from '@/navigation/RouteDefinition';

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
