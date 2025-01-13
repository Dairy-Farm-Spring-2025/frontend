import useSWR from "swr";
import api from "../config/axios/axios";
import { useState } from "react";

const fetcher = async (url: string, method: string, body?: any) => {
  const config = { method, data: body };
  const response = await api(url, config);
  return response.data;
};

const useFetcher = <T>(url: string, method: string = "GET") => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const { data, mutate } = useSWR<T>(
    method === "GET" ? url : null,
    () => fetcher(url, method)
  );

  const trigger = async (options?: { body?: any }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher(url, method, options?.body);
      mutate(result, false); // Update SWR cache
      return result;
    } catch (err: any) {
      setError(err.response.data);
      throw err.response.data;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, mutate, trigger };
};

export default useFetcher;
