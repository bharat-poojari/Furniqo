import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall, options = {}) => {
    const { 
      showSuccess = false,
      showError = true,
      successMessage = 'Success!',
      onSuccess,
      onError,
      onFinally,
    } = options;
    
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      
      if (response?.data?.success) {
        if (showSuccess) {
          toast.success(successMessage);
        }
        onSuccess?.(response.data);
        return response.data;
      } else {
        const message = response?.data?.message || 'Something went wrong';
        throw new Error(message);
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'An error occurred';
      setError(message);
      
      if (showError) {
        toast.error(message);
      }
      
      onError?.(err);
      throw err;
    } finally {
      setLoading(false);
      onFinally?.();
    }
  }, []);

  return { loading, error, execute, setError };
};