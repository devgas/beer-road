import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(url, options.params ? { params: options.params } : undefined);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, options.params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => fetchData(), [fetchData]);

  return { data, loading, error, refetch };
}

export function useApi() {
  const { login, register, logout } = useAuth();

  const get = useCallback(async (url, config) => {
    const response = await api.get(url, config);
    return response.data;
  }, []);

  const post = useCallback(async (url, data) => {
    const response = await api.post(url, data);
    return response.data;
  }, []);

  const put = useCallback(async (url, data) => {
    const response = await api.put(url, data);
    return response.data;
  }, []);

  const patch = useCallback(async (url, data) => {
    const response = await api.patch(url, data);
    return response.data;
  }, []);

  const del = useCallback(async (url) => {
    const response = await api.delete(url);
    return response.data;
  }, []);

  return { api, get, post, put, patch, del, auth: { login, register, logout } };
}
