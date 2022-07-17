import Axios, { AxiosRequestConfig } from 'axios';

export const DEFAULT_URL = 'http://localhost:8001/api';
export const AXIOS_INSTANCE = Axios.create({ baseURL: DEFAULT_URL }); // use your own URL here or environment variable

// add a second `options` argument here if you want to pass extra options to each generated query
export const apiOverride = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const source = Axios.CancelToken.source();

    const promise = AXIOS_INSTANCE({
      ...config,
      ...options,
      cancelToken: source.token,
    }).then(({ data }) => data);

    return promise;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export { Axios };
