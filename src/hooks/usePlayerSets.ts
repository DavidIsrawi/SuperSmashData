import { useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { GET_PLAYER_SETS } from '../queries/player';
import { getCache, setCache } from '../api/cache';
import { GetPlayerSetsQuery, GetPlayerSetsQueryVariables } from '../gql/graphql';

type SetNode = NonNullable<NonNullable<NonNullable<GetPlayerSetsQuery['player']>['sets']>['nodes']>[number];

export const usePlayerSets = (playerId: string | undefined, totalSetsNeeded: number = 300) => {
  const [sets, setSets] = useState<SetNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const client = useApolloClient();

  useEffect(() => {
    if (!playerId) {
      setSets([]);
      return;
    }

    const fetchAllSets = async () => {
      const cacheKey = `player-sets-${playerId}-${totalSetsNeeded}`;
      const cachedData = getCache<SetNode[]>(cacheKey);

      if (cachedData) {
        setSets(cachedData);
        return;
      }

      setLoading(true);
      setError(null);
      let allSets: SetNode[] = [];
      const perPage = 25;
      const totalPagesToFetch = Math.ceil(totalSetsNeeded / perPage);

      try {
        for (let page = 1; page <= totalPagesToFetch; page++) {
          // Add a delay between requests to avoid rate limiting
          if (page > 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }

          const { data } = await client.query<GetPlayerSetsQuery, GetPlayerSetsQueryVariables>({
            query: GET_PLAYER_SETS,
            variables: { playerId, page, perPage },
            // Use network-only to ensure we don't just get cached data if we want fresh analysis
            fetchPolicy: 'network-only',
          });

          const pageSets = (data?.player?.sets?.nodes || []).filter((s): s is SetNode => !!s);
          allSets = [...allSets, ...pageSets];

          // If we got fewer than perPage, we've reached the end
          if (pageSets.length < perPage) {
            break;
          }

          // Also check totalPages from pageInfo if available
          const totalPagesFromApi = data?.player?.sets?.pageInfo?.totalPages;
          if (totalPagesFromApi !== undefined && totalPagesFromApi !== null && page >= totalPagesFromApi) {
            break;
          }
        }
        setSets(allSets);
        setCache(cacheKey, allSets);
      } catch (err) {
        console.error('Error fetching sets:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSets();
  }, [playerId, totalSetsNeeded, client]);

  return { sets, loading, error };
};
