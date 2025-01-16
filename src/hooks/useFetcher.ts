import useSWR from "swr";
import api from "../config/axios/axios";
import { useState, useEffect } from "react";

const fetcher = async (
  url: string,
  method: string,
  options?: {
    params?: any;
    body?: any;
    contentType?: "application/json" | "multipart/form-data"; // Add contentType option
  }
) => {
  let finalUrl = url;

  // Handle query parameters for GET requests
  if (options?.params) {
    const queryString = new URLSearchParams(options.params).toString();
    finalUrl += `?${queryString}`;
  }

  const headers: Record<string, string> = {};
  if (options?.contentType === "multipart/form-data") {
    // For multipart, omit setting Content-Type; axios will handle it
    delete headers["Content-Type"];
  } else {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    method,
    headers,
    data: options?.body, // Add body for non-GET requests
  };

  const response = await api(finalUrl, config);
  let result = response.data;
  if (method === "GET") {
    result = response.data.data;
  }
  return result;
};

const useFetcher = <T>(
  url: string,
  method: string = "GET",
  contentType: "application/json" | "multipart/form-data" = "application/json"
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const { data, mutate, isValidating } = useSWR<T>(
    method === "GET" ? url : null,
    () => fetcher(url, method),
    {
      revalidateOnFocus: false, // Optional: prevent revalidation on focus
    }
  );

  // Track loading state for GET requests
  useEffect(() => {
    if (method === "GET") {
      setIsLoading(isValidating);
    }
  }, [isValidating, method]);

  const trigger = async (options?: { params?: any; body?: any }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher(url, method, { ...options, contentType });
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
