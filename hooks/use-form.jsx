import React from 'react'
import { toast } from 'sonner';

const UseFetch = (cb) => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
 const fn = async (...args) => {
    setLoading(true);
    setError(null);
    try {
        const data = await cb(...args);
        setData(data);
        setError(null);
    } catch (error) {
        setError(error);
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
  }
  return {data, loading, error, fn};
}

export default UseFetch