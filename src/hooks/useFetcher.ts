import useSWR from "swr";
import api from "../config/axios/axios";
const fetcher = (url: string) => api.get(url).then((res) => res.data);

const useFetch = <T>(url: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useFetch;
