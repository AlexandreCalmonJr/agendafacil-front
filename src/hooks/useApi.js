import { useState, useCallback } from 'react';

/**
 * Hook para gerenciar chamadas de API com estados de loading e erro
 * @param {Function} apiFunc - Função da API a ser chamada
 * @returns {Object} { data, loading, error, execute }
 */
export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunc(...args);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.erro || 'Erro ao processar requisição';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { data, loading, error, execute, setData };
};
