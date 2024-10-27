import { useEffect, useState } from "react";

interface UseFetchedDataReturn<T> {
	data: T | null;
	error: Error | null;
	loading: boolean;
}

export const useFetchedData = <T>(url: string): UseFetchedDataReturn<T> => {
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}${url}`, { signal: abortController.signal });
          
        if (!abortController.signal.aborted) {
            const json = await response.json();
            setData(json);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
            setError(error);
        }
      } finally {
        if (!abortController.signal.aborted) {
            setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
        abortController.abort();
    };
	}, [url]);

	return { data, error, loading };
};
