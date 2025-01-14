import useSWR from "swr";
import api from "../config/axios/axios";
import { useState } from "react";

const fetcher = async (
  url: string,
  method: string,
  options?: { params?: any; body?: any }
) => {
  let finalUrl = url;

  // Handle query parameters for GET requests
  if (options?.params) {
    const queryString = new URLSearchParams(options.params).toString();
    finalUrl += `?${queryString}`;
  }

  const config = {
    method,
    data: options?.body, // Add body for non-GET requests
  };

  const response = await api(finalUrl, config);
  let result = response.data;
  if (method === "GET") {
    result = response.data.data;
  }
  return result;
};

const useFetcher = <T>(url: string, method: string = "GET") => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const { data, mutate } = useSWR<T>(method === "GET" ? url : null, () =>
    fetcher(url, method)
  );

  const trigger = async (options?: { params?: any; body?: any }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher(url, method, options);
      mutate(result, false);
      return result;
    } catch (err: any) {
      setError(err.response?.data || err.message || "Unknown error");
      throw err.response?.data || err;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, mutate, trigger };
};

export default useFetcher;
