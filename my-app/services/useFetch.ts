import { useEffect, useState, useCallback } from "react";

const useFetch = <T>(
  fetchFunction: (params?: any) => Promise<T>,
  initialParams: any = {},
  autoFetch = true
) => {
  const [params, setParams] = useState(initialParams);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Use useCallback so the function identity is stable for useEffect deps
  const fetchData = useCallback(
    async (overrideParams: any = {}) => {
      const finalParams = { ...params, ...overrideParams };
      setParams(finalParams);

      try {
        setLoading(true);
        setError(null);

        const result = await fetchFunction(finalParams);

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction, params]
  );

  const reset = () => {
    setData(null);
    setLoading(false);
    setError(null);
    setParams(initialParams);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
    // We only want to run this on mount, so ignore fetchData in deps intentionally
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, reset, refetch: fetchData };
};

export default useFetch;
