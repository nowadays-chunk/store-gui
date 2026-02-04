import { useState, useCallback } from 'react';

/**
 * Custom hook for API calls with loading, error, and success states
 * @param {Function} apiFunction - The API function to call
 * @returns {Object} - { data, loading, error, execute, reset }
 */
export const useApi = (apiFunction) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFunction(...args);
            setData(result);
            return { success: true, data: result };
        } catch (err) {
            setError(err.message || 'An error occurred');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [apiFunction]);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return { data, loading, error, execute, reset };
};

/**
 * Custom hook for paginated API calls
 * @param {Function} apiFunction - The API function to call
 * @param {Object} initialParams - Initial query parameters
 * @returns {Object} - { data, loading, error, page, setPage, hasMore, loadMore }
 */
export const usePaginatedApi = (apiFunction, initialParams = {}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadPage = useCallback(async (pageNum, params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFunction({ ...initialParams, ...params, page: pageNum });

            if (pageNum === 1) {
                setData(result.data || result);
            } else {
                setData(prev => [...prev, ...(result.data || result)]);
            }

            setHasMore(result.hasMore !== undefined ? result.hasMore : (result.data || result).length > 0);
            return { success: true, data: result };
        } catch (err) {
            setError(err.message || 'An error occurred');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [apiFunction, initialParams]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadPage(nextPage);
        }
    }, [loading, hasMore, page, loadPage]);

    const refresh = useCallback(() => {
        setPage(1);
        setData([]);
        setHasMore(true);
        loadPage(1);
    }, [loadPage]);

    return { data, loading, error, page, setPage, hasMore, loadMore, refresh };
};

/**
 * Custom hook for form submission with API
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Options for the hook
 * @returns {Object} - { loading, error, success, submit, reset }
 */
export const useFormSubmit = (apiFunction, options = {}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const submit = useCallback(async (formData) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const result = await apiFunction(formData);
            setSuccess(true);

            if (options.onSuccess) {
                options.onSuccess(result);
            }

            return { success: true, data: result };
        } catch (err) {
            const errorMessage = err.message || 'An error occurred';
            setError(errorMessage);

            if (options.onError) {
                options.onError(errorMessage);
            }

            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [apiFunction, options]);

    const reset = useCallback(() => {
        setError(null);
        setSuccess(false);
        setLoading(false);
    }, []);

    return { loading, error, success, submit, reset };
};

/**
 * Custom hook for data fetching with auto-load
 * @param {Function} apiFunction - The API function to call
 * @param {Array} dependencies - Dependencies to trigger re-fetch
 * @returns {Object} - { data, loading, error, refetch }
 */
export const useFetch = (apiFunction, dependencies = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFunction();
            setData(result);
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [apiFunction]);

    useState(() => {
        fetchData();
    }, dependencies);

    return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for optimistic updates
 * @param {Function} apiFunction - The API function to call
 * @param {Function} updateFunction - Function to update local state optimistically
 * @returns {Object} - { loading, error, execute }
 */
export const useOptimisticUpdate = (apiFunction, updateFunction) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (data, rollbackData) => {
        try {
            setLoading(true);
            setError(null);

            // Optimistically update UI
            updateFunction(data);

            // Make API call
            const result = await apiFunction(data);

            return { success: true, data: result };
        } catch (err) {
            // Rollback on error
            if (rollbackData) {
                updateFunction(rollbackData);
            }

            setError(err.message || 'An error occurred');
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [apiFunction, updateFunction]);

    return { loading, error, execute };
};

export default {
    useApi,
    usePaginatedApi,
    useFormSubmit,
    useFetch,
    useOptimisticUpdate,
};
