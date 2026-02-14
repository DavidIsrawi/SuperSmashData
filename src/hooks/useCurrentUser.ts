import { useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { GET_CURRENT_USER } from '../queries/player';
import { getCache, setCache } from '../api/cache';

export const useCurrentUser = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const client = useApolloClient();

  useEffect(() => {
    const fetchUser = async () => {
      const cacheKey = 'current-user';
      const cachedData = getCache<any>(cacheKey);

      if (cachedData) {
        setUserData(cachedData);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data } = await client.query({
          query: GET_CURRENT_USER,
        });
        setUserData(data);
        setCache(cacheKey, data);
      } catch (err) {
        console.error('Error fetching current user:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [client]);

  return { userData, loading, error };
};
