import useSWR from 'swr';
import api from '../config/axios/axios';
import { useState, useEffect } from 'react';

const fetcher = async (
  url: string,
  method: string,
  options?: {
    params?: any;
    body?: any;
    contentType?: 'application/json' | 'multipart/form-data';
  }
) => {
  let finalUrl = url;

  if (options?.params) {
    const queryString = new URLSearchParams(options.params).toString();
    finalUrl += `?${queryString}`;
  }

  const headers: Record<string, string> = {};
  if (options?.contentType === 'multipart/form-data') {
    delete headers['Content-Type'];
  } else {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers,
    data: options?.body,
  };

  try {
    const response = await api(finalUrl, config);
    return method === 'GET' ? response.data.data : response.data;
  } catch (error: any) {
    throw error.response?.data || error.message || 'Unknown error';
  }
};

const useFetcher = <T>(
  url: string,
  method: string = 'GET',
  contentType: 'application/json' | 'multipart/form-data' = 'application/json'
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const {
    data,
    mutate,
    isValidating,
    error: swrError,
  } = useSWR<T>(method === 'GET' ? url : null, () => fetcher(url, method), {
    revalidateOnFocus: false,
    onError: (err) => {
      setError(err);
    },
  });

  useEffect(() => {
    if (method === 'GET') {
      setIsLoading(isValidating);
    }
  }, [isValidating, method]);

  useEffect(() => {
    if (swrError) {
      setError(swrError); // Set error state when SWR encounters an error
    }
  }, [swrError]);

  const trigger = async (options?: { url?: string; body?: any }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher(options?.url || url, method, {
        body: options?.body,
        contentType,
      });
      mutate(result, false);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, mutate, trigger };
};

export default useFetcher;
