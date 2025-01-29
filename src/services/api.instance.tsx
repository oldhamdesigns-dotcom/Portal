import axios from 'axios';
import store from '@/store';
import { startLoading, stopLoading } from '@redux/LoadingSlice';
import { toast } from 'react-toastify';
import { fetchAuthSession } from 'aws-amplify/auth';

const ApiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
});

const ignoredErrorUrls = [
  new RegExp(`^${import.meta.env.VITE_API_ENDPOINT}user\\/api\\/photo\\/[^\\/]+\\/user\\/[^\\/]+$`),
  new RegExp(
    `^${import.meta.env.VITE_API_ENDPOINT}order-management\\/api\\/orders\\/[^\\/]+\\/[^\\/]+\\/transaction$`
  ),
];
/*const ignoredLoaderUrl = [
  new RegExp(`^${import.meta.env.VITE_API_ENDPOINT}user\\/api\\/photo\\/[^\\/]+\\/user\\/[^\\/]+$`),
  new RegExp(
    `^${import.meta.env.VITE_API_ENDPOINT}order-management\\/api\\/orders\\/[^\\/]+\\/[^\\/]+\\/transaction$`
  ),
];*/

const handleError = (error: any) => {
  if ((error.response && error.response.status === 401) || error.message === 'Network Error') {
    toast.error(error.message);
    store.dispatch(stopLoading());
  } else {
    store.dispatch(stopLoading());
    for (const regex of ignoredErrorUrls) {
      if (regex.test(error.response.config.url)) {
        return Promise.reject(error);
      }
    }
    const errorMessage = error.response?.data?.message || error.message;
    toast.error(errorMessage);
  }
  return Promise.reject(error);
};

ApiInstance.interceptors.request.use(async (config) => {
  const { idToken } = (await fetchAuthSession()).tokens ?? {};
  config.headers.Authorization = `Bearer ${idToken}`;

  store.dispatch(startLoading());
  return config;
}, handleError);

ApiInstance.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  store.dispatch(stopLoading());
  return response;
}, handleError);

export default ApiInstance;
